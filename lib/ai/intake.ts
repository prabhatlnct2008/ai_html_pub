import { chatCompletion, parseJSON } from "./openai-client";
import { buildIntakeSystemPrompt, buildIntakeUserPrompt } from "./prompts/intake";
import {
  getMissingRequiredFields,
  hasMinimumContext,
  type BusinessContext,
} from "@/lib/workflow/types";

interface IntakeResponse {
  message: string;
  questions: string[];
  ready: boolean;
  extracted: Partial<BusinessContext>;
}

/**
 * Process a user message during intake.
 * Returns AI response + extracted fields + whether we have enough info.
 */
export async function processIntakeMessage(
  currentContext: Partial<BusinessContext>,
  conversationHistory: Array<{ role: string; content: string }>,
  latestMessage: string
): Promise<{
  message: string;
  extractedContext: Partial<BusinessContext>;
  isReady: boolean;
}> {
  const missingRequired = getMissingRequiredFields(currentContext);

  const systemPrompt = buildIntakeSystemPrompt();
  const userPrompt = buildIntakeUserPrompt(
    currentContext as Record<string, unknown>,
    missingRequired,
    conversationHistory,
    latestMessage
  );

  const result = await chatCompletion(systemPrompt, userPrompt);
  const parsed = parseJSON<IntakeResponse>(result);

  if (!parsed) {
    return {
      message: "Thanks! Could you tell me the name of your business and what you offer?",
      extractedContext: {},
      isReady: false,
    };
  }

  // Merge extracted fields into current context
  const merged: Partial<BusinessContext> = { ...currentContext };
  if (parsed.extracted) {
    for (const [key, value] of Object.entries(parsed.extracted)) {
      if (value !== null && value !== undefined && value !== "") {
        (merged as Record<string, unknown>)[key] = value;
      }
    }
  }

  // Check if we now have all required fields
  const isReady = parsed.ready || hasMinimumContext(merged);

  return {
    message: isReady
      ? "I have all the information I need. Let me build your page plan now."
      : parsed.message,
    extractedContext: merged,
    isReady,
  };
}
