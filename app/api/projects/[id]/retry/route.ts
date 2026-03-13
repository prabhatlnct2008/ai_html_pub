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
    include: { workflowRun: true },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  if (!project.workflowRun || project.workflowRun.state !== "failed") {
    return errorResponse("Workflow is not in a failed state", 400);
  }

  // Find the last step that was in_progress or failed and determine retry state
  const steps = JSON.parse(project.workflowRun.steps);
  const failedStep = steps.find((s: { status: string }) => s.status === "failed");

  // Map step name back to a workflow state for retry
  const retryStateMap: Record<string, string> = {
    competitor_analysis: "competitor_analysis_running",
    plan_generation: "plan_generation_running",
    section_generation: "generation_running",
    rendering: "rendering",
    saving: "saving",
  };

  const retryState = failedStep
    ? retryStateMap[failedStep.name] || "plan_generation_running"
    : "plan_generation_running";

  // Reset the failed step to in_progress
  if (failedStep) {
    failedStep.status = "pending";
    failedStep.error = undefined;
  }

  await prisma.workflowRun.update({
    where: { projectId: id },
    data: {
      state: retryState,
      lastError: null,
      steps: JSON.stringify(steps),
      canUserReply: false,
    },
  });

  // Re-run workflow
  const status = await runWorkflow(id);

  const conv = await prisma.conversation.findUnique({ where: { projectId: id } });
  const messages = conv ? JSON.parse(conv.messages) : [];

  return jsonResponse({ workflow: status, messages });
}
