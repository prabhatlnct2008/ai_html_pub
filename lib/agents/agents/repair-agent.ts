/**
 * Repair Agent
 * Fixes issues flagged by the site reviewer.
 * Retries: 2x per target, Fallback: skip repair for target
 */

import { chatCompletion, parseJSON } from "@/lib/ai/openai-client";
import { REPAIR_AGENT_SYSTEM, buildRepairUserPrompt } from "../prompts/repair";
import type { ReviewIssue } from "../types";
import type { Section, PageDocument } from "@/lib/page/schema";

const MAX_RETRIES = 2;

export async function runRepairAgent(
  issue: ReviewIssue,
  pageDocument: PageDocument,
  pageSlug: string,
  businessContext: Record<string, unknown>
): Promise<{ repairedSection: Section | null; repairedSections: Section[] | null; skipped: boolean }> {
  const currentSection = issue.targetSectionId
    ? pageDocument.sections.find((s) => s.id === issue.targetSectionId) || null
    : null;

  const pageContext = {
    slug: pageSlug,
    title: pageDocument.meta.title,
    sections: pageDocument.sections.map((s) => ({
      id: s.id,
      type: s.type,
      content: s.content,
    })),
  };

  const userPrompt = buildRepairUserPrompt(
    issue,
    currentSection as Record<string, unknown> | null,
    pageContext,
    businessContext
  );

  let lastError: string | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await chatCompletion(REPAIR_AGENT_SYSTEM, userPrompt, {
        temperature: 0.5,
        maxTokens: 3000,
        timeoutMs: 30_000,
      });

      const parsed = parseJSON<Record<string, unknown>>(response);
      if (!parsed) {
        lastError = "Failed to parse repair JSON";
        continue;
      }

      // Check if it's a sections array response (page-scope repair)
      if (Array.isArray(parsed.sections)) {
        return {
          repairedSection: null,
          repairedSections: parsed.sections as Section[],
          skipped: false,
        };
      }

      // Single section repair
      if (parsed.id && parsed.type) {
        return {
          repairedSection: parsed as unknown as Section,
          repairedSections: null,
          skipped: false,
        };
      }

      lastError = "Repair response has unexpected structure";
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }
  }

  console.warn(`Repair Agent failed for issue "${issue.description}" after ${MAX_RETRIES + 1} attempts: ${lastError}. Skipping.`);
  return { repairedSection: null, repairedSections: null, skipped: true };
}
