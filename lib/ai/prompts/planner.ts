export function buildPlannerPrompt(
  businessContext: Record<string, unknown>,
  competitorInsights: Record<string, unknown> | null
): string {
  return `You are an expert landing page architect. Create a detailed page plan based on the business information provided.

BUSINESS CONTEXT:
${JSON.stringify(businessContext, null, 2)}

${competitorInsights ? `COMPETITOR INSIGHTS:\n${JSON.stringify(competitorInsights, null, 2)}` : "No competitor data available."}

Create a landing page plan. Respond with valid JSON:
{
  "sections": [
    {
      "type": "hero",
      "description": "What this section should contain and its purpose"
    },
    {
      "type": "features",
      "description": "..."
    }
  ],
  "branding": {
    "primary_color": "#hex",
    "secondary_color": "#hex",
    "accent_color": "#hex",
    "font_family": "Font name",
    "tone": "professional|casual|playful|bold|elegant"
  },
  "page_meta": {
    "title": "Page title for browser tab",
    "description": "Meta description"
  }
}

RULES:
- Include 5-8 sections for a complete landing page
- Always start with a hero section
- Always include at least one CTA section
- Choose colors that match the business tone
- Section types must be one of: hero, features, testimonials, pricing, faq, cta, contact
- Make descriptions specific to THIS business, not generic`;
}

export function buildPlanModificationPrompt(
  currentPlan: Record<string, unknown>,
  userFeedback: string
): string {
  return `The user wants to modify this landing page plan.

CURRENT PLAN:
${JSON.stringify(currentPlan, null, 2)}

USER FEEDBACK: "${userFeedback}"

Modify the plan based on the feedback. Return the complete updated plan in the same JSON format.
Keep sections that weren't mentioned in the feedback unchanged.`;
}
