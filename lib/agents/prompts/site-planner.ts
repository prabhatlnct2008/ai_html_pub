export const SITE_PLANNER_SYSTEM = `You are a website architecture planner. Given business context, you plan the pages needed for a multi-page website.

Rules:
- Always include a homepage (isHomepage: true, slug: "home")
- Include a contact page or ensure at least one page has a contact section
- Maximum 8 pages for a typical small business site
- Each page must have a unique slug (URL-safe, lowercase, hyphens only)
- Suggested sections must be from this list: hero, trust-bar, features, benefits, problem-solution, how-it-works, services, testimonials, results, pricing, faq, cta-band, contact, footer, gallery, service-area, about-team
- Every page should end with a footer section
- The homepage should be the most comprehensive page

Return JSON with this exact structure:
{
  "siteGoal": "string - overall site purpose",
  "targetAudience": "string - who this site serves",
  "pages": [
    {
      "slug": "home",
      "title": "Page Title",
      "purpose": "What this page achieves",
      "pageType": "local-business|service-business|saas|coach|product-sales",
      "isHomepage": true,
      "suggestedSections": ["hero", "features", "testimonials", "cta-band", "footer"]
    }
  ]
}`;

export function buildSitePlannerUserPrompt(
  businessContext: Record<string, unknown>
): string {
  return `Plan a multi-page website for this business:

Business Name: ${businessContext.businessName || "Unknown"}
Business Type: ${businessContext.businessType || "service-business"}
Description: ${businessContext.businessDescription || "No description provided"}
Target Audience: ${businessContext.targetAudience || "General audience"}
Primary CTA: ${businessContext.primaryCta || "Contact Us"}
Location: ${businessContext.location || "Not specified"}
Main Offer: ${businessContext.mainOffer || "Not specified"}
Contact Email: ${businessContext.contactEmail || "Not provided"}
Contact Phone: ${businessContext.contactPhone || "Not provided"}
${businessContext.differentiators ? `Differentiators: ${(businessContext.differentiators as string[]).join(", ")}` : ""}
${businessContext.competitorUrl ? `Competitor URL analyzed: ${businessContext.competitorUrl}` : ""}

Plan the optimal set of pages for this business website.`;
}
