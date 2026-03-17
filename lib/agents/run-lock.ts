/**
 * Generation run locking.
 * Ensures only one active generation run per project.
 * Uses updatedAt for stale-run detection (not startedAt).
 */

import { prisma } from "@/lib/db";

const STALE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

export interface LockResult {
  acquired: boolean;
  runId?: string;
  existingRunId?: string;
  error?: string;
}

/**
 * Attempt to acquire a generation-run lock for the project.
 * If an active run exists and is fresh, returns conflict.
 * If an active run exists but is stale (>15min without update), marks it failed and allows new run.
 */
export async function acquireRunLock(
  projectId: string,
  triggeredBy: "api" | "retry" | "manual" = "api"
): Promise<LockResult> {
  // Check for existing active run
  const existing = await prisma.generationRun.findFirst({
    where: {
      projectId,
      status: "running",
    },
    orderBy: { startedAt: "desc" },
  });

  if (existing) {
    const elapsed = Date.now() - existing.updatedAt.getTime();

    if (elapsed < STALE_THRESHOLD_MS) {
      // Fresh run still active — reject
      return {
        acquired: false,
        existingRunId: existing.id,
        error: "generation already in progress",
      };
    }

    // Stale run — mark as failed
    await prisma.generationRun.update({
      where: { id: existing.id },
      data: {
        status: "failed",
        error: "Marked as failed: stale run (no update in 15+ minutes)",
        completedAt: new Date(),
      },
    });
  }

  // Create new run
  const run = await prisma.generationRun.create({
    data: {
      projectId,
      status: "running",
      currentPhase: "planning",
      triggeredBy,
    },
  });

  return {
    acquired: true,
    runId: run.id,
  };
}

/**
 * Release the run lock by marking the run as terminal.
 */
export async function releaseRunLock(
  runId: string,
  status: "complete" | "partial_complete" | "failed",
  options?: {
    error?: string;
    summaryJson?: string;
  }
): Promise<void> {
  await prisma.generationRun.update({
    where: { id: runId },
    data: {
      status,
      currentPhase: status,
      completedAt: new Date(),
      error: options?.error,
      summaryJson: options?.summaryJson,
    },
  });
}

/**
 * Update the run's phase and counters.
 */
export async function updateRunProgress(
  runId: string,
  data: {
    currentPhase?: string;
    pagesPlanned?: number;
    pagesCompleted?: number;
    pagesFailed?: number;
    reviewScore?: number;
    logs?: string;
  }
): Promise<void> {
  await prisma.generationRun.update({
    where: { id: runId },
    data,
  });
}

/**
 * Append a log entry to the run's log array.
 */
export async function appendRunLog(
  runId: string,
  entry: { phase: string; message: string; level: "info" | "warn" | "error"; data?: Record<string, unknown> }
): Promise<void> {
  const run = await prisma.generationRun.findUnique({
    where: { id: runId },
    select: { logs: true },
  });
  if (!run) return;

  const logs = JSON.parse(run.logs || "[]") as Array<Record<string, unknown>>;
  logs.push({
    ...entry,
    timestamp: new Date().toISOString(),
  });

  // Cap at 200 entries
  const trimmed = logs.length > 200 ? logs.slice(-200) : logs;

  await prisma.generationRun.update({
    where: { id: runId },
    data: { logs: JSON.stringify(trimmed) },
  });
}
