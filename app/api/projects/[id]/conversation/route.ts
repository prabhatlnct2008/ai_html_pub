import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { handleConversationMessage } from "@/lib/ai/orchestrator";

// Get conversation state
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { conversation: true, pagePlan: true },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  return jsonResponse({
    conversation: project.conversation
      ? {
          messages: JSON.parse(project.conversation.messages),
          workflowState: project.conversation.workflowState,
        }
      : null,
    plan: project.pagePlan
      ? {
          planData: JSON.parse(project.pagePlan.planData),
          status: project.pagePlan.status,
        }
      : null,
    projectStatus: project.status,
  });
}

// Send message to AI
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const body = await request.json();
  const { message } = body;

  if (!message) {
    return errorResponse("Message is required");
  }

  try {
    // Update project status to building
    if (project.status === "draft") {
      await prisma.project.update({
        where: { id },
        data: { status: "building" },
      });
    }

    const result = await handleConversationMessage(id, message);

    // Re-fetch conversation to get latest state
    const conversation = await prisma.conversation.findUnique({
      where: { projectId: id },
    });

    const pagePlan = await prisma.pagePlan.findUnique({
      where: { projectId: id },
    });

    return jsonResponse({
      aiMessage: result.message,
      workflowState: result.workflowState,
      plan: pagePlan
        ? {
            planData: JSON.parse(pagePlan.planData),
            status: pagePlan.status,
          }
        : null,
      projectStatus:
        result.workflowState === "complete" ? "generated" : "building",
      messages: conversation ? JSON.parse(conversation.messages) : [],
    });
  } catch (err: unknown) {
    console.error("AI conversation error:", err);
    return errorResponse(
      "Something went wrong with the AI. Please try again.",
      500
    );
  }
}
