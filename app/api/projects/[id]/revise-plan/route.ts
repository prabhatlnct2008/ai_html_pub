import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { modifyPlan } from "@/lib/ai/planner";
import { buildStatus } from "@/lib/workflow/engine";

export async function POST(
  request: NextRequest,
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
    return errorResponse("No plan to revise", 400);
  }

  const body = await request.json();
  const { feedback } = body;

  if (!feedback) {
    return errorResponse("Feedback is required");
  }

  const currentPlan = JSON.parse(project.pagePlan.planData);

  try {
    const modified = await modifyPlan(currentPlan, feedback);
    if (!modified) {
      return errorResponse("Failed to modify plan. Please try again.", 500);
    }

    await prisma.pagePlan.update({
      where: { id: project.pagePlan.id },
      data: {
        planData: JSON.stringify(modified),
        version: { increment: 1 },
      },
    });

    // Add messages to conversation
    const conv = await prisma.conversation.findUnique({ where: { projectId: id } });
    if (conv) {
      const messages = JSON.parse(conv.messages);
      messages.push({ role: "user", content: `Plan feedback: ${feedback}` });

      const planSummary = modified.sections
        .map((s: { type: string; description: string }, i: number) => `${i + 1}. ${s.type.charAt(0).toUpperCase() + s.type.slice(1)}: ${s.description}`)
        .join("\n");
      messages.push({
        role: "assistant",
        content: `Plan updated based on your feedback:\n\n${planSummary}\n\nPlease review and approve or request more changes.`,
      });

      await prisma.conversation.update({
        where: { id: conv.id },
        data: { messages: JSON.stringify(messages) },
      });
    }

    const status = await buildStatus(id);
    const allMessages = conv ? JSON.parse((await prisma.conversation.findUnique({ where: { projectId: id } }))?.messages || "[]") : [];

    return jsonResponse({ ...status, plan: modified, messages: allMessages });
  } catch (err: unknown) {
    console.error("Plan revision error:", err);
    return errorResponse("Failed to revise plan. Please try again.", 500);
  }
}
