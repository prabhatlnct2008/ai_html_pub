import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { processIntakeMessage } from "@/lib/ai/intake";
import { runWorkflow, buildStatus } from "@/lib/workflow/engine";
import { buildInitialSteps, type BusinessContext } from "@/lib/workflow/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { conversation: true, workflowRun: true },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const body = await request.json();
  const { message } = body;
  if (!message) return errorResponse("Message is required");

  // Ensure conversation exists
  let conv = project.conversation;
  if (!conv) {
    conv = await prisma.conversation.create({
      data: {
        projectId: id,
        messages: "[]",
        aiContext: project.businessContext,
      },
    });
  }

  // Ensure workflow exists
  let workflow = project.workflowRun;
  if (!workflow) {
    const ctx = JSON.parse(project.businessContext || "{}");
    const hasCompetitorUrl = !!ctx.competitorUrl;
    const steps = buildInitialSteps(hasCompetitorUrl);

    workflow = await prisma.workflowRun.create({
      data: {
        projectId: id,
        state: "intake",
        currentStep: "Understanding your business",
        steps: JSON.stringify(steps),
        canUserReply: true,
      },
    });
  }

  const messages = JSON.parse(conv.messages) as Array<{ role: string; content: string }>;
  const currentContext = JSON.parse(conv.aiContext) as Partial<BusinessContext>;

  // Add user message
  messages.push({ role: "user", content: message });

  // Process with AI
  try {
    const result = await processIntakeMessage(currentContext, messages, message);

    // Add AI response
    messages.push({ role: "assistant", content: result.message });

    // Update conversation with extracted context
    await prisma.conversation.update({
      where: { id: conv.id },
      data: {
        messages: JSON.stringify(messages),
        aiContext: JSON.stringify(result.extractedContext),
      },
    });

    // Also update project businessContext with extracted data
    await prisma.project.update({
      where: { id },
      data: {
        businessContext: JSON.stringify(result.extractedContext),
      },
    });

    if (result.isReady) {
      // Mark intake step as completed
      const steps = JSON.parse(workflow.steps);
      const intakeStep = steps.find((s: { name: string }) => s.name === "intake");
      if (intakeStep) {
        intakeStep.status = "completed";
        intakeStep.completedAt = new Date().toISOString();
      }

      // Transition to intake_complete so runWorkflow will auto-advance
      await prisma.workflowRun.update({
        where: { projectId: id },
        data: {
          state: "intake_complete",
          steps: JSON.stringify(steps),
          canUserReply: false,
          currentStep: "Business info collected",
        },
      });

      // Run the autonomous workflow (will auto-advance from intake_complete)
      const status = await runWorkflow(id);

      return jsonResponse({
        workflow: status,
        messages,
      });
    }

    // Still in intake — return current status
    const status = await buildStatus(id);
    return jsonResponse({ workflow: status, messages });
  } catch (err: unknown) {
    console.error("Intake error:", err);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
