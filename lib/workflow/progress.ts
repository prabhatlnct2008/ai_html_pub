import { prisma } from "@/lib/db";

export interface ProgressEntry {
  ts: number;
  type: "progress" | "text" | "question" | "plan_ready" | "complete" | "error";
  data: Record<string, unknown>;
}

const MAX_ENTRIES = 100;
const COMPACT_TO = 80;

/**
 * Append a progress entry to the workflow's progressLog.
 * Enforces cap at MAX_ENTRIES by dropping oldest non-text entries.
 */
export async function appendProgress(
  projectId: string,
  type: ProgressEntry["type"],
  data: Record<string, unknown>
): Promise<void> {
  const workflow = await prisma.workflowRun.findUnique({
    where: { projectId },
    select: { progressLog: true },
  });
  if (!workflow) return;

  const log: ProgressEntry[] = JSON.parse(workflow.progressLog || "[]");

  log.push({ ts: Date.now(), type, data });

  // Enforce cap
  if (log.length > MAX_ENTRIES) {
    // Keep most recent COMPACT_TO entries, preferring text entries
    const textEntries = log.filter((e) => e.type === "text");
    const nonTextEntries = log.filter((e) => e.type !== "text");

    // Drop oldest non-text entries first
    const keep = [...textEntries, ...nonTextEntries.slice(-COMPACT_TO)];
    keep.sort((a, b) => a.ts - b.ts);
    log.length = 0;
    log.push(...keep.slice(-COMPACT_TO));
  }

  await prisma.workflowRun.update({
    where: { projectId },
    data: { progressLog: JSON.stringify(log) },
  });
}

/**
 * Get progress entries newer than the given timestamp.
 */
export async function getProgressSince(
  projectId: string,
  sinceTs: number
): Promise<ProgressEntry[]> {
  const workflow = await prisma.workflowRun.findUnique({
    where: { projectId },
    select: { progressLog: true },
  });
  if (!workflow) return [];

  const log: ProgressEntry[] = JSON.parse(workflow.progressLog || "[]");
  return log.filter((entry) => entry.ts > sinceTs);
}

/**
 * Compact the progressLog on workflow completion.
 * Keeps only the final complete/error entry.
 */
export async function compactProgressLog(projectId: string): Promise<void> {
  const workflow = await prisma.workflowRun.findUnique({
    where: { projectId },
    select: { progressLog: true },
  });
  if (!workflow) return;

  const log: ProgressEntry[] = JSON.parse(workflow.progressLog || "[]");

  // Keep only the final entry (complete or error)
  const finalEntry = log.findLast(
    (e) => e.type === "complete" || e.type === "error"
  );

  await prisma.workflowRun.update({
    where: { projectId },
    data: {
      progressLog: JSON.stringify(finalEntry ? [finalEntry] : []),
    },
  });
}
