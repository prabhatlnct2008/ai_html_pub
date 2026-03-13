export function buildCompetitorAnalysisPrompt(pageContent: string): string {
  return `Analyze this competitor's landing page content and extract structural patterns useful for designing a similar (but unique) landing page.

PAGE CONTENT:
${pageContent.substring(0, 8000)}

Extract and respond with valid JSON:
{
  "sections_identified": [
    {"type": "hero|features|testimonials|pricing|faq|cta|contact|other", "description": "Brief description"}
  ],
  "cta_patterns": ["Description of CTA placements and styles"],
  "layout_notes": "Brief notes on the overall layout approach",
  "color_scheme": "Observed primary colors if identifiable",
  "content_tone": "Observed tone (professional, casual, etc.)",
  "key_takeaways": ["What works well about this page structure"]
}`;
}
