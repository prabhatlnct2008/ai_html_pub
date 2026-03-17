/**
 * LangChain model wrapper.
 * All agent calls go through LangChain's ChatOpenAI, not the raw OpenAI client.
 */

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

/**
 * Create a LangChain ChatOpenAI model instance.
 */
export function createAgentModel(options?: {
  temperature?: number;
  maxTokens?: number;
  modelName?: string;
}): ChatOpenAI {
  return new ChatOpenAI({
    modelName: options?.modelName ?? "gpt-4o-mini",
    temperature: options?.temperature ?? 0.7,
    maxTokens: options?.maxTokens ?? 4000,
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelKwargs: {
      response_format: { type: "json_object" },
    },
  });
}

/**
 * Chat completion via LangChain model.
 * Drop-in replacement for the raw chatCompletion() from openai-client,
 * but routed through LangChain's ChatOpenAI.
 */
export async function agentChatCompletion(
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; maxTokens?: number; timeoutMs?: number }
): Promise<string> {
  const model = createAgentModel({
    temperature: options?.temperature,
    maxTokens: options?.maxTokens,
  });

  const timeoutMs = options?.timeoutMs ?? 30_000;

  const completionPromise = model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ]);

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Agent completion timed out after ${timeoutMs}ms`)),
      timeoutMs
    )
  );

  const response = await Promise.race([completionPromise, timeoutPromise]);
  return typeof response.content === "string" ? response.content : JSON.stringify(response.content);
}

/**
 * Parse JSON from model response, handling markdown code blocks.
 */
export function parseAgentJSON<T>(text: string): T | null {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      try {
        return JSON.parse(match[1].trim());
      } catch {
        return null;
      }
    }
    return null;
  }
}
