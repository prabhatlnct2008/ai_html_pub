import { streamChatText } from "./openai-client";
import { appendProgress } from "@/lib/workflow/progress";
import { prisma } from "@/lib/db";

/**
 * Stream AI-generated text to a workflow's progressLog and conversation.
 * Text chunks are batched before flushing to DB to avoid excessive writes.
 *
 * Returns the full accumulated text.
 */
export async function streamAITextToWorkflow(
  projectId: string,
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  let buffer = "";
  let lastFlush = Date.now();
  const FLUSH_INTERVAL_MS = 200;
  const FLUSH_CHAR_THRESHOLD = 50;

  const flush = async (done: boolean) => {
    if (buffer.length === 0 && !done) return;

    await appendProgress(projectId, "text", {
      content: buffer,
      done,
    });

    buffer = "";
    lastFlush = Date.now();
  };

  const fullText = await streamChatText(
    systemPrompt,
    userPrompt,
    async (chunk: string) => {
      buffer += chunk;

      const elapsed = Date.now() - lastFlush;
      if (buffer.length >= FLUSH_CHAR_THRESHOLD || elapsed >= FLUSH_INTERVAL_MS) {
        await flush(false);
      }
    },
    options
  );

  // Final flush
  await flush(true);

  // Mirror completed text into Conversation.messages
  const conv = await prisma.conversation.findUnique({ where: { projectId } });
  if (conv) {
    const messages = JSON.parse(conv.messages || "[]");
    messages.push({ role: "assistant", content: fullText });
    await prisma.conversation.update({
      where: { id: conv.id },
      data: { messages: JSON.stringify(messages) },
    });
  }

  return fullText;
}
