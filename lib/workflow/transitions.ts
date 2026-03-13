import type { WorkflowState } from "./types";

/**
 * Given the current state, determine the next auto-transition state.
 * Returns null if the state requires user input or is terminal.
 */
export function getNextState(
  current: WorkflowState,
  context: { hasCompetitorUrl: boolean }
): WorkflowState | null {
  switch (current) {
    case "intake_complete":
      return context.hasCompetitorUrl
        ? "competitor_analysis_running"
        : "plan_generation_running";

    case "competitor_analysis_running":
      // Runner will execute this, then advance
      return null; // runner handles transition after execution

    case "competitor_analysis_complete":
      return "plan_generation_running";

    case "plan_generation_running":
      // Runner executes, then moves to plan_review
      return null;

    case "generation_running":
      // Runner executes, then moves to rendering
      return null;

    case "rendering":
      return null; // runner handles

    case "saving":
      return null; // runner handles

    // User-input states and terminal states
    case "intake":
    case "plan_review":
    case "complete":
    case "failed":
      return null;

    default:
      return null;
  }
}

/**
 * Map workflow state to which step name is currently active
 */
export function stateToStepName(state: WorkflowState): string {
  switch (state) {
    case "intake":
    case "intake_complete":
      return "intake";
    case "competitor_analysis_running":
    case "competitor_analysis_complete":
      return "competitor_analysis";
    case "plan_generation_running":
      return "plan_generation";
    case "plan_review":
      return "plan_approval";
    case "generation_running":
      return "section_generation";
    case "rendering":
      return "rendering";
    case "saving":
      return "saving";
    case "complete":
      return "saving"; // last step completed
    default:
      return "";
  }
}

/**
 * Calculate progress percent based on state
 */
export function stateToProgress(state: WorkflowState, hasCompetitorUrl: boolean): number {
  const allStates: WorkflowState[] = hasCompetitorUrl
    ? [
        "intake", "intake_complete",
        "competitor_analysis_running", "competitor_analysis_complete",
        "plan_generation_running", "plan_review",
        "generation_running", "rendering", "saving", "complete",
      ]
    : [
        "intake", "intake_complete",
        "plan_generation_running", "plan_review",
        "generation_running", "rendering", "saving", "complete",
      ];

  const idx = allStates.indexOf(state);
  if (idx === -1) return 0;
  return Math.round((idx / (allStates.length - 1)) * 100);
}
