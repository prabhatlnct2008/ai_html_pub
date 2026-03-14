import { chatCompletion } from "./openai-client";

export interface ImagePrompt {
  assetSlot: string;
  sectionType: string;
  prompt: string;
  style: string;
  width: number;
  height: number;
}

/**
 * Generate DALL-E image prompts based on business context, strategy, and brand.
 * Returns prompts for hero and key section images.
 */
export async function generateImagePrompts(
  businessContext: Record<string, unknown>,
  strategy: { pageType: string; sectionSequence: Array<{ type: string; description: string }> },
  brand: { tone: string; primaryColor: string; themeVariant?: string }
): Promise<ImagePrompt[]> {
  const sectionsNeedingImages = strategy.sectionSequence
    .filter((s) => ["hero", "services", "features", "testimonials", "results", "about-team"].includes(s.type))
    .slice(0, 5); // max 5 images

  const prompt = `You are an image prompt engineer for DALL-E. Generate image prompts for a ${strategy.pageType} landing page.

Business: ${businessContext.businessName || "Business"}
Type: ${businessContext.businessType || "general"}
Audience: ${businessContext.targetAudience || "general audience"}
Tone: ${brand.tone}
Theme: ${brand.themeVariant || "clean"}
Differentiators: ${(businessContext.differentiators as string[] || []).join(", ") || "none specified"}

Sections that need images:
${sectionsNeedingImages.map((s, i) => `${i + 1}. ${s.type}: ${s.description}`).join("\n")}

For each section, create a DALL-E image prompt that:
- Is specific to this business (not generic stock photo vibes)
- Matches the tone (${brand.tone})
- Avoids text in the image
- Uses realistic photography style for local/service businesses
- Uses illustration style for SaaS/coach pages
- Describes composition, lighting, and mood

Return JSON array:
[
  {
    "sectionType": "hero",
    "prompt": "detailed DALL-E prompt...",
    "style": "photography" or "illustration"
  }
]`;

  try {
    const response = await chatCompletion(
      "You generate image prompts for DALL-E. Return only valid JSON.",
      prompt,
      { maxTokens: 1500 }
    );

    const match = response.match(/\[[\s\S]*\]/);
    if (!match) return getDefaultPrompts(businessContext, strategy);

    const parsed = JSON.parse(match[0]) as Array<{
      sectionType: string;
      prompt: string;
      style: string;
    }>;

    return parsed.map((p) => ({
      assetSlot: `${p.sectionType}_image`,
      sectionType: p.sectionType,
      prompt: p.prompt,
      style: p.style,
      width: p.sectionType === "hero" ? 1024 : 512,
      height: p.sectionType === "hero" ? 768 : 512,
    }));
  } catch {
    return getDefaultPrompts(businessContext, strategy);
  }
}

function getDefaultPrompts(
  ctx: Record<string, unknown>,
  strategy: { pageType: string; sectionSequence: Array<{ type: string }> }
): ImagePrompt[] {
  const businessName = (ctx.businessName as string) || "Business";
  const businessType = (ctx.businessType as string) || "professional service";

  const prompts: ImagePrompt[] = [];

  if (strategy.sectionSequence.some((s) => s.type === "hero")) {
    prompts.push({
      assetSlot: "hero_image",
      sectionType: "hero",
      prompt: `Professional, warm photograph representing a ${businessType} business called ${businessName}. Clean composition, natural lighting, trustworthy atmosphere. No text or logos in the image.`,
      style: "photography",
      width: 1024,
      height: 768,
    });
  }

  return prompts;
}
