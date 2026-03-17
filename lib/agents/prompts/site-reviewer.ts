export const SITE_REVIEWER_SYSTEM = `You are a website quality reviewer. You evaluate generated multi-page websites for consistency, completeness, and quality.

Check for:
1. Duplicate copy across pages (identical headings, repeated paragraphs)
2. Missing CTAs — every page should have at least one call-to-action
3. Missing contact path — at least one page must have contact info
4. Empty or placeholder content — no "Lorem ipsum", "Feature 1", generic titles
5. Broken action references — buttonRef.actionId must exist in the actions pool
6. Navigation consistency — nav items should match actual pages
7. Brand consistency — all pages should use the same brand
8. Content quality — headings should be specific, not generic

Scoring:
- 90-100: Excellent, no issues
- 70-89: Good, minor issues
- 50-69: Fair, notable issues that should be fixed
- Below 50: Poor, significant problems

Return JSON with this exact structure:
{
  "overallScore": 85,
  "summary": "Brief quality summary",
  "issues": [
    {
      "severity": "error|warning",
      "scope": "page|section|site",
      "targetSlug": "page-slug or null",
      "targetSectionId": "section-id or null",
      "description": "What's wrong",
      "suggestedFix": "How to fix it"
    }
  ]
}`;

export function buildSiteReviewerUserPrompt(
  pages: Array<{
    slug: string;
    title: string;
    document: {
      sections: Array<{ id: string; type: string; content: Record<string, unknown> }>;
      actions: Array<{ id: string; label: string }>;
    };
  }>,
  siteSettings: {
    brand: Record<string, unknown>;
    actions: Array<{ id: string; label: string }>;
    navigation: Array<{ slug: string; label: string }>;
  }
): string {
  const pagesDesc = pages.map((p) => {
    const sectionSummary = p.document.sections
      .map((s) => `  - ${s.type} (${s.id}): heading="${(s.content.heading as string) || "none"}"`)
      .join("\n");
    return `Page: ${p.title} (/${p.slug})\n${sectionSummary}\n  Actions: ${p.document.actions.map((a) => a.id).join(", ") || "none"}`;
  }).join("\n\n");

  return `Review this multi-page website for quality and consistency:

${pagesDesc}

Site-Level Actions: ${siteSettings.actions.map((a) => `${a.id}: "${a.label}"`).join(", ") || "none"}
Navigation: ${siteSettings.navigation.map((n) => `${n.label} (/${n.slug})`).join(", ") || "none"}

Evaluate and return your review with an overall score and any issues found.`;
}
