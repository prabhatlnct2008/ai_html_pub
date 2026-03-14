import type { WorkflowState } from "./types";

/**
 * Given the current state, determine the next auto-transition state.
 * Returns null if the state requires execution or user input or is terminal.
 */
export function getNextState(
  current: WorkflowState,
  context: { hasCompetitorUrl: boolean }
): WorkflowState | null {
  switch (current) {
    case "intake_complete":
      return context.hasCompetitorUrl
        ? "competitor_analysis_running"
        : "strategy_generation";

    case "competitor_analysis_complete":
      return "strategy_generation";

    // States that require runner execution (return null)
    case "competitor_analysis_running":
    case "strategy_generation":
    case "theme_generation":
    case "asset_planning":
    case "image_prompt_generation":
    case "image_generation":
    case "plan_generation_running":
    case "generation_running":
    case "document_assembly":
    case "rendering":
    case "saving":
      return null;

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
    case "strategy_generation":
      return "strategy_generation";
    case "theme_generation":
      return "theme_generation";
    case "asset_planning":
      return "asset_planning";
    case "image_prompt_generation":
      return "image_prompt_generation";
    case "image_generation":
      return "image_generation";
    case "plan_generation_running":
      return "plan_generation";
    case "plan_review":
      return "plan_approval";
    case "generation_running":
      return "section_generation";
    case "document_assembly":
      return "document_assembly";
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
        "strategy_generation", "theme_generation", "asset_planning",
        "image_prompt_generation", "image_generation",
        "plan_generation_running", "plan_review",
        "generation_running", "document_assembly", "rendering", "saving", "complete",
      ]
    : [
        "intake", "intake_complete",
        "strategy_generation", "theme_generation", "asset_planning",
        "image_prompt_generation", "image_generation",
        "plan_generation_running", "plan_review",
        "generation_running", "document_assembly", "rendering", "saving", "complete",
      ];

  const idx = allStates.indexOf(state);
  if (idx === -1) return 0;
  return Math.round((idx / (allStates.length - 1)) * 100);
}
