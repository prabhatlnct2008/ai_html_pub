import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { runWorkflow } from "@/lib/workflow/engine";
import { isAgenticGenerationEnabled } from "@/lib/config";

/**
 * POST /api/projects/[id]/answer
 *
 * Submit an answer or skip for a kickoff question.
 * Body: { field: string, value: string } or { field: string, skipped: true }
 * Or: { skipAll: true } to skip all remaining questions.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const { id: projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const businessContext = JSON.parse(project.businessContext || "{}");
  const kickoff = businessContext._kickoff;

  if (!kickoff || kickoff.status !== "questioning") {
    return errorResponse("Not in questioning state", 400);
  }

  const body = await request.json();
  const { field, value, skipped, skipAll } = body;

  // Handle "skip all remaining"
  if (skipAll) {
    for (const q of kickoff.questions) {
      if (!q.answered && !q.skipped) {
        q.skipped = true;
      }
    }
    kickoff.status = "complete";
    kickoff.currentQuestionIndex = kickoff.questions.length;

    // Add message to conversation
    await addConversationMessage(projectId, "user", "Skip remaining questions");
    await addConversationMessage(
      projectId,
      "assistant",
      "Got it — proceeding with AI-suggested defaults for the remaining details."
    );

    businessContext._kickoff = kickoff;
    await prisma.project.update({
      where: { id: projectId },
      data: { businessContext: JSON.stringify(businessContext) },
    });

    // Transition workflow past intake
    await transitionWorkflowPastIntake(projectId, businessContext);

    if (isAgenticGenerationEnabled()) {
      return jsonResponse({ status: "complete", agenticReady: true, kickoff });
    }

    const workflowStatus = await runWorkflow(projectId);
    return jsonResponse({ status: "complete", kickoff, workflow: workflowStatus });
  }

  // Handle individual answer/skip
  if (!field) {
    return errorResponse("Field is required", 400);
  }

  const questionIndex = kickoff.questions.findIndex(
    (q: { field: string }) => q.field === field
  );
  if (questionIndex === -1) {
    return errorResponse("Question not found", 400);
  }

  const question = kickoff.questions[questionIndex];

  if (skipped) {
    question.skipped = true;
    await addConversationMessage(projectId, "user", "Skipped");
  } else {
    question.answered = true;
    question.answer = value;

    // Apply the answer to businessContext
    applyAnswer(businessContext, field, value);

    await addConversationMessage(projectId, "user", value);
  }

  // Advance to next unanswered question
  let nextIndex = kickoff.currentQuestionIndex;
  while (nextIndex < kickoff.questions.length) {
    const q = kickoff.questions[nextIndex];
    if (!q.answered && !q.skipped) break;
    nextIndex++;
  }
  kickoff.currentQuestionIndex = nextIndex;

  // Check if all questions are answered or skipped
  const allDone = kickoff.questions.every(
    (q: { answered: boolean; skipped: boolean }) => q.answered || q.skipped
  );

  if (allDone) {
    kickoff.status = "complete";

    businessContext._kickoff = kickoff;
    await prisma.project.update({
      where: { id: projectId },
      data: { businessContext: JSON.stringify(businessContext) },
    });

    // Transition workflow past intake
    await transitionWorkflowPastIntake(projectId, businessContext);

    if (isAgenticGenerationEnabled()) {
      return jsonResponse({ status: "complete", agenticReady: true, kickoff });
    }

    const workflowStatus = await runWorkflow(projectId);
    return jsonResponse({ status: "complete", kickoff, workflow: workflowStatus });
  }

  businessContext._kickoff = kickoff;
  await prisma.project.update({
    where: { id: projectId },
    data: { businessContext: JSON.stringify(businessContext) },
  });

  return jsonResponse({
    status: "questioning",
    kickoff,
    currentQuestion: kickoff.questions[kickoff.currentQuestionIndex],
  });
}

/**
 * Apply a user answer to the appropriate businessContext field.
 */
function applyAnswer(
  businessContext: Record<string, unknown>,
  field: string,
  value: string
) {
  switch (field) {
    case "targetAudience":
      businessContext.targetAudience = value;
      break;
    case "primaryCta":
      businessContext.primaryCta = value;
      break;
    case "tone":
      businessContext.tone = value;
      break;
    case "businessType":
      businessContext.businessType = value;
      break;
    case "mainOffer":
      businessContext.mainOffer = value;
      break;
    case "contactMethod":
      businessContext._primaryCtaType = value;
      break;
    default:
      // Store unknown fields with underscore prefix
      businessContext[`_${field}`] = value;
      break;
  }
}

/**
 * Transition workflow from intake to intake_complete.
 */
async function transitionWorkflowPastIntake(
  projectId: string,
  businessContext: Record<string, unknown>
) {
  // Update conversation aiContext
  const conv = await prisma.conversation.findUnique({ where: { projectId } });
  if (conv) {
    await prisma.conversation.update({
      where: { id: conv.id },
      data: { aiContext: JSON.stringify(businessContext) },
    });
  }

  // Update workflow run
  let workflowRun = await prisma.workflowRun.findUnique({ where: { projectId } });
  if (!workflowRun) {
    const { buildInitialSteps } = await import("@/lib/workflow/types");
    const hasCompetitorUrl = !!businessContext.competitorUrl;
    const steps = buildInitialSteps(hasCompetitorUrl);

    workflowRun = await prisma.workflowRun.create({
      data: {
        projectId,
        state: "intake_complete",
        currentStep: "Business info collected",
        steps: JSON.stringify(steps),
        canUserReply: false,
      },
    });
  } else if (workflowRun.state === "intake") {
    const steps = JSON.parse(workflowRun.steps);
    const intakeStep = steps.find((s: { name: string }) => s.name === "intake");
    if (intakeStep) {
      intakeStep.status = "completed";
      intakeStep.completedAt = new Date().toISOString();
    }

    await prisma.workflowRun.update({
      where: { projectId },
      data: {
        state: "intake_complete",
        currentStep: "Business info collected",
        steps: JSON.stringify(steps),
        canUserReply: false,
      },
    });
  }
}

/**
 * Add a message to the conversation.
 */
async function addConversationMessage(
  projectId: string,
  role: "user" | "assistant",
  content: string
) {
  const conv = await prisma.conversation.findUnique({ where: { projectId } });
  if (!conv) return;

  const messages = JSON.parse(conv.messages || "[]");
  messages.push({ role, content });

  await prisma.conversation.update({
    where: { id: conv.id },
    data: { messages: JSON.stringify(messages) },
  });
}
