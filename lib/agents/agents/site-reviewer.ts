/**
 * Site Review Agent
 * Evaluates entire site quality: consistency, completeness, content quality.
 * Retries: 1x, Fallback: skip review
 */

import { agentChatCompletion, parseAgentJSON } from "../model";
import { SITE_REVIEWER_SYSTEM, buildSiteReviewerUserPrompt } from "../prompts/site-reviewer";
import type { SiteReviewResult, SiteSettingsDraft } from "../types";
import type { PageDocument } from "@/lib/page/schema";

const MAX_RETRIES = 1;

export async function runSiteReviewerAgent(
  pages: Array<{ slug: string; title: string; document: PageDocument }>,
  siteSettings: SiteSettingsDraft
): Promise<{ review: SiteReviewResult | null; skipped: boolean }> {
  const pagesForPrompt = pages.map((p) => ({
    slug: p.slug,
    title: p.title,
    document: {
      sections: p.document.sections.map((s) => ({
        id: s.id,
        type: s.type,
        content: s.content,
      })),
      actions: p.document.actions,
    },
  }));

  const settingsForPrompt = {
    brand: siteSettings.brand as unknown as Record<string, unknown>,
    actions: siteSettings.actions,
    navigation: siteSettings.navigation,
  };

  const userPrompt = buildSiteReviewerUserPrompt(pagesForPrompt, settingsForPrompt);
  let lastError: string | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await agentChatCompletion(SITE_REVIEWER_SYSTEM, userPrompt, {
        temperature: 0.3,
        maxTokens: 3000,
        timeoutMs: 45_000,
      });

      const parsed = parseAgentJSON<SiteReviewResult>(response);
      if (!parsed) {
        lastError = "Failed to parse review JSON";
        continue;
      }

      // Validate structure
      if (typeof parsed.overallScore !== "number" || !Array.isArray(parsed.issues)) {
        lastError = "Invalid review result structure";
        continue;
      }

      return { review: parsed, skipped: false };
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }
  }

  console.warn(`Site Reviewer Agent failed after ${MAX_RETRIES + 1} attempts: ${lastError}. Skipping review.`);
  return { review: null, skipped: true };
}
