import { chatCompletion, parseJSON } from "./openai-client";
import type { Brand, ThemeVariant, PageType } from "@/lib/page/schema";

export interface ThemeResult {
  brand: Brand;
  themeVariant: ThemeVariant;
}

export async function generateTheme(
  businessContext: Record<string, unknown>,
  pageType: PageType
): Promise<ThemeResult | null> {
  const prompt = `You are a brand and visual design expert. Create a complete brand/theme for a landing page.

BUSINESS CONTEXT:
${JSON.stringify(businessContext, null, 2)}

PAGE TYPE: ${pageType}

Respond with valid JSON:
{
  "brand": {
    "tone": "professional" | "casual" | "playful" | "bold" | "elegant" | "friendly" | "authoritative",
    "primaryColor": "#hex (the main brand color, used for buttons and accents)",
    "secondaryColor": "#hex (complementary color for backgrounds and secondary elements)",
    "accentColor": "#hex (highlight color for special elements)",
    "fontHeading": "Google Font name for headings",
    "fontBody": "Google Font name for body text"
  },
  "themeVariant": "clean" | "bold" | "premium" | "playful"
}

RULES:
- Choose colors that match the business type and tone
- primaryColor must have good contrast with white text
- secondaryColor should complement primary but be more muted
- accentColor should be distinct from primary
- Use Google Fonts that are widely available
- Good heading fonts: Inter, Poppins, Montserrat, Playfair Display, DM Sans, Raleway
- Good body fonts: Inter, Open Sans, Lato, Source Sans Pro, Nunito
- For local businesses: warm, inviting colors; clean or friendly variant
- For SaaS: modern, tech-forward colors; clean or bold variant
- For coaches: warm, personal colors; premium or playful variant
- For luxury/premium: dark, rich colors; premium variant
- themeVariant should match the business positioning
- Ensure accessibility: primary color must work as button background with white text
- User brand color preference if provided: ${businessContext.brandColors || "none specified"}`;

  const result = await chatCompletion(
    "You are a brand design expert. Respond only with valid JSON.",
    prompt,
    { temperature: 0.6, maxTokens: 1000 }
  );

  return parseJSON<ThemeResult>(result);
}
