import { AI_ROLE, OUTPUT_RULES } from "./behavior";

export function buildPlannerPrompt(
  businessContext: Record<string, unknown>,
  competitorInsights: Record<string, unknown> | null
): string {
  return `${AI_ROLE}

${OUTPUT_RULES}

Create a detailed page plan based on the business information provided.

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
- Include 8-12 sections for a complete landing page
- Always start with a hero section
- Always end with a footer section
- Include at least one cta-band section between content sections
- Choose colors that match the business tone
- Section types must be one of: hero, trust-bar, features, benefits, problem-solution, how-it-works, services, testimonials, results, pricing, faq, cta-band, contact, footer
- Make descriptions specific to THIS business, not generic
- For local/service businesses: include services, how-it-works, testimonials
- For SaaS: include features, pricing, how-it-works
- Good default sequence: hero, trust-bar, services/features, problem-solution, how-it-works, results, testimonials, faq, cta-band, contact, footer`;
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
