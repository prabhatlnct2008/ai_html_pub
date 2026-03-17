/**
 * Graph Node: finalize
 * Updates navigation, flips page statuses draft→published, closes GenerationRun.
 */

import { prisma } from "@/lib/db";
import { updateSiteNavigation } from "@/lib/site/navigation";
import type { SiteBuildStateType } from "../site-build-state";
import { releaseRunLock, appendRunLog, updateRunProgress } from "../../run-lock";
import type { LogEntry, GenerationSummary, BuildPhase } from "../../types";

export async function finalizeNode(
  state: SiteBuildStateType
): Promise<Partial<SiteBuildStateType>> {
  const logs: LogEntry[] = [];
  const log = (message: string, level: "info" | "warn" | "error" = "info") => {
    logs.push({ timestamp: new Date().toISOString(), phase: "finalizing", message, level });
  };

  log("Finalizing site generation...");
  await updateRunProgress(state.runId, { currentPhase: "finalizing" });
  await appendRunLog(state.runId, { phase: "finalizing", message: "Finalizing", level: "info" });

  // Flip completed pages from draft → published
  for (const slug of state.completedPages) {
    try {
      const page = await prisma.page.findUnique({
        where: { projectId_slug: { projectId: state.projectId, slug } },
      });
      if (page && page.status === "draft") {
        await prisma.page.update({
          where: { id: page.id },
          data: { status: "published" },
        });
        log(`Published: /${slug}`);
      }
    } catch (err) {
      log(`Failed to publish /${slug}: ${err}`, "error");
    }
  }

  // Update site navigation
  try {
    await updateSiteNavigation(state.projectId);
    log("Navigation updated");
  } catch (err) {
    log(`Failed to update navigation: ${err}`, "error");
  }

  // Determine terminal status
  let terminalStatus: "complete" | "partial_complete" | "failed";
  let terminalPhase: BuildPhase;

  if (state.failedPages.length === 0 && state.completedPages.length > 0) {
    terminalStatus = "complete";
    terminalPhase = "complete";
  } else if (state.completedPages.length > 0) {
    terminalStatus = "partial_complete";
    terminalPhase = "partial_complete";
  } else {
    terminalStatus = "failed";
    terminalPhase = "failed";
  }

  // Update project status based on terminal outcome
  const projectStatus =
    terminalStatus === "complete"
      ? "generated"
      : terminalStatus === "partial_complete"
        ? "partial_generated"
        : "generation_failed";

  await prisma.project.update({
    where: { id: state.projectId },
    data: { status: projectStatus },
  });

  // Build summary
  const startedAt = await prisma.generationRun.findUnique({
    where: { id: state.runId },
    select: { startedAt: true },
  });

  const summary: GenerationSummary = {
    pages: [
      ...state.completedPages.map((slug) => ({
        slug,
        title: state.pagePlans[slug]?.title || slug,
        status: "published" as const,
        sectionCount: state.pageDocuments[slug]?.sections.length || 0,
      })),
      ...state.failedPages.map((slug) => ({
        slug,
        title: state.pagePlans[slug]?.title || slug,
        status: "failed" as const,
        sectionCount: 0,
      })),
    ],
    totalDurationMs: startedAt ? Date.now() - startedAt.startedAt.getTime() : 0,
    reviewScore: state.reviewResult?.overallScore ?? null,
    repairsAttempted: state.repairsAttempted,
    repairsSucceeded: state.repairsSucceeded,
    warnings: state.logs.filter((l) => l.level === "warn").map((l) => l.message),
  };

  // Release run lock with summary
  await releaseRunLock(state.runId, terminalStatus, {
    summaryJson: JSON.stringify(summary),
  });

  log(`Generation complete: ${terminalStatus} (${state.completedPages.length} pages published, ${state.failedPages.length} failed)`);
  await appendRunLog(state.runId, {
    phase: "finalizing",
    message: `Done: ${terminalStatus}`,
    level: "info",
  });

  return {
    currentPhase: terminalPhase,
    logs,
  };
}
