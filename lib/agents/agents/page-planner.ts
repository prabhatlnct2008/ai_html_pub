/**
 * Page Planner Agent
 * Plans sections for a single page.
 * Retries: 2x per page, Fallback: default template per page type
 */

import { chatCompletion, parseJSON } from "@/lib/ai/openai-client";
import { PAGE_PLANNER_SYSTEM, buildPagePlannerUserPrompt } from "../prompts/page-planner";
import { validatePagePlan } from "../tools/validators";
import { buildFallbackPagePlan } from "../tools/fallbacks";
import type { SitePlanPage, AgenticPagePlan } from "../types";

const MAX_RETRIES = 2;

export async function runPagePlannerAgent(
  page: SitePlanPage,
  otherPageSummaries: string[],
  businessContext: Record<string, unknown>,
  existingPlans: AgenticPagePlan[]
): Promise<{ plan: AgenticPagePlan; usedFallback: boolean }> {
  const userPrompt = buildPagePlannerUserPrompt(page, otherPageSummaries, businessContext);
  let lastError: string | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await chatCompletion(PAGE_PLANNER_SYSTEM, userPrompt, {
        temperature: 0.7,
        maxTokens: 2000,
        timeoutMs: 30_000,
      });

      const parsed = parseJSON<AgenticPagePlan>(response);
      if (!parsed) {
        lastError = "Failed to parse page plan JSON";
        continue;
      }

      // Ensure slug matches
      parsed.slug = page.slug;
      parsed.title = parsed.title || page.title;
      parsed.pageType = parsed.pageType || page.pageType;

      const validation = validatePagePlan(parsed, existingPlans);
      if (!validation.valid) {
        lastError = `Validation failed: ${validation.errors.join(", ")}`;
        continue;
      }

      return { plan: parsed, usedFallback: false };
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }
  }

  console.warn(`Page Planner Agent failed for "${page.slug}" after ${MAX_RETRIES + 1} attempts: ${lastError}. Using fallback.`);
  return {
    plan: buildFallbackPagePlan(page.slug, page.title, page.pageType),
    usedFallback: true,
  };
}
