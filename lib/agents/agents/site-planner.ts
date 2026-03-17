/**
 * Site Planner Agent
 * Infers sitemap & page purposes from business context.
 * Retries: 2x, Fallback: minimal sitemap (home + contact)
 */

import { agentChatCompletion, parseAgentJSON } from "../model";
import { SITE_PLANNER_SYSTEM, buildSitePlannerUserPrompt } from "../prompts/site-planner";
import { validateSitePlan } from "../tools/validators";
import { buildFallbackSitePlan } from "../tools/fallbacks";
import type { SitePlan } from "../types";

const MAX_RETRIES = 2;

export async function runSitePlannerAgent(
  businessContext: Record<string, unknown>
): Promise<{ plan: SitePlan; usedFallback: boolean }> {
  const userPrompt = buildSitePlannerUserPrompt(businessContext);
  let lastError: string | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await agentChatCompletion(SITE_PLANNER_SYSTEM, userPrompt, {
        temperature: 0.7,
        maxTokens: 3000,
        timeoutMs: 45_000,
      });

      const parsed = parseAgentJSON<SitePlan>(response);
      if (!parsed) {
        lastError = "Failed to parse site plan JSON";
        continue;
      }

      const validation = validateSitePlan(parsed);
      if (!validation.valid) {
        lastError = `Validation failed: ${validation.errors.join(", ")}`;
        continue;
      }

      return { plan: parsed, usedFallback: false };
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }
  }

  // Fallback
  console.warn(`Site Planner Agent failed after ${MAX_RETRIES + 1} attempts: ${lastError}. Using fallback.`);
  return {
    plan: buildFallbackSitePlan(businessContext),
    usedFallback: true,
  };
}
