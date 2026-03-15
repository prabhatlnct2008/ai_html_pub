import { REQUIRED_FIELDS } from "@/lib/workflow/types";
import { AI_ROLE, QUESTIONING_RULES, INFERENCE_RULES } from "./behavior";

export function buildIntakeSystemPrompt(): string {
  return `${AI_ROLE}

${QUESTIONING_RULES}

${INFERENCE_RULES}

Your job is to extract business information from the user's messages.

Extract as much as you can into the schema below. Ask ONLY about REQUIRED fields that are still missing. Never ask about optional fields — they will be auto-filled later.

REQUIRED FIELDS (page cannot be generated without these):
- businessName: The name of the business
- businessType: What the business does / product / service
- targetAudience: Who the customers are
- primaryCta: What action visitors should take (e.g., "Book Now", "Contact Us", "Buy Now")

OPTIONAL FIELDS (extract if mentioned, but NEVER ask about these):
- location, tone, mainOffer, secondaryCta, contactEmail, contactPhone
- differentiators, testimonials, brandColors

RULES:
- Extract ALL information you can from EVERY message
- If a required field can be reasonably inferred from context, fill it in
- Ask at most 1-2 questions per response, focused ONLY on missing required fields
- Do NOT ask for testimonials, social proof, exact copy, brand colors, or other optional details
- If all 4 required fields are filled, set ready to true — even if optional fields are empty
- Be brief and encouraging

Respond ONLY with valid JSON:
{
  "message": "Brief conversational response",
  "questions": ["Only about missing REQUIRED fields"],
  "ready": false,
  "extracted": {
    "businessName": "extracted or null",
    "businessType": "extracted or null",
    "targetAudience": "extracted or null",
    "primaryCta": "extracted or null",
    "tone": "extracted or null",
    "mainOffer": "extracted or null",
    "differentiators": ["extracted items"],
    "location": "extracted or null"
  }
}

Set fields to null if you cannot extract them. Only include fields you found.`;
}

export function buildIntakeUserPrompt(
  currentContext: Record<string, unknown>,
  missingRequired: string[],
  conversationHistory: Array<{ role: string; content: string }>,
  latestMessage: string
): string {
  return `Current known context:
${JSON.stringify(currentContext, null, 2)}

Still missing REQUIRED fields: ${missingRequired.length > 0 ? missingRequired.join(", ") : "NONE — all required fields are filled"}

Conversation so far:
${conversationHistory.slice(-6).map((m) => `${m.role}: ${m.content}`).join("\n")}

Latest user message: "${latestMessage}"

Extract information and respond with JSON. ${missingRequired.length === 0 ? 'All required fields are filled — set "ready": true.' : ""}`;
}
