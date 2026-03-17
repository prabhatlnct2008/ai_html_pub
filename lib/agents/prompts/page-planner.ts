import { SECTION_VARIANTS } from "@/lib/page/section-library";

// Build a formatted variant reference from the actual SECTION_VARIANTS registry
function buildVariantReference(): string {
  return Object.entries(SECTION_VARIANTS)
    .map(([type, variants]) => `  ${type}: ${variants.join(", ")}`)
    .join("\n");
}

export const PAGE_PLANNER_SYSTEM = `You are a page layout planner. Given a page's purpose and the site context, you plan the sections for a single page.

Rules:
- Section types must be from: hero, trust-bar, features, benefits, problem-solution, how-it-works, services, testimonials, results, pricing, faq, cta-band, contact, footer, gallery, service-area, about-team
- Each page should start with a hero section and end with a footer section
- Include 5-8 sections per page (including hero and footer). Fewer is acceptable for focused pages (e.g., contact page with 4 sections)
- Sections should flow logically and serve the page's purpose
- Avoid duplicating exact section layouts between pages
- Each section needs a purpose description explaining what it should contain
- You MUST specify a variant for EVERY section. Choose from the available variants listed below.
  Pick variants that match the page type, business type, and theme — do NOT always pick the first variant.

Available variants by section type:
${buildVariantReference()}

Business type guidance for variant selection:
- local-business: prefer split-image heroes, image-cards services, grid galleries
- service-business: prefer alternating-rows services, timeline how-it-works
- saas: prefer centered heroes, icon-grid features, stat-bar results
- coach: prefer background-image heroes, single-highlight testimonials
- product-sales: prefer offer-focused heroes, image-cards features

Return JSON with this exact structure:
{
  "slug": "page-slug",
  "title": "Page Title",
  "pageType": "local-business|service-business|saas|coach|product-sales",
  "sections": [
    { "type": "hero", "purpose": "Main headline and CTA for...", "variant": "centered" },
    { "type": "features", "purpose": "Highlight key features...", "variant": "icon-grid" }
  ]
}`;

export function buildPagePlannerUserPrompt(
  page: { slug: string; title: string; purpose: string; pageType: string; suggestedSections: string[] },
  otherPageSummaries: string[],
  businessContext: Record<string, unknown>,
  themeVariant?: string
): string {
  return `Plan the sections for this page:

Page: ${page.title} (/${page.slug})
Purpose: ${page.purpose}
Page Type: ${page.pageType}
Theme Variant: ${themeVariant || "clean"}
Suggested Sections: ${page.suggestedSections.join(", ")}

Business: ${businessContext.businessName || "Unknown"}
Business Type: ${businessContext.businessType || page.pageType}
Description: ${businessContext.businessDescription || ""}
Tone: ${businessContext.tone || "professional"}

Other pages in this site:
${otherPageSummaries.length > 0 ? otherPageSummaries.join("\n") : "None yet"}

Plan the optimal section layout for this page. You MUST specify a variant for every section.
Choose variants that fit the business type (${businessContext.businessType || page.pageType}), theme (${themeVariant || "clean"}), and page purpose.
Do NOT always pick the first variant — use variety across sections.`;
}
