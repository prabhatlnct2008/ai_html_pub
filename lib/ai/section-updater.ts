import { chatCompletion, parseJSON } from "./openai-client";
import { buildSectionUpdatePrompt } from "./prompts/section-update";
import type { SectionData } from "./generator";

export async function regenerateSection(
  currentSection: SectionData,
  businessContext: Record<string, unknown>,
  userInstructions: string
): Promise<SectionData | null> {
  const prompt = buildSectionUpdatePrompt(
    currentSection as unknown as Record<string, unknown>,
    businessContext,
    userInstructions
  );

  const result = await chatCompletion(
    "You are a landing page content updater. Respond only with valid JSON matching the exact section schema provided.",
    prompt,
    { temperature: 0.6, maxTokens: 1500 }
  );

  const updated = parseJSON<SectionData>(result);
  if (!updated) return null;

  // Ensure id and type are preserved
  updated.id = currentSection.id;
  updated.type = currentSection.type;
  updated.order = currentSection.order;

  return updated;
}
