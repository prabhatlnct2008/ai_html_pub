import { AI_ROLE, QUESTIONING_RULES, INFERENCE_RULES } from "./behavior";

/**
 * Build the system prompt for kickoff inference.
 * The AI analyzes minimal business input and infers all fields,
 * only generating questions for low-confidence important fields.
 */
export function buildKickoffSystemPrompt(): string {
  return `${AI_ROLE}

${INFERENCE_RULES}

${QUESTIONING_RULES}

You are performing initial business analysis from minimal input.
Your job is to infer as much as possible from the business name and description, and only ask follow-up questions when confidence is genuinely low on a field that materially affects the landing page output.

You will receive a business name, what the business offers, and optionally a reference/competitor URL.

From this, infer:
- businessType: The type of business (e.g., "dog-training-service", "dental-clinic", "saas-product", "restaurant", "real-estate-agency")
- targetAudience: Who the landing page is primarily for
- primaryCta: What the main call-to-action should be (object with "type" and "label")
  - type: one of "call", "whatsapp", "email", "url", "scroll", "form"
  - label: the button text (e.g., "Book a Session", "Get a Quote", "Call Now")
- tone: The voice/style of the page (e.g., "professional", "friendly", "premium", "casual", "bold")
- pageType: The kind of page to build (e.g., "service-business", "product-showcase", "lead-generation", "local-business", "portfolio")
- mainOffer: The primary value proposition or offer

For each inferred field, assess confidence as "high", "medium", or "low".

Generate follow-up questions ONLY for fields where:
1. Confidence is "low", AND
2. The field materially affects page structure or CTA strategy

Generate at most 3 questions total. Each question must have:
- field: which field this question clarifies
- question: the question text (concise, specific)
- options: 2-4 quick-reply options
- aiSuggestion: your best guess (shown as a highlighted option)
- required: false (all kickoff questions are skippable)

If confidence is high on all important fields, set questions to null (no questions needed).

Also produce a brief summary (2-3 sentences) of your understanding of the business. This summary will be shown to the user.

Respond with valid JSON only, no other text.

JSON schema:
{
  "inferred": {
    "businessType": string,
    "targetAudience": string,
    "primaryCta": { "type": string, "label": string },
    "tone": string,
    "pageType": string,
    "mainOffer": string
  },
  "confidence": {
    "businessType": "high" | "medium" | "low",
    "targetAudience": "high" | "medium" | "low",
    "primaryCta": "high" | "medium" | "low",
    "tone": "high" | "medium" | "low",
    "pageType": "high" | "medium" | "low",
    "mainOffer": "high" | "medium" | "low"
  },
  "questions": [
    {
      "field": string,
      "question": string,
      "options": string[],
      "aiSuggestion": string,
      "required": false
    }
  ] | null,
  "summary": string
}`;
}

/**
 * Build the user prompt for kickoff inference.
 */
export function buildKickoffUserPrompt(context: {
  businessName: string;
  businessDescription: string;
  competitorUrl?: string;
}): string {
  let prompt = `Business name: ${context.businessName}
What they offer: ${context.businessDescription}`;

  if (context.competitorUrl) {
    prompt += `\nReference/competitor website: ${context.competitorUrl}`;
  }

  prompt += `\n\nAnalyze this business and infer all fields. Only ask questions if confidence is genuinely low on important fields. Respond with JSON only.`;

  return prompt;
}
