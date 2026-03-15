import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { buildStatus } from "@/lib/workflow/engine";
import { getProgressSince } from "@/lib/workflow/progress";

export async function GET(
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

  const status = await buildStatus(id);

  // Include conversation messages
  const conv = await prisma.conversation.findUnique({ where: { projectId: id } });
  const messages = conv ? JSON.parse(conv.messages) : [];

  // Support ?since= param for incremental progress updates
  const sinceParam = request.nextUrl.searchParams.get("since");
  const sinceTs = sinceParam ? parseInt(sinceParam, 10) : 0;
  const progressEntries = await getProgressSince(id, sinceTs);

  // Include kickoff state from businessContext
  const businessContext = JSON.parse(project.businessContext || "{}");
  const kickoff = businessContext._kickoff || null;

  return jsonResponse({
    workflow: status,
    messages,
    progressLog: progressEntries,
    kickoff,
  });
}
