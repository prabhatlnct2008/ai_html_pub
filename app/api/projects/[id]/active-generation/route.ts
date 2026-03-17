import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";

const STALE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes — matches run-lock.ts

/**
 * GET /api/projects/[id]/active-generation
 *
 * Returns the runId of any active (status="running") GenerationRun for this project.
 * Applies the same stale-run rule as run-lock.ts: if a "running" run hasn't been
 * updated in 15+ minutes, it is marked as failed and not returned as active.
 *
 * Query params:
 *   includeTerminal=true — also check for the most recent terminal run
 *     (complete, partial_complete, failed). Returns { terminal: true, ... }
 *     if found and no active run exists. Used by detectFlowMode to identify
 *     previously-finished agentic projects.
 *
 * Returns 404 if no relevant run exists.
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

  // Check for active running run
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
      error: true,
    },
  });

  if (activeRun) {
    const elapsed = Date.now() - activeRun.updatedAt.getTime();

    if (elapsed < STALE_THRESHOLD_MS) {
      // Fresh active run
      return jsonResponse({
        runId: activeRun.id,
        status: activeRun.status,
        currentPhase: activeRun.currentPhase,
        startedAt: activeRun.startedAt.toISOString(),
        updatedAt: activeRun.updatedAt.toISOString(),
      });
    }

    // Stale run — mark as failed so it doesn't block future runs
    await prisma.generationRun.update({
      where: { id: activeRun.id },
      data: {
        status: "failed",
        error: "Marked as failed: stale run (no update in 15+ minutes)",
        completedAt: new Date(),
      },
    });
    // Fall through to terminal check below
  }

  // Check for terminal run if requested
  const includeTerminal = request.nextUrl.searchParams.get("includeTerminal") === "true";
  if (includeTerminal) {
    const terminalRun = await prisma.generationRun.findFirst({
      where: {
        projectId: id,
        status: { in: ["complete", "partial_complete", "failed"] },
      },
      orderBy: { completedAt: "desc" },
      select: {
        id: true,
        status: true,
        currentPhase: true,
        startedAt: true,
        completedAt: true,
        updatedAt: true,
        error: true,
      },
    });

    if (terminalRun) {
      return jsonResponse({
        terminal: true,
        runId: terminalRun.id,
        status: terminalRun.status,
        currentPhase: terminalRun.currentPhase,
        startedAt: terminalRun.startedAt.toISOString(),
        completedAt: terminalRun.completedAt?.toISOString() || null,
        updatedAt: terminalRun.updatedAt.toISOString(),
        error: terminalRun.error,
      });
    }
  }

  return errorResponse("No active generation run", 404);
}
