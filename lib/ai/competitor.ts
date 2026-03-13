import { chatCompletion, parseJSON } from "./openai-client";
import { buildCompetitorAnalysisPrompt } from "./prompts/competitor";

interface CompetitorInsights {
  sections_identified: Array<{ type: string; description: string }>;
  cta_patterns: string[];
  layout_notes: string;
  color_scheme: string;
  content_tone: string;
  key_takeaways: string[];
}

export async function analyzeCompetitor(url: string): Promise<{
  insights: CompetitorInsights | null;
  error?: string;
}> {
  // Fetch the page content
  let pageContent: string;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PageCraftBot/1.0; Landing Page Analysis)",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return { insights: null, error: `Failed to fetch page (status ${response.status})` };
    }

    pageContent = await response.text();
  } catch {
    return {
      insights: null,
      error: "Could not access the competitor website. You can upload a screenshot instead.",
    };
  }

  // Strip HTML tags for a cleaner analysis, keep text structure
  const textContent = pageContent
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (textContent.length < 100) {
    return {
      insights: null,
      error: "The page content appears to be dynamically loaded. Please upload a screenshot instead.",
    };
  }

  const prompt = buildCompetitorAnalysisPrompt(textContent);
  const result = await chatCompletion(
    "You are a web design analyst. Respond only with valid JSON.",
    prompt,
    { temperature: 0.3 }
  );

  const insights = parseJSON<CompetitorInsights>(result);
  if (!insights) {
    return { insights: null, error: "Failed to analyze competitor page" };
  }

  return { insights };
}
