/**
 * Graph transition logic.
 * Determines the next node based on current state.
 */

import type { SiteBuildStateType } from "./site-build-state";

/**
 * Route from site_review to either repair or finalize.
 */
export function routeAfterReview(state: SiteBuildStateType): "repair" | "finalize" {
  if (state.currentPhase === "repairing") return "repair";
  if (state.currentPhase === "finalizing") return "finalize";
  // Default: finalize
  return "finalize";
}

/**
 * Route from repair back to review or to finalize.
 */
export function routeAfterRepair(state: SiteBuildStateType): "site_review" | "finalize" {
  if (state.currentPhase === "reviewing") return "site_review";
  return "finalize";
}

/**
 * Route from page_generation to review or finalize (if all failed).
 */
export function routeAfterPageGeneration(state: SiteBuildStateType): "site_review" | "finalize" {
  if (state.currentPhase === "failed") return "finalize";
  return "site_review";
}

/**
 * Check if the graph should terminate.
 */
export function shouldTerminate(state: SiteBuildStateType): boolean {
  return (
    state.currentPhase === "complete" ||
    state.currentPhase === "partial_complete" ||
    state.currentPhase === "failed"
  );
}
