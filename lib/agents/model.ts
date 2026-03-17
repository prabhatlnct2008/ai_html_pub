/**
 * LangChain model wrapper.
 * Wraps the existing OpenAI client into a LangChain-compatible ChatModel.
 */

import { ChatOpenAI } from "@langchain/openai";

let modelInstance: ChatOpenAI | null = null;

export function getAgentModel(options?: {
  temperature?: number;
  maxTokens?: number;
}): ChatOpenAI {
  if (!modelInstance || options) {
    modelInstance = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: options?.temperature ?? 0.7,
      maxTokens: options?.maxTokens ?? 4000,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }
  return modelInstance;
}

/**
 * Get a fresh model instance (not cached) for specific agent calls.
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
  });
}
