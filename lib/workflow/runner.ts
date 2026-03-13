import { prisma } from "@/lib/db";
import { analyzeCompetitor } from "@/lib/ai/competitor";
import { generatePlan, type PagePlanData } from "@/lib/ai/planner";
import { generateAllSections } from "@/lib/ai/generator";
import { renderPageHtml } from "@/lib/html-renderer";
import { fillDefaults, type BusinessContext, type WorkflowState } from "./types";

/**
 * Execute the action for a given workflow state.
 * Returns the next state to transition to.
 */
export async function executeState(
  projectId: string,
  state: WorkflowState
): Promise<{ nextState: WorkflowState; message?: string; error?: string }> {
  switch (state) {
    case "intake_complete":
      return executeIntakeComplete(projectId);
    case "competitor_analysis_running":
      return executeCompetitorAnalysis(projectId);
    case "competitor_analysis_complete":
      return { nextState: "plan_generation_running" };
    case "plan_generation_running":
      return executePlanGeneration(projectId);
    case "generation_running":
      return executeSectionGeneration(projectId);
    case "rendering":
      return executeRendering(projectId);
    case "saving":
      return executeSaving(projectId);
    default:
      return { nextState: state };
  }
}

async function executeIntakeComplete(
  projectId: string
): Promise<{ nextState: WorkflowState }> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  const ctx = JSON.parse(project?.businessContext || "{}");
  if (ctx.competitorUrl) {
    return { nextState: "competitor_analysis_running" };
  }
  return { nextState: "plan_generation_running" };
}

async function executeCompetitorAnalysis(
  projectId: string
): Promise<{ nextState: WorkflowState; message?: string; error?: string }> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { nextState: "failed", error: "Project not found" };

  const ctx = JSON.parse(project.businessContext) as Partial<BusinessContext>;
  if (!ctx.competitorUrl) {
    return { nextState: "plan_generation_running" };
  }

  const { insights, error } = await analyzeCompetitor(ctx.competitorUrl);

  if (error || !insights) {
    // Non-fatal: store error but proceed to planning
    await prisma.project.update({
      where: { id: projectId },
      data: { competitorData: JSON.stringify({ error: error || "Analysis failed" }) },
    });

    // Add message to conversation
    await addSystemMessage(projectId, `Competitor analysis: ${error || "Could not analyze the website"}. Proceeding with plan generation.`);

    return { nextState: "competitor_analysis_complete" };
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { competitorData: JSON.stringify(insights) },
  });

  await addSystemMessage(
    projectId,
    `Competitor analysis complete. Found ${insights.sections_identified?.length || 0} section patterns. Tone: ${insights.content_tone || "N/A"}.`
  );

  return { nextState: "competitor_analysis_complete" };
}

async function executePlanGeneration(
  projectId: string
): Promise<{ nextState: WorkflowState; error?: string }> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { nextState: "failed", error: "Project not found" };

  const rawCtx = JSON.parse(project.businessContext);
  const businessContext = fillDefaults(rawCtx);
  const competitorData = JSON.parse(project.competitorData);
  const hasCompetitorInsights = competitorData && !competitorData.error && Object.keys(competitorData).length > 0;

  const plan = await generatePlan(
    businessContext as unknown as Record<string, unknown>,
    hasCompetitorInsights ? competitorData : null
  );

  if (!plan) {
    return { nextState: "failed", error: "Failed to generate page plan. Please retry." };
  }

  // Upsert plan
  const existing = await prisma.pagePlan.findUnique({ where: { projectId } });
  if (existing) {
    await prisma.pagePlan.update({
      where: { id: existing.id },
      data: { planData: JSON.stringify(plan), status: "proposed", version: { increment: 1 } },
    });
  } else {
    await prisma.pagePlan.create({
      data: { projectId, planData: JSON.stringify(plan), status: "proposed" },
    });
  }

  const planSummary = plan.sections
    .map((s, i) => `${i + 1}. ${s.type.charAt(0).toUpperCase() + s.type.slice(1)}: ${s.description}`)
    .join("\n");

  await addSystemMessage(
    projectId,
    `Page plan generated:\n\n${planSummary}\n\nBranding: ${plan.branding.primary_color} / ${plan.branding.font_family} / ${plan.branding.tone}\n\nPlease review and approve, or request changes.`
  );

  return { nextState: "plan_review" };
}

async function executeSectionGeneration(
  projectId: string
): Promise<{ nextState: WorkflowState; error?: string }> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { pagePlan: true },
  });

  if (!project?.pagePlan) {
    return { nextState: "failed", error: "No approved plan found" };
  }

  const plan = JSON.parse(project.pagePlan.planData) as PagePlanData;
  const businessContext = fillDefaults(JSON.parse(project.businessContext));

  const sections = await generateAllSections(plan, businessContext as unknown as Record<string, unknown>);

  if (!sections || sections.length === 0) {
    return { nextState: "failed", error: "Failed to generate page sections" };
  }

  // Store sections temporarily on the page (will be finalized in rendering/saving)
  const globalStyles = {
    primary_color: plan.branding.primary_color,
    secondary_color: plan.branding.secondary_color,
    accent_color: plan.branding.accent_color,
    font_family: plan.branding.font_family,
  };

  const existingPage = await prisma.page.findUnique({ where: { projectId } });
  if (existingPage) {
    await prisma.page.update({
      where: { id: existingPage.id },
      data: {
        sectionsJson: JSON.stringify(sections),
        globalStyles: JSON.stringify(globalStyles),
      },
    });
  } else {
    await prisma.page.create({
      data: {
        projectId,
        sectionsJson: JSON.stringify(sections),
        globalStyles: JSON.stringify(globalStyles),
      },
    });
  }

  return { nextState: "rendering" };
}

async function executeRendering(
  projectId: string
): Promise<{ nextState: WorkflowState; error?: string }> {
  const page = await prisma.page.findUnique({ where: { projectId } });
  const plan = await prisma.pagePlan.findUnique({ where: { projectId } });

  if (!page) return { nextState: "failed", error: "No page data found" };

  const sections = JSON.parse(page.sectionsJson);
  const globalStyles = JSON.parse(page.globalStyles);
  const planData = plan ? JSON.parse(plan.planData) : { page_meta: { title: "Landing Page", description: "" } };

  const renderedHtml = renderPageHtml(sections, globalStyles, planData.page_meta);

  await prisma.page.update({
    where: { id: page.id },
    data: { renderedHtml },
  });

  return { nextState: "saving" };
}

async function executeSaving(
  projectId: string
): Promise<{ nextState: WorkflowState; error?: string }> {
  const page = await prisma.page.findUnique({ where: { projectId } });
  if (!page) return { nextState: "failed", error: "No page to save" };

  // Increment version
  await prisma.page.update({
    where: { id: page.id },
    data: { version: { increment: 1 } },
  });

  // Update project status
  await prisma.project.update({
    where: { id: projectId },
    data: { status: "generated" },
  });

  await addSystemMessage(projectId, "Your landing page has been generated! Redirecting to the editor...");

  return { nextState: "complete" };
}

// ---- Helpers ----

async function addSystemMessage(projectId: string, content: string) {
  const conv = await prisma.conversation.findUnique({ where: { projectId } });
  if (!conv) return;

  const messages = JSON.parse(conv.messages) as Array<{ role: string; content: string }>;
  messages.push({ role: "assistant", content });

  await prisma.conversation.update({
    where: { id: conv.id },
    data: { messages: JSON.stringify(messages) },
  });
}
