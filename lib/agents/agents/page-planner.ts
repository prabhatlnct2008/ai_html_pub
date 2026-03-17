/**
 * Page Planner Agent
 * Plans sections for a single page.
 * Retries: 2x per page, Fallback: default template per page type
 *
 * Post-parse normalization ensures every section has a valid variant,
 * filling missing variants via selectVariant() from the preference table.
 */

import { agentChatCompletion, parseAgentJSON } from "../model";
import { PAGE_PLANNER_SYSTEM, buildPagePlannerUserPrompt } from "../prompts/page-planner";
import { validatePagePlan } from "../tools/validators";
import { buildFallbackPagePlan } from "../tools/fallbacks";
import { selectVariant, normalizeVariantStrict } from "@/lib/page/variant-selector";
import type { SitePlanPage, AgenticPagePlan } from "../types";
import type { SectionType } from "@/lib/page/schema";

const MAX_RETRIES = 2;

export async function runPagePlannerAgent(
  page: SitePlanPage,
  otherPageSummaries: string[],
  businessContext: Record<string, unknown>,
  existingPlans: AgenticPagePlan[],
  themeVariant?: string
): Promise<{ plan: AgenticPagePlan; usedFallback: boolean }> {
  const userPrompt = buildPagePlannerUserPrompt(page, otherPageSummaries, businessContext, themeVariant);
  let lastError: string | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await agentChatCompletion(PAGE_PLANNER_SYSTEM, userPrompt, {
        temperature: 0.7,
        maxTokens: 2000,
        timeoutMs: 30_000,
      });

      const parsed = parseAgentJSON<AgenticPagePlan>(response);
      if (!parsed) {
        lastError = "Failed to parse page plan JSON";
        continue;
      }

      // Ensure slug matches
      parsed.slug = page.slug;
      parsed.title = parsed.title || page.title;
      parsed.pageType = parsed.pageType || page.pageType;

      // Post-parse normalization: ensure every section has a valid variant
      normalizePlanVariants(parsed, page.pageType, themeVariant || "clean", businessContext);

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
  const fallback = buildFallbackPagePlan(page.slug, page.title, page.pageType);
  normalizePlanVariants(fallback, page.pageType, themeVariant || "clean", businessContext);
  return {
    plan: fallback,
    usedFallback: true,
  };
}

/**
 * Ensure every section in the plan has a valid variant.
 * If the LLM omitted a variant or returned an invalid one,
 * fill it using selectVariant() from the preference table.
 */
function normalizePlanVariants(
  plan: AgenticPagePlan,
  pageType: string,
  themeVariant: string,
  businessContext: Record<string, unknown>
): void {
  for (let i = 0; i < plan.sections.length; i++) {
    const section = plan.sections[i];
    if (section.variant) {
      // Validate the variant — if invalid, replace
      section.variant = normalizeVariantStrict(section.type as SectionType, section.variant);
    } else {
      // Missing variant — select one based on context
      section.variant = selectVariant({
        sectionType: section.type,
        pageType,
        themeVariant,
        sectionPosition: i,
        totalSections: plan.sections.length,
        seed: businessContext.businessName as string | undefined,
      });
    }
  }
}
