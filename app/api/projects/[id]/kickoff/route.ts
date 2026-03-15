import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { chatCompletion, parseJSON } from "@/lib/ai/openai-client";
import { buildKickoffSystemPrompt, buildKickoffUserPrompt } from "@/lib/ai/prompts/kickoff";

interface KickoffQuestion {
  field: string;
  question: string;
  options: string[];
  aiSuggestion?: string;
  required: boolean;
  answered: boolean;
  skipped: boolean;
  answer?: string;
}

interface KickoffInference {
  inferred: {
    businessType: string;
    targetAudience: string;
    primaryCta: { type: string; label: string };
    tone: string;
    pageType: string;
    mainOffer: string;
  };
  confidence: Record<string, "high" | "medium" | "low">;
  questions: Array<{
    field: string;
    question: string;
    options: string[];
    aiSuggestion?: string;
    required: boolean;
  }> | null;
  summary: string;
}

/**
 * POST /api/projects/[id]/kickoff
 *
 * Auto-triggers AI inference from minimal business input.
 * Idempotent based on _kickoff.status (see plan A3).
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

  // No _kickoff = legacy project, do nothing
  if (!kickoff) {
    return jsonResponse({ status: "legacy", message: "Legacy project, no kickoff needed" });
  }

  // Idempotency guard (A3)
  if (kickoff.status === "complete") {
    return jsonResponse({ status: "complete", kickoff });
  }

  if (kickoff.status === "questioning") {
    return jsonResponse({ status: "questioning", kickoff });
  }

  if (kickoff.status === "inferring") {
    // Check staleness: if inferring for >60s, assume interrupted
    const updatedAt = new Date(project.updatedAt).getTime();
    const now = Date.now();
    const staleMs = 60_000;

    if (now - updatedAt < staleMs) {
      // Another request is in flight, return current state
      return jsonResponse({ status: "inferring", message: "Inference in progress" });
    }
    // Stale — reset to pending and re-run below
    kickoff.status = "pending";
  }

  if (kickoff.status !== "pending") {
    return jsonResponse({ status: kickoff.status, kickoff });
  }

  // Check WorkflowRun state guard — don't kickoff if workflow already past intake
  const workflowRun = await prisma.workflowRun.findUnique({
    where: { projectId },
  });
  if (workflowRun && workflowRun.state !== "intake" && workflowRun.state !== "kickoff_inferring") {
    kickoff.status = "complete";
    businessContext._kickoff = kickoff;
    await prisma.project.update({
      where: { id: projectId },
      data: { businessContext: JSON.stringify(businessContext) },
    });
    return jsonResponse({ status: "complete", message: "Workflow already past intake" });
  }

  // Transition to inferring (optimistic lock)
  kickoff.status = "inferring";
  businessContext._kickoff = kickoff;
  await prisma.project.update({
    where: { id: projectId },
    data: { businessContext: JSON.stringify(businessContext) },
  });

  // Run AI inference
  try {
    const systemPrompt = buildKickoffSystemPrompt();
    const userPrompt = buildKickoffUserPrompt({
      businessName: businessContext.businessName || project.name,
      businessDescription: businessContext.businessDescription || businessContext.businessType || "",
      competitorUrl: businessContext.competitorUrl || undefined,
    });

    const rawResponse = await chatCompletion(systemPrompt, userPrompt, {
      temperature: 0.6,
      maxTokens: 1500,
    });

    const result = parseJSON<KickoffInference>(rawResponse);
    if (!result) {
      throw new Error("Failed to parse kickoff inference response");
    }

    // Merge inferred fields into businessContext
    if (result.inferred.businessType) {
      businessContext.businessType = result.inferred.businessType;
    }
    if (result.inferred.targetAudience) {
      businessContext.targetAudience = result.inferred.targetAudience;
    }
    if (result.inferred.primaryCta) {
      businessContext.primaryCta = result.inferred.primaryCta.label || "";
      businessContext._primaryCtaType = result.inferred.primaryCta.type || "url";
    }
    if (result.inferred.tone) {
      businessContext.tone = result.inferred.tone;
    }
    if (result.inferred.mainOffer) {
      businessContext.mainOffer = result.inferred.mainOffer;
    }
    if (result.inferred.pageType) {
      businessContext._pageType = result.inferred.pageType;
    }

    // Update kickoff state
    kickoff.inferredAt = new Date().toISOString();
    kickoff.summary = result.summary;
    kickoff.confidence = result.confidence;

    if (result.questions && result.questions.length > 0) {
      // Has questions — go to questioning state
      kickoff.status = "questioning";
      kickoff.questions = result.questions.map((q): KickoffQuestion => ({
        field: q.field,
        question: q.question,
        options: q.options,
        aiSuggestion: q.aiSuggestion,
        required: q.required || false,
        answered: false,
        skipped: false,
      }));
      kickoff.currentQuestionIndex = 0;
    } else {
      // No questions — proceed directly
      kickoff.status = "complete";
    }

    businessContext._kickoff = kickoff;
    await prisma.project.update({
      where: { id: projectId },
      data: { businessContext: JSON.stringify(businessContext) },
    });

    // Add the summary as a conversation message
    if (result.summary) {
      const conv = await prisma.conversation.findUnique({ where: { projectId } });
      if (conv) {
        const messages = JSON.parse(conv.messages || "[]");
        messages.push({ role: "assistant", content: result.summary });
        await prisma.conversation.update({
          where: { id: conv.id },
          data: {
            messages: JSON.stringify(messages),
            aiContext: JSON.stringify(businessContext),
          },
        });
      }
    }

    // If kickoff complete (no questions), transition workflow to intake_complete
    if (kickoff.status === "complete") {
      await transitionWorkflowPastIntake(projectId, businessContext);
    }

    return jsonResponse({
      status: kickoff.status,
      kickoff,
      summary: result.summary,
    });
  } catch (err) {
    // On failure, reset to pending so it can be retried
    kickoff.status = "pending";
    kickoff.inferredAt = null;
    businessContext._kickoff = kickoff;
    await prisma.project.update({
      where: { id: projectId },
      data: { businessContext: JSON.stringify(businessContext) },
    });

    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return errorResponse(`Kickoff inference failed: ${errorMsg}`, 500);
  }
}

/**
 * Transition workflow from intake to intake_complete.
 * Also updates the conversation aiContext with the full business context.
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

  // Get or create workflow run
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
    // Mark intake step as completed
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
