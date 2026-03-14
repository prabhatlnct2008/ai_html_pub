import type { Asset } from "@/lib/page/schema";
import type { ImagePrompt } from "./image-prompt-generator";
import { getPlaceholderUrl } from "@/lib/assets/placeholders";
import type { PlaceholderCategory } from "@/lib/assets/placeholders";

/**
 * Generate images from prompts using DALL-E API.
 * Falls back to placeholder on failure.
 *
 * NOTE: Requires OPENAI_API_KEY environment variable.
 * If not set, all images fall back to placeholders gracefully.
 */
export async function generateImages(
  prompts: ImagePrompt[],
  projectId: string
): Promise<Asset[]> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const assets: Asset[] = [];

  for (const prompt of prompts) {
    try {
      if (openaiKey) {
        const asset = await generateSingleImage(prompt, projectId, openaiKey);
        if (asset) {
          assets.push(asset);
          continue;
        }
      }

      // Fallback to placeholder
      assets.push(createPlaceholderAsset(prompt));
    } catch {
      assets.push(createPlaceholderAsset(prompt));
    }
  }

  return assets;
}

async function generateSingleImage(
  prompt: ImagePrompt,
  projectId: string,
  apiKey: string
): Promise<Asset | null> {
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt.prompt,
        n: 1,
        size: prompt.width >= 1024 ? "1024x1024" : "512x512",
        quality: "standard",
      }),
    });

    if (!response.ok) {
      console.error(`DALL-E API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) return null;

    // Download and save locally
    const savedUrl = await downloadAndSave(imageUrl, projectId, prompt.assetSlot);
    if (!savedUrl) return null;

    return {
      id: `asset_ai_${prompt.assetSlot}_${Math.random().toString(36).substring(2, 8)}`,
      kind: "image",
      source: "ai",
      url: savedUrl,
      alt: `AI-generated ${prompt.sectionType} image`,
    };
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
}

async function downloadAndSave(
  imageUrl: string,
  projectId: string,
  slot: string
): Promise<string | null> {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");

    const uploadDir = path.join(process.cwd(), "public", "uploads", projectId);
    await fs.mkdir(uploadDir, { recursive: true });

    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    const filename = `ai_${slot}_${Date.now()}.png`;
    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, buffer);

    return `/uploads/${projectId}/${filename}`;
  } catch {
    return null;
  }
}

function createPlaceholderAsset(prompt: ImagePrompt): Asset {
  const categoryMap: Record<string, PlaceholderCategory> = {
    hero: "hero",
    features: "feature",
    services: "service",
    testimonials: "testimonial",
  };
  const category = categoryMap[prompt.sectionType] || "general";

  return {
    id: `asset_placeholder_${prompt.assetSlot}_${Math.random().toString(36).substring(2, 8)}`,
    kind: "image",
    source: "placeholder",
    url: getPlaceholderUrl(category, prompt.width, prompt.height),
    alt: `${prompt.sectionType} image placeholder`,
  };
}
