import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-helpers";
import type { GenerationStatusResponse, GenerationSummary, LogEntry } from "@/lib/agents/types";

/**
 * GET /api/projects/[id]/generation-status?runId=...
 *
 * Returns the status and progress of a generation run.
 * Client polls every 3-5 seconds until status is terminal.
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

  const url = new URL(request.url);
  const runId = url.searchParams.get("runId");

  if (!runId) {
    // If no runId, return the latest run for this project
    const latestRun = await prisma.generationRun.findFirst({
      where: { projectId: id },
      orderBy: { startedAt: "desc" },
    });

    if (!latestRun) {
      return errorResponse("No generation runs found", 404);
    }

    return jsonResponse(buildStatusResponse(latestRun));
  }

  const run = await prisma.generationRun.findUnique({
    where: { id: runId },
  });

  if (!run || run.projectId !== id) {
    return errorResponse("Generation run not found", 404);
  }

  return jsonResponse(buildStatusResponse(run));
}

function buildStatusResponse(run: {
  id: string;
  status: string;
  currentPhase: string;
  pagesPlanned: number;
  pagesCompleted: number;
  pagesFailed: number;
  reviewScore: number | null;
  startedAt: Date;
  completedAt: Date | null;
  updatedAt: Date;
  error: string | null;
  logs: string;
  summaryJson: string | null;
}): GenerationStatusResponse {
  let recentLogs: LogEntry[] = [];
  try {
    const allLogs = JSON.parse(run.logs || "[]") as LogEntry[];
    recentLogs = allLogs.slice(-20); // Last 20 entries
  } catch {
    recentLogs = [];
  }

  let summary: GenerationSummary | null = null;
  if (run.summaryJson) {
    try {
      summary = JSON.parse(run.summaryJson) as GenerationSummary;
    } catch {
      summary = null;
    }
  }

  return {
    runId: run.id,
    status: run.status,
    currentPhase: run.currentPhase,
    progress: {
      pagesPlanned: run.pagesPlanned,
      pagesCompleted: run.pagesCompleted,
      pagesFailed: run.pagesFailed,
    },
    reviewScore: run.reviewScore,
    startedAt: run.startedAt.toISOString(),
    completedAt: run.completedAt?.toISOString() ?? null,
    updatedAt: run.updatedAt.toISOString(),
    error: run.error,
    recentLogs,
    summary,
  };
}
