import type { SectionType } from "@/lib/page/schema";

export const PAGE_GENERATOR_SYSTEM = `You are a website content generator. Given a page plan, site settings, and business context, you generate a complete PageDocument with all sections fully populated.

Rules:
- Every section must have: id (unique, format: "section-{type}-{random}"), type, variant, visible (true), order (0-based), content, style
- CRITICAL: Each section's "variant" field MUST match exactly what the page plan specifies. Do NOT change variants.
- Content must be real, meaningful text — NO placeholder text like "Lorem ipsum", "Feature 1", "Service 1"
- Buttons reference actions by actionId (from the provided actions pool), NOT raw hrefs
- Style must include backgroundColor (hex), textColor (hex), padding
- Hero section should have heading, subheading, and buttons referencing action IDs
- Footer section must have companyName, columns, copyrightYear
- All content should be tailored to the business and page purpose
- Use all three brand colors for styling:
  - primaryColor: hero backgrounds, CTA sections, primary buttons
  - secondaryColor: alternating section backgrounds, subtle contrast areas
  - accentColor: badges, highlights, secondary CTA elements
- The themeVariant drives spacing and density:
  - "clean": generous whitespace, 64-80px section padding
  - "bold": tighter spacing, 56-72px padding, higher contrast
  - "premium": luxurious spacing, 80-112px padding, refined feel
  - "playful": moderate spacing, 48-64px padding, rounded feel
- Generate 150-300 words per content section

Return JSON with this exact structure:
{
  "meta": {
    "title": "Page Title",
    "description": "SEO description",
    "pageType": "service-business",
    "themeVariant": "clean|bold|premium|playful",
    "slug": "page-slug"
  },
  "brand": {
    "tone": "professional",
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "fontHeading": "Font",
    "fontBody": "Font"
  },
  "assets": [],
  "actions": [],
  "sections": [
    {
      "id": "section-hero-abc123",
      "type": "hero",
      "variant": "centered",
      "visible": true,
      "order": 0,
      "content": { "heading": "...", "subheading": "...", "buttons": [{ "text": "Get Started", "actionId": "action-primary", "style": "primary" }] },
      "style": { "backgroundColor": "#hex", "textColor": "#hex", "padding": "80px 0" }
    }
  ]
}`;

export function buildPageGeneratorUserPrompt(
  pagePlan: {
    slug: string;
    title: string;
    pageType: string;
    sections: Array<{ type: SectionType; purpose: string; variant?: string }>;
  },
  brand: {
    tone: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontHeading: string;
    fontBody: string;
  },
  actions: Array<{ id: string; label: string; type: string; value: string; style?: string }>,
  businessContext: Record<string, unknown>,
  footer: { companyName: string; tagline?: string; copyrightYear: string },
  themeVariant?: string
): string {
  return `Generate complete content for this page:

Page: ${pagePlan.title} (/${pagePlan.slug})
Page Type: ${pagePlan.pageType}
Theme Variant: ${themeVariant || "clean"}

Sections to generate (you MUST use the exact variant specified for each section):
${pagePlan.sections.map((s, i) => `${i}. ${s.type} (variant: ${s.variant || "default"}) — ${s.purpose}`).join("\n")}

Brand:
- Tone: ${brand.tone}
- Primary: ${brand.primaryColor} (use for hero backgrounds, CTA sections)
- Secondary: ${brand.secondaryColor} (use for alternating section backgrounds)
- Accent: ${brand.accentColor} (use for highlights, badges)
- Fonts: ${brand.fontHeading} / ${brand.fontBody}

Available Actions (reference by ID in buttons):
${actions.map((a) => `- ${a.id}: "${a.label}" (${a.type}: ${a.value})`).join("\n")}

Business Context:
- Name: ${businessContext.businessName || "Unknown"}
- Type: ${businessContext.businessType || "service-business"}
- Description: ${businessContext.businessDescription || ""}
- Target Audience: ${businessContext.targetAudience || "General audience"}
- Main Offer: ${businessContext.mainOffer || ""}
- Location: ${businessContext.location || ""}
${businessContext.differentiators ? `- Differentiators: ${(businessContext.differentiators as string[]).join(", ")}` : ""}
${businessContext.testimonials ? `- Testimonials: ${(businessContext.testimonials as string[]).join(" | ")}` : ""}

Footer Info:
- Company: ${footer.companyName}
- Tagline: ${footer.tagline || ""}
- Year: ${footer.copyrightYear}

Generate the complete PageDocument with real, business-specific content for every section.
Use the exact variant specified in the plan for each section. Use all three brand colors for section styling.`;
}
