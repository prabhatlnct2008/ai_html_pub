/**
 * Page Generator Agent
 * Generates full PageDocument for a single page.
 * Retries: 2x per page, Fallback: mark page as failed
 */

import { chatCompletion, parseJSON } from "@/lib/ai/openai-client";
import { PAGE_GENERATOR_SYSTEM, buildPageGeneratorUserPrompt } from "../prompts/page-generator";
import { validatePageDocument } from "../tools/validators";
import type { PageDocument, Action } from "@/lib/page/schema";
import type { AgenticPagePlan, SiteSettingsDraft } from "../types";

const MAX_RETRIES = 2;

export async function runPageGeneratorAgent(
  pagePlan: AgenticPagePlan,
  siteSettings: SiteSettingsDraft,
  businessContext: Record<string, unknown>,
  siteActions: Action[]
): Promise<{ document: PageDocument | null; error?: string }> {
  const userPrompt = buildPageGeneratorUserPrompt(
    pagePlan,
    siteSettings.brand,
    siteActions,
    businessContext,
    {
      companyName: siteSettings.footer.companyName,
      tagline: siteSettings.footer.tagline,
      copyrightYear: siteSettings.footer.copyrightYear,
    }
  );
  let lastError: string | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await chatCompletion(PAGE_GENERATOR_SYSTEM, userPrompt, {
        temperature: 0.7,
        maxTokens: 4000,
        timeoutMs: 60_000,
      });

      const parsed = parseJSON<PageDocument>(response);
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
          themeVariant: "clean",
          slug: pagePlan.slug,
        };
      }
      parsed.meta.slug = pagePlan.slug;

      // Ensure brand from site settings
      if (!parsed.brand) {
        parsed.brand = siteSettings.brand;
      }

      // Default arrays
      if (!parsed.assets) parsed.assets = [];
      if (!parsed.actions) parsed.actions = [];
      if (!parsed.sections) parsed.sections = [];

      const validation = validatePageDocument(parsed, siteActions);
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
