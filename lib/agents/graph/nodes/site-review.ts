/**
 * Graph Node: site_review
 * Evaluates the whole site for quality issues.
 */

import type { SiteBuildStateType } from "../site-build-state";
import { runSiteReviewerAgent } from "../../agents/site-reviewer";
import { appendRunLog, updateRunProgress } from "../../run-lock";
import type { LogEntry, RepairItem } from "../../types";

const MAX_REVIEW_PASSES = 2;

export async function siteReviewNode(
  state: SiteBuildStateType
): Promise<Partial<SiteBuildStateType>> {
  const logs: LogEntry[] = [];
  const log = (message: string, level: "info" | "warn" | "error" = "info") => {
    logs.push({ timestamp: new Date().toISOString(), phase: "reviewing", message, level });
  };

  // Skip review if no completed pages
  if (state.completedPages.length === 0) {
    log("No completed pages to review", "warn");
    return { currentPhase: "failed", logs };
  }

  // Check review pass limit
  if (state.reviewPassCount >= MAX_REVIEW_PASSES) {
    log(`Max review passes (${MAX_REVIEW_PASSES}) reached — proceeding to finalize`);
    return { currentPhase: "finalizing", logs };
  }

  log("Starting site review...");
  await updateRunProgress(state.runId, { currentPhase: "reviewing" });
  await appendRunLog(state.runId, { phase: "reviewing", message: "Site review started", level: "info" });

  if (!state.siteSettingsDraft) {
    log("No site settings — skipping review", "warn");
    return { currentPhase: "finalizing", logs, reviewPassCount: state.reviewPassCount + 1 };
  }

  const pagesForReview = state.completedPages
    .map((slug) => ({
      slug,
      title: state.pagePlans[slug]?.title || slug,
      document: state.pageDocuments[slug],
    }))
    .filter((p) => p.document);

  const { review, skipped } = await runSiteReviewerAgent(pagesForReview, state.siteSettingsDraft);

  if (skipped || !review) {
    log("Review skipped or failed — proceeding to finalize", "warn");
    return {
      currentPhase: "finalizing",
      reviewPassCount: state.reviewPassCount + 1,
      logs,
    };
  }

  log(`Review complete: score ${review.overallScore}, ${review.issues.length} issues`);
  await appendRunLog(state.runId, {
    phase: "reviewing",
    message: `Score: ${review.overallScore}, Issues: ${review.issues.length}`,
    level: "info",
  });

  await updateRunProgress(state.runId, { reviewScore: review.overallScore });

  // Build repair queue from error-severity issues
  const repairQueue: RepairItem[] = review.issues
    .filter((issue) => issue.severity === "error" && issue.targetSlug)
    .map((issue) => ({
      issue,
      targetSlug: issue.targetSlug!,
      targetSectionId: issue.targetSectionId,
    }));

  // Decide next phase
  let nextPhase: "repairing" | "finalizing" = "finalizing";
  if (repairQueue.length > 0 && state.repairPassCount < 2) {
    nextPhase = "repairing";
    log(`${repairQueue.length} issues queued for repair`);
  } else if (repairQueue.length > 0) {
    log(`${repairQueue.length} issues found but max repair passes reached — skipping`);
  }

  return {
    reviewResult: review,
    repairQueue,
    reviewPassCount: state.reviewPassCount + 1,
    currentPhase: nextPhase,
    logs,
  };
}
