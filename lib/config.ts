/**
 * Application configuration helpers.
 * Centralizes feature flags and environment-based settings.
 */

/**
 * Whether new projects should use the agentic multi-page generation flow
 * instead of the legacy single-page workflow.
 *
 * Controlled by the AGENTIC_GENERATION_ENABLED env var (default: true).
 * This is the primary gating strategy for new generations.
 * Existing project/run state is used only for resume/classification,
 * not as the primary feature flag.
 */
export function isAgenticGenerationEnabled(): boolean {
  return process.env.AGENTIC_GENERATION_ENABLED !== "false";
}
