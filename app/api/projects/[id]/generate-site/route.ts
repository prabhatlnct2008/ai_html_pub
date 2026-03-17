import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { acquireRunLock } from "@/lib/agents/run-lock";
import { runSiteBuildOrchestrator } from "@/lib/agents/orchestrator";

/**
 * POST /api/projects/[id]/generate-site
 *
 * Starts agentic multi-page site generation.
 * Returns 202 { runId } immediately, generation runs async.
 */
export async function POST(
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

  // Check business context
  const ctx = JSON.parse(project.businessContext || "{}");
  if (!ctx.businessName) {
    return errorResponse("Business context is incomplete. Complete the intake first.", 400);
  }

  // Acquire run lock
  const lock = await acquireRunLock(id, "api");

  if (!lock.acquired) {
    return jsonResponse(
      {
        error: lock.error || "generation already in progress",
        existingRunId: lock.existingRunId,
      },
      409
    );
  }

  // Fire and forget — orchestrator runs as detached async
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  runSiteBuildOrchestrator(id, lock.runId!).catch((err) => {
    console.error(`Orchestrator failed for run ${lock.runId}:`, err);
  });

  return jsonResponse({ runId: lock.runId }, 202);
}
