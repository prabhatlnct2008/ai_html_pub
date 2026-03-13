import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { processIntakeMessage } from "@/lib/ai/intake";
import { runWorkflow, buildStatus } from "@/lib/workflow/engine";
import type { BusinessContext } from "@/lib/workflow/types";

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

  // Ensure workflow exists
  if (!project.workflowRun) {
    // Will be created by buildStatus/runWorkflow
  }

  // Get current conversation
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
        status: "building",
        businessContext: JSON.stringify(result.extractedContext),
      },
    });

    if (result.isReady) {
      // Transition to intake_complete and run workflow autonomously
      const workflow = await prisma.workflowRun.findUnique({ where: { projectId: id } });
      if (workflow) {
        await prisma.workflowRun.update({
          where: { projectId: id },
          data: { state: "intake_complete" },
        });
      }

      // Mark intake step as completed
      if (workflow) {
        const steps = JSON.parse(workflow.steps);
        const intakeStep = steps.find((s: { name: string }) => s.name === "intake");
        if (intakeStep) {
          intakeStep.status = "completed";
          intakeStep.completedAt = new Date().toISOString();
        }
        await prisma.workflowRun.update({
          where: { projectId: id },
          data: { steps: JSON.stringify(steps) },
        });
      }

      // Run the autonomous workflow
      const status = await runWorkflow(id);

      return jsonResponse({
        ...status,
        messages,
      });
    }

    // Still in intake — return current status
    const status = await buildStatus(id);
    return jsonResponse({ ...status, messages });
  } catch (err: unknown) {
    console.error("Intake error:", err);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
