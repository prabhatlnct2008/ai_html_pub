export const SHARED_SETTINGS_SYSTEM = `You are a brand and site settings designer. Given a business context and site plan, you create cohesive site-wide settings including brand colors, typography, navigation, header, footer, and action buttons.

Rules:
- Brand colors should be professional and cohesive (primaryColor, secondaryColor, accentColor as hex)
- Font choices should be from Google Fonts (fontHeading, fontBody)
- Tone must be one of: professional, casual, playful, bold, elegant, friendly, authoritative
- Actions are reusable buttons/CTAs: each needs a unique id, label, type (url|phone|email|whatsapp|scroll|form), value, and style (primary|secondary|outline|ghost)
- Navigation must match the site plan pages
- Header needs siteName and optionally a ctaActionId pointing to one of the actions
- Footer needs companyName, columns (for link groups), and copyrightYear

Return JSON with this exact structure:
{
  "brand": {
    "tone": "professional",
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "fontHeading": "Font Name",
    "fontBody": "Font Name"
  },
  "actions": [
    { "id": "action-xxx", "label": "Button Text", "type": "url", "value": "#contact", "style": "primary" }
  ],
  "navigation": [
    { "pageId": "", "label": "Home", "slug": "home", "isHomepage": true, "order": 0, "visible": true }
  ],
  "header": { "siteName": "Business Name", "showNav": true, "ctaActionId": "action-xxx" },
  "footer": {
    "companyName": "Business Name",
    "tagline": "Tagline text",
    "columns": [{ "title": "Column Title", "links": [{ "text": "Link", "href": "#" }] }],
    "copyrightYear": "2026"
  },
  "socialLinks": [],
  "contactInfo": { "email": "", "phone": "", "address": "" }
}`;

export function buildSharedSettingsUserPrompt(
  businessContext: Record<string, unknown>,
  sitePlan: { pages: Array<{ slug: string; title: string; isHomepage: boolean }> }
): string {
  return `Create site-wide settings for this business website:

Business Name: ${businessContext.businessName || "Unknown"}
Business Type: ${businessContext.businessType || "service-business"}
Description: ${businessContext.businessDescription || ""}
Target Audience: ${businessContext.targetAudience || "General audience"}
Primary CTA: ${businessContext.primaryCta || "Contact Us"}
Tone: ${businessContext.tone || "professional"}
Brand Colors Preference: ${businessContext.brandColors || "Not specified"}
Contact Email: ${businessContext.contactEmail || ""}
Contact Phone: ${businessContext.contactPhone || ""}
Location: ${businessContext.location || ""}

Site Pages:
${sitePlan.pages.map((p) => `- ${p.title} (/${p.slug})${p.isHomepage ? " [Homepage]" : ""}`).join("\n")}

Create cohesive brand settings, reusable action buttons, navigation, and header/footer configuration.`;
}
