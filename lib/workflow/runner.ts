import { prisma } from "@/lib/db";
import { analyzeCompetitor } from "@/lib/ai/competitor";
import { generatePlan, type PagePlanData } from "@/lib/ai/planner";
import { generateAllSections } from "@/lib/ai/generator";
import { generateStrategy } from "@/lib/ai/strategist";
import { generateTheme } from "@/lib/ai/theme-generator";
import { planAssets } from "@/lib/ai/asset-planner";
import { generateAllSectionsV2, generateAllSectionsWithActions } from "@/lib/ai/section-generator";
import { generateImagePrompts } from "@/lib/ai/image-prompt-generator";
import { generateImages } from "@/lib/ai/image-generator";
import { renderPageFromDocument } from "@/lib/page/renderer";
import { renderPageHtml } from "@/lib/html-renderer";
import { validateDocumentQuality, autoRepairDocument } from "@/lib/page/validators";
import type { PageDocument, Section, Brand, SectionType, Action } from "@/lib/page/schema";
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
      return { nextState: "strategy_generation" };
    case "strategy_generation":
      return executeStrategyGeneration(projectId);
    case "theme_generation":
      return executeThemeGeneration(projectId);
    case "asset_planning":
      return executeAssetPlanning(projectId);
    case "image_prompt_generation":
      return executeImagePromptGeneration(projectId);
    case "image_generation":
      return executeImageGeneration(projectId);
    case "plan_generation_running":
      return executePlanGeneration(projectId);
    case "generation_running":
      return executeSectionGeneration(projectId);
    case "document_assembly":
      return executeDocumentAssembly(projectId);
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
  return { nextState: "strategy_generation" };
}

async function executeCompetitorAnalysis(
  projectId: string
): Promise<{ nextState: WorkflowState; message?: string; error?: string }> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { nextState: "failed", error: "Project not found" };

  const ctx = JSON.parse(project.businessContext) as Partial<BusinessContext>;
  if (!ctx.competitorUrl) {
    return { nextState: "strategy_generation" };
  }

  const { insights, error } = await analyzeCompetitor(ctx.competitorUrl);

  if (error || !insights) {
    await prisma.project.update({
      where: { id: projectId },
      data: { competitorData: JSON.stringify({ error: error || "Analysis failed" }) },
    });
    await addSystemMessage(projectId, `Competitor analysis: ${error || "Could not analyze the website"}. Proceeding with strategy generation.`);
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

async function executeStrategyGeneration(
  projectId: string
): Promise<{ nextState: WorkflowState; error?: string }> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { nextState: "failed", error: "Project not found" };

  const rawCtx = JSON.parse(project.businessContext);
  const businessContext = fillDefaults(rawCtx);
  const competitorData = JSON.parse(project.competitorData);
  const hasCompetitorInsights = competitorData && !competitorData.error && Object.keys(competitorData).length > 0;

  const strategy = await generateStrategy(
    businessContext as unknown as Record<string, unknown>,
    hasCompetitorInsights ? competitorData : null
  );

  if (!strategy) {
    return { nextState: "failed", error: "Failed to generate page strategy. Please retry." };
  }

  // Store strategy in business context for later use
  await prisma.project.update({
    where: { id: projectId },
    data: {
      businessContext: JSON.stringify({
        ...rawCtx,
        _strategy: strategy,
      }),
    },
  });

  await addSystemMessage(
    projectId,
    `Page strategy determined: ${strategy.pageType} page with ${strategy.sectionSequence.length} sections.`
  );

  return { nextState: "theme_generation" };
}

async function executeThemeGeneration(
  projectId: string
): Promise<{ nextState: WorkflowState; error?: string }> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { nextState: "failed", error: "Project not found" };

  const rawCtx = JSON.parse(project.businessContext);
  const strategy = rawCtx._strategy;
  if (!strategy) return { nextState: "failed", error: "No strategy found" };

  const themeResult = await generateTheme(
    rawCtx as Record<string, unknown>,
    strategy.pageType
  );

  if (!themeResult) {
    return { nextState: "failed", error: "Failed to generate theme. Please retry." };
  }

  // Store theme in business context
  await prisma.project.update({
    where: { id: projectId },
    data: {
      businessContext: JSON.stringify({
        ...rawCtx,
        _theme: themeResult,
      }),
    },
  });

  await addSystemMessage(
    projectId,
    `Theme generated: ${themeResult.themeVariant} variant with ${themeResult.brand.primaryColor} primary color and ${themeResult.brand.fontHeading} font.`
  );

  return { nextState: "asset_planning" };
}

async function executeAssetPlanning(
  projectId: string
): Promise<{ nextState: WorkflowState; error?: string }> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { nextState: "failed", error: "Project not found" };

  const rawCtx = JSON.parse(project.businessContext);
  const strategy = rawCtx._strategy;
  if (!strategy) return { nextState: "failed", error: "No strategy found" };

  const assets = planAssets(strategy.sectionSequence, rawCtx.businessName || "Business");

  // Store placeholder assets in DB
  for (const asset of assets) {
    await prisma.asset.create({
      data: {
        id: asset.id,
        projectId,
        kind: asset.kind,
        source: asset.source,
        url: asset.url,
        altText: asset.alt || null,
      },
    });
  }

  await addSystemMessage(projectId, `Asset plan created: ${assets.length} placeholder images ready for replacement.`);

  return { nextState: "image_prompt_generation" };
}

async function executeImagePromptGeneration(
  projectId: string
): Promise<{ nextState: WorkflowState; error?: string }> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { nextState: "failed", error: "Project not found" };

  const rawCtx = JSON.parse(project.businessContext);
  const strategy = rawCtx._strategy;
  const theme = rawCtx._theme;

  if (!strategy) return { nextState: "failed", error: "No strategy found" };

  const prompts = await generateImagePrompts(
    rawCtx,
    strategy,
    { tone: theme?.brand?.tone || rawCtx.tone || "professional", primaryColor: theme?.brand?.primaryColor || "#2563eb", themeVariant: theme?.themeVariant }
  );

  // Store prompts in context for next step
  await prisma.project.update({
    where: { id: projectId },
    data: {
      businessContext: JSON.stringify({
        ...rawCtx,
        _imagePrompts: prompts,
      }),
    },
  });

  await addSystemMessage(projectId, `Generated ${prompts.length} image prompt(s) for hero and section visuals.`);

  return { nextState: "image_generation" };
}

async function executeImageGeneration(
  projectId: string
): Promise<{ nextState: WorkflowState; error?: string }> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { nextState: "failed", error: "Project not found" };

  const rawCtx = JSON.parse(project.businessContext);
  const imagePrompts = rawCtx._imagePrompts || [];

  if (imagePrompts.length === 0) {
    await addSystemMessage(projectId, "No image prompts to process. Continuing with plan generation.");
    return { nextState: "plan_generation_running" };
  }

  const assets = await generateImages(imagePrompts, projectId);

  // Store AI-generated assets in DB
  for (const asset of assets) {
    await prisma.asset.create({
      data: {
        id: asset.id,
        projectId,
        kind: asset.kind,
        source: asset.source,
        url: asset.url,
        altText: asset.alt || null,
      },
    });
  }

  const aiCount = assets.filter((a) => a.source === "ai").length;
  const placeholderCount = assets.filter((a) => a.source === "placeholder").length;
  const msg = aiCount > 0
    ? `Generated ${aiCount} AI image(s)${placeholderCount > 0 ? ` and ${placeholderCount} placeholder(s)` : ""}.`
    : `Using ${placeholderCount} placeholder image(s). AI image generation requires OPENAI_API_KEY.`;

  await addSystemMessage(projectId, msg);

  return { nextState: "plan_generation_running" };
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

  const strategy = rawCtx._strategy;
  const theme = rawCtx._theme;

  // Generate plan using strategy's section sequence if available
  const plan = await generatePlan(
    businessContext as unknown as Record<string, unknown>,
    hasCompetitorInsights ? competitorData : null
  );

  if (!plan) {
    return { nextState: "failed", error: "Failed to generate page plan. Please retry." };
  }

  // If strategy produced a section sequence, use that instead of planner's
  if (strategy?.sectionSequence?.length) {
    plan.sections = strategy.sectionSequence;
  }

  // If theme was generated, use that branding instead
  if (theme?.brand) {
    plan.branding = {
      primary_color: theme.brand.primaryColor,
      secondary_color: theme.brand.secondaryColor,
      accent_color: theme.brand.accentColor,
      font_family: theme.brand.fontHeading,
      tone: theme.brand.tone,
    };
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
    .map((s: { type: string; description: string }, i: number) => `${i + 1}. ${s.type.charAt(0).toUpperCase() + s.type.slice(1)}: ${s.description}`)
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
  const rawCtx = JSON.parse(project.businessContext);
  const businessContext = fillDefaults(rawCtx);
  const theme = rawCtx._theme;

  // Use the new V2 generator if we have strategy/theme data
  let sections: Section[];
  let generatedActions: import("@/lib/page/schema").Action[] = [];
  if (theme?.brand) {
    const brand: Brand = theme.brand;
    const sectionPlans = plan.sections.map((s: { type: string; description: string }) => ({
      type: s.type as SectionType,
      description: s.description,
    }));
    const result = await generateAllSectionsWithActions(
      sectionPlans,
      businessContext as unknown as Record<string, unknown>,
      brand
    );
    sections = result.sections;
    generatedActions = result.actions;
  } else {
    // Fallback to legacy generator for existing projects
    const legacySections = await generateAllSections(plan, businessContext as unknown as Record<string, unknown>);
    sections = legacySections as unknown as Section[];
  }

  if (!sections || sections.length === 0) {
    return { nextState: "failed", error: "Failed to generate page sections" };
  }

  // Build global styles
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
        pageType: theme?.themeVariant ? rawCtx._strategy?.pageType || "" : "",
        themeVariant: theme?.themeVariant || "",
      },
    });
  } else {
    await prisma.page.create({
      data: {
        projectId,
        sectionsJson: JSON.stringify(sections),
        globalStyles: JSON.stringify(globalStyles),
        pageType: rawCtx._strategy?.pageType || "",
        themeVariant: theme?.themeVariant || "",
      },
    });
  }

  // Store generated actions for document assembly
  if (generatedActions.length > 0) {
    const latestProject = await prisma.project.findUnique({ where: { id: projectId } });
    const latestCtx = JSON.parse(latestProject?.businessContext || "{}");
    await prisma.project.update({
      where: { id: projectId },
      data: {
        businessContext: JSON.stringify({
          ...latestCtx,
          _generatedActions: generatedActions,
        }),
      },
    });
  }

  await addSystemMessage(projectId, `All ${sections.length} sections generated successfully. Assembling your page...`);

  return { nextState: "document_assembly" };
}

async function executeDocumentAssembly(
  projectId: string
): Promise<{ nextState: WorkflowState; error?: string }> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { page: true, pagePlan: true, assets: true },
  });

  if (!project?.page) return { nextState: "failed", error: "No page data found" };

  const rawCtx = JSON.parse(project.businessContext);
  const theme = rawCtx._theme;
  const strategy = rawCtx._strategy;
  const plan = project.pagePlan ? JSON.parse(project.pagePlan.planData) : null;

  const sections = JSON.parse(project.page.sectionsJson) as Section[];

  // Build PageDocument
  const pageDocument: PageDocument = {
    meta: {
      title: plan?.page_meta?.title || project.name,
      description: plan?.page_meta?.description || "",
      pageType: strategy?.pageType || "service-business",
      themeVariant: theme?.themeVariant || "clean",
    },
    brand: theme?.brand || {
      tone: plan?.branding?.tone || "professional",
      primaryColor: plan?.branding?.primary_color || "#2563eb",
      secondaryColor: plan?.branding?.secondary_color || "#1e40af",
      accentColor: plan?.branding?.accent_color || "#f59e0b",
      fontHeading: plan?.branding?.font_family || "Inter",
      fontBody: plan?.branding?.font_family || "Inter",
    },
    assets: project.assets.map((a) => ({
      id: a.id,
      kind: a.kind as "image" | "icon" | "video",
      source: a.source as "upload" | "stock" | "ai" | "placeholder",
      url: a.url,
      alt: a.altText || undefined,
    })),
    actions: (rawCtx._generatedActions as Action[]) || [],
    sections,
  };

  // Run quality validation and auto-repair
  const qualityIssues = validateDocumentQuality(pageDocument);
  const errors = qualityIssues.filter((i) => i.severity === "error");
  const warnings = qualityIssues.filter((i) => i.severity === "warning");

  let finalDoc = pageDocument;
  if (errors.length > 0 || warnings.length > 0) {
    const { doc: repairedDoc, repairs } = autoRepairDocument(pageDocument);
    finalDoc = repairedDoc;

    if (repairs.length > 0) {
      await addSystemMessage(projectId, `Auto-repaired: ${repairs.join(", ")}`);
    }
    if (warnings.length > 0) {
      await addSystemMessage(
        projectId,
        `Quality check: ${warnings.length} warning(s) — ${warnings.map((w) => w.message).join("; ")}`
      );
    }
  }

  // Store PageDocument
  await prisma.page.update({
    where: { id: project.page.id },
    data: { documentJson: JSON.stringify(finalDoc) },
  });

  return { nextState: "rendering" };
}

async function executeRendering(
  projectId: string
): Promise<{ nextState: WorkflowState; error?: string }> {
  const page = await prisma.page.findUnique({ where: { projectId } });
  const plan = await prisma.pagePlan.findUnique({ where: { projectId } });

  if (!page) return { nextState: "failed", error: "No page data found" };

  let renderedHtml: string;

  // Use new renderer if we have a PageDocument
  const documentJson = page.documentJson;
  if (documentJson && documentJson !== "{}") {
    const doc = JSON.parse(documentJson) as PageDocument;
    renderedHtml = renderPageFromDocument(doc);
  } else {
    // Fallback to legacy renderer for old projects
    const sections = JSON.parse(page.sectionsJson);
    const globalStyles = JSON.parse(page.globalStyles);
    const planData = plan ? JSON.parse(plan.planData) : { page_meta: { title: "Landing Page", description: "" } };
    renderedHtml = renderPageHtml(sections, globalStyles, planData.page_meta);
  }

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
