import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { runWorkflow } from "@/lib/workflow/engine";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { pagePlan: true, workflowRun: true },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  if (!project.pagePlan) {
    return errorResponse("No plan to approve", 400);
  }

  if (!project.workflowRun || project.workflowRun.state !== "plan_review") {
    return errorResponse("Workflow is not in plan review state", 400);
  }

  // Approve the plan
  await prisma.pagePlan.update({
    where: { id: project.pagePlan.id },
    data: { status: "approved" },
  });

  // Mark plan_approval step completed
  const steps = JSON.parse(project.workflowRun.steps);
  const approvalStep = steps.find((s: { name: string }) => s.name === "plan_approval");
  if (approvalStep) {
    approvalStep.status = "completed";
    approvalStep.completedAt = new Date().toISOString();
  }

  // Transition to generation_running
  await prisma.workflowRun.update({
    where: { projectId: id },
    data: {
      state: "generation_running",
      steps: JSON.stringify(steps),
      canUserReply: false,
      currentStep: "Generating your landing page...",
    },
  });

  // Add message to conversation
  const conv = await prisma.conversation.findUnique({ where: { projectId: id } });
  if (conv) {
    const messages = JSON.parse(conv.messages);
    messages.push({ role: "user", content: "Plan approved" });
    messages.push({ role: "assistant", content: "Plan approved! Generating your landing page now..." });
    await prisma.conversation.update({
      where: { id: conv.id },
      data: { messages: JSON.stringify(messages) },
    });
  }

  // Run the autonomous workflow from generation_running
  const status = await runWorkflow(id);

  const allMessages = conv ? JSON.parse((await prisma.conversation.findUnique({ where: { projectId: id } }))?.messages || "[]") : [];

  return jsonResponse({ ...status, messages: allMessages });
}
