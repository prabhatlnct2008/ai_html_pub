export const PAGE_PLANNER_SYSTEM = `You are a page layout planner. Given a page's purpose and the site context, you plan the sections for a single page.

Rules:
- Section types must be from: hero, trust-bar, features, benefits, problem-solution, how-it-works, services, testimonials, results, pricing, faq, cta-band, contact, footer, gallery, service-area, about-team
- Each page should start with a hero section and end with a footer section
- Include 4-8 sections per page (including hero and footer)
- Sections should flow logically and serve the page's purpose
- Avoid duplicating exact section layouts between pages
- Each section needs a purpose description explaining what it should contain
- Optionally specify a variant for visual diversity

Return JSON with this exact structure:
{
  "slug": "page-slug",
  "title": "Page Title",
  "pageType": "local-business|service-business|saas|coach|product-sales",
  "sections": [
    { "type": "hero", "purpose": "Main headline and CTA for...", "variant": "centered" },
    { "type": "features", "purpose": "Highlight key features..." }
  ]
}`;

export function buildPagePlannerUserPrompt(
  page: { slug: string; title: string; purpose: string; pageType: string; suggestedSections: string[] },
  otherPageSummaries: string[],
  businessContext: Record<string, unknown>
): string {
  return `Plan the sections for this page:

Page: ${page.title} (/${page.slug})
Purpose: ${page.purpose}
Page Type: ${page.pageType}
Suggested Sections: ${page.suggestedSections.join(", ")}

Business: ${businessContext.businessName || "Unknown"}
Description: ${businessContext.businessDescription || ""}

Other pages in this site:
${otherPageSummaries.length > 0 ? otherPageSummaries.join("\n") : "None yet"}

Plan the optimal section layout for this page. Make sure it serves its purpose and doesn't duplicate other pages unnecessarily.`;
}
