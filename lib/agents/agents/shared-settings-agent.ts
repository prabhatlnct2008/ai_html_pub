/**
 * Shared Settings Agent
 * Creates theme, actions, header, footer, nav from business context + site plan.
 * Retries: 2x, Fallback: DEFAULT_SITE_SETTINGS
 */

import { chatCompletion, parseJSON } from "@/lib/ai/openai-client";
import {
  SHARED_SETTINGS_SYSTEM,
  buildSharedSettingsUserPrompt,
} from "../prompts/shared-settings";
import { validateSiteSettings } from "../tools/validators";
import { buildFallbackSettings } from "../tools/fallbacks";
import type { SitePlan, SiteSettingsDraft } from "../types";

const MAX_RETRIES = 2;

export async function runSharedSettingsAgent(
  businessContext: Record<string, unknown>,
  sitePlan: SitePlan
): Promise<{ settings: SiteSettingsDraft; usedFallback: boolean }> {
  const userPrompt = buildSharedSettingsUserPrompt(businessContext, sitePlan);
  let lastError: string | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await chatCompletion(SHARED_SETTINGS_SYSTEM, userPrompt, {
        temperature: 0.7,
        maxTokens: 3000,
        timeoutMs: 45_000,
      });

      const parsed = parseJSON<SiteSettingsDraft>(response);
      if (!parsed) {
        lastError = "Failed to parse site settings JSON";
        continue;
      }

      const validation = validateSiteSettings(parsed, sitePlan);
      if (!validation.valid) {
        lastError = `Validation failed: ${validation.errors.join(", ")}`;
        continue;
      }

      return { settings: parsed, usedFallback: false };
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
    }
  }

  console.warn(`Shared Settings Agent failed after ${MAX_RETRIES + 1} attempts: ${lastError}. Using fallback.`);
  return {
    settings: buildFallbackSettings(businessContext),
    usedFallback: true,
  };
}
