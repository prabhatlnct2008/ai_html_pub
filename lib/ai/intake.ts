import { chatCompletion, parseJSON } from "./openai-client";
import { buildIntakeSystemPrompt, buildIntakeUserPrompt } from "./prompts/intake";

interface IntakeResponse {
  message: string;
  questions: string[];
  ready_for_plan: boolean;
  extracted_context: Record<string, unknown>;
}

export async function processIntakeMessage(
  currentContext: Record<string, unknown>,
  conversationHistory: Array<{ role: string; content: string }>,
  latestMessage: string
): Promise<IntakeResponse> {
  const systemPrompt = buildIntakeSystemPrompt();
  const userPrompt = buildIntakeUserPrompt(currentContext, conversationHistory, latestMessage);

  const result = await chatCompletion(systemPrompt, userPrompt);
  const parsed = parseJSON<IntakeResponse>(result);

  if (!parsed) {
    return {
      message: "I understand. Could you tell me more about your business and what you'd like your landing page to achieve?",
      questions: [],
      ready_for_plan: false,
      extracted_context: {},
    };
  }

  return parsed;
}
