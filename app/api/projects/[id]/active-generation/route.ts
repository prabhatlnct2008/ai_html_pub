import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

/**
 * GET /api/projects/[id]/active-generation
 *
 * Returns the runId of any active (status="running") GenerationRun for this project.
 * Used by the builder to recover runId after page reload without needing localStorage.
 * Returns 404 if no active run exists.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project || project.userId !== auth.user.userId) {
    return errorResponse("Project not found", 404);
  }

  const activeRun = await prisma.generationRun.findFirst({
    where: {
      projectId: id,
      status: "running",
    },
    orderBy: { startedAt: "desc" },
    select: {
      id: true,
      status: true,
      currentPhase: true,
      startedAt: true,
      updatedAt: true,
    },
  });

  if (!activeRun) {
    return errorResponse("No active generation run", 404);
  }

  return jsonResponse({
    runId: activeRun.id,
    status: activeRun.status,
    currentPhase: activeRun.currentPhase,
    startedAt: activeRun.startedAt.toISOString(),
    updatedAt: activeRun.updatedAt.toISOString(),
  });
}
