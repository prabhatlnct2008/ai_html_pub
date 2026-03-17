/**
 * Page Generator Agent
 * Generates full PageDocument for a single page.
 * Retries: 2x per page, Fallback: mark page as failed
 *
 * Post-generation normalization enforces planned variants and applies
 * context-aware styling, even if the LLM ignores variant/style instructions.
 */

import { agentChatCompletion, parseAgentJSON } from "../model";
import { PAGE_GENERATOR_SYSTEM, buildPageGeneratorUserPrompt } from "../prompts/page-generator";
import { validatePageDocument } from "../tools/validators";
import { normalizeVariantStrict, getContextAwareSectionStyle } from "@/lib/page/variant-selector";
import type { PageDocument, Action, SectionType } from "@/lib/page/schema";
import type { AgenticPagePlan, SiteSettingsDraft } from "../types";

const MAX_RETRIES = 2;

export async function runPageGeneratorAgent(
  pagePlan: AgenticPagePlan,
  siteSettings: SiteSettingsDraft,
  businessContext: Record<string, unknown>,
  siteActions: Action[],
  themeVariant?: string
): Promise<{ document: PageDocument | null; error?: string }> {
  const effectiveThemeVariant = themeVariant || siteSettings.themeVariant || "clean";

  const userPrompt = buildPageGeneratorUserPrompt(
    pagePlan,
    siteSettings.brand,
    siteActions,
    businessContext,
    {
      companyName: siteSettings.footer.companyName,
      tagline: siteSettings.footer.tagline,
      copyrightYear: siteSettings.footer.copyrightYear,
    },
    effectiveThemeVariant
  );
  let lastError: string | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await agentChatCompletion(PAGE_GENERATOR_SYSTEM, userPrompt, {
        temperature: 0.7,
        maxTokens: 4000,
        timeoutMs: 60_000,
      });

      const parsed = parseAgentJSON<PageDocument>(response);
      if (!parsed) {
        lastError = "Failed to parse page document JSON";
        continue;
      }

      // Ensure meta fields
      if (!parsed.meta) {
        parsed.meta = {
          title: pagePlan.title,
          description: "",
          pageType: pagePlan.pageType as PageDocument["meta"]["pageType"],
          themeVariant: effectiveThemeVariant as PageDocument["meta"]["themeVariant"],
          slug: pagePlan.slug,
        };
      }
      parsed.meta.slug = pagePlan.slug;
      parsed.meta.themeVariant = effectiveThemeVariant as PageDocument["meta"]["themeVariant"];

      // Ensure brand from site settings
      if (!parsed.brand) {
        parsed.brand = siteSettings.brand;
      }

      // Default arrays
      if (!parsed.assets) parsed.assets = [];
      if (!parsed.actions) parsed.actions = [];
      if (!parsed.sections) parsed.sections = [];

      // Post-generation normalization: enforce planned variants and apply styling
      normalizeGeneratedDocument(parsed, pagePlan, siteSettings.brand, effectiveThemeVariant);

      const validation = validatePageDocument(parsed, siteActions, pagePlan);
      if (!validation.valid) {
        lastError = `Validation failed: ${validation.errors.join(", ")}`;
        continue;
      }

      return { document: parsed };
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }
  }

  console.warn(`Page Generator Agent failed for "${pagePlan.slug}" after ${MAX_RETRIES + 1} attempts: ${lastError}`);
  return { document: null, error: lastError || "Generation failed" };
}

/**
 * Post-generation normalization.
 * Enforces that section variants match what the planner decided,
 * and applies context-aware styling using all brand colors + themeVariant.
 *
 * Matching is done by section type (not array index) to handle cases where
 * the LLM inserts, drops, or reorders sections vs. the plan. When multiple
 * sections share the same type, planned variants are consumed in order
 * (first match gets first planned variant of that type, etc.).
 *
 * This is the "normalizer enforces" part of the pattern:
 * "planner decides, generator respects, normalizer enforces"
 */
function normalizeGeneratedDocument(
  doc: PageDocument,
  pagePlan: AgenticPagePlan,
  brand: { primaryColor: string; secondaryColor: string; accentColor: string },
  themeVariant: string
): void {
  // Build a per-type queue of planned variants so we can consume them in order.
  // E.g., if the plan has two "cta-band" sections with different variants,
  // the first generated cta-band gets the first planned variant, etc.
  const plannedVariantQueues: Record<string, string[]> = {};
  for (const planned of pagePlan.sections) {
    if (!plannedVariantQueues[planned.type]) {
      plannedVariantQueues[planned.type] = [];
    }
    if (planned.variant) {
      plannedVariantQueues[planned.type].push(planned.variant);
    }
  }

  for (let i = 0; i < doc.sections.length; i++) {
    const section = doc.sections[i];
    const queue = plannedVariantQueues[section.type];

    if (queue && queue.length > 0) {
      // Consume the next planned variant for this section type
      const plannedVariant = queue.shift()!;
      section.variant = normalizeVariantStrict(
        section.type as SectionType,
        plannedVariant
      );
    } else {
      // No planned variant available — validate whatever the LLM chose
      section.variant = normalizeVariantStrict(
        section.type as SectionType,
        section.variant
      );
    }

    // Apply context-aware styling (overrides AI-chosen styles to ensure consistency)
    section.style = getContextAwareSectionStyle(
      section.type as SectionType,
      brand,
      themeVariant,
      i,
      doc.sections.length
    );
  }
}
