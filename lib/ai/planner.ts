import { chatCompletion, parseJSON } from "./openai-client";
import { buildPlannerPrompt, buildPlanModificationPrompt } from "./prompts/planner";

export interface PagePlanData {
  sections: Array<{ type: string; description: string }>;
  branding: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    font_family: string;
    tone: string;
  };
  page_meta: {
    title: string;
    description: string;
  };
}

export async function generatePlan(
  businessContext: Record<string, unknown>,
  competitorInsights: Record<string, unknown> | null
): Promise<PagePlanData | null> {
  const prompt = buildPlannerPrompt(businessContext, competitorInsights);
  const result = await chatCompletion(
    "You are an expert landing page architect. Respond only with valid JSON.",
    prompt,
    { temperature: 0.7, maxTokens: 2000 }
  );

  return parseJSON<PagePlanData>(result);
}

export async function modifyPlan(
  currentPlan: Record<string, unknown>,
  userFeedback: string
): Promise<PagePlanData | null> {
  const prompt = buildPlanModificationPrompt(currentPlan, userFeedback);
  const result = await chatCompletion(
    "You are an expert landing page architect. Respond only with valid JSON.",
    prompt,
    { temperature: 0.5, maxTokens: 2000 }
  );

  return parseJSON<PagePlanData>(result);
}
