import { prisma } from "@/lib/db";
import { processIntakeMessage } from "./intake";
import { analyzeCompetitor } from "./competitor";
import { generatePlan, modifyPlan, type PagePlanData } from "./planner";
import { generateAllSections, type SectionData } from "./generator";
import { renderPageHtml } from "@/lib/html-renderer";

export type WorkflowState =
  | "intake"
  | "competitor_analysis"
  | "planning"
  | "plan_review"
  | "generation"
  | "complete";

interface OrchestratorResult {
  message: string;
  workflowState: WorkflowState;
  planData?: PagePlanData;
  generatedSections?: SectionData[];
  competitorInsights?: Record<string, unknown>;
}

export async function handleConversationMessage(
  projectId: string,
  userMessage: string
): Promise<OrchestratorResult> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { conversation: true, pagePlan: true },
  });

  if (!project || !project.conversation) {
    throw new Error("Project or conversation not found");
  }

  const conversation = project.conversation;
  const messages = JSON.parse(conversation.messages) as Array<{
    role: string;
    content: string;
  }>;
  const aiContext = JSON.parse(conversation.aiContext) as Record<string, unknown>;
  const currentState = conversation.workflowState as WorkflowState;

  // Add user message to history
  messages.push({
    role: "user",
    content: userMessage,
  });

  let result: OrchestratorResult;

  switch (currentState) {
    case "intake":
      result = await handleIntake(messages, aiContext, userMessage, project);
      break;
    case "competitor_analysis":
      result = await handleCompetitorAnalysis(project);
      break;
    case "planning":
    case "plan_review":
      result = await handlePlanning(aiContext, project, userMessage);
      break;
    case "generation":
      result = await handleGeneration(project);
      break;
    default:
      result = {
        message: "Your page has been generated! You can view and edit it now.",
        workflowState: "complete",
      };
  }

  // Add AI response to history
  messages.push({
    role: "assistant",
    content: result.message,
  });

  // Update conversation
  const updatedContext = { ...aiContext };
  if (result.competitorInsights) {
    updatedContext.competitorInsights = result.competitorInsights;
  }

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      messages: JSON.stringify(messages),
      workflowState: result.workflowState,
      aiContext: JSON.stringify(updatedContext),
    },
  });

  return result;
}

async function handleIntake(
  messages: Array<{ role: string; content: string }>,
  aiContext: Record<string, unknown>,
  latestMessage: string,
  project: { id: string; businessContext: string; conversation: { id: string } | null }
): Promise<OrchestratorResult> {
  const intakeResult = await processIntakeMessage(
    aiContext,
    messages.slice(0, -1), // exclude the latest user message since it's passed separately
    latestMessage
  );

  // Merge extracted context
  const updatedContext = { ...aiContext, ...intakeResult.extracted_context };
  await prisma.conversation.update({
    where: { id: project.conversation!.id },
    data: { aiContext: JSON.stringify(updatedContext) },
  });

  if (intakeResult.ready_for_plan) {
    // Check if competitor URL exists
    const businessCtx = JSON.parse(project.businessContext) as Record<string, string>;
    if (businessCtx.competitorUrl) {
      return {
        message:
          intakeResult.message +
          "\n\nI'll now analyze the competitor website you provided to help inform the page design.",
        workflowState: "competitor_analysis",
      };
    }

    // Skip to planning
    return {
      message:
        intakeResult.message +
        "\n\nLet me create a page plan for you based on what we've discussed.",
      workflowState: "planning",
    };
  }

  return {
    message: intakeResult.message,
    workflowState: "intake",
  };
}

async function handleCompetitorAnalysis(
  project: { id: string; businessContext: string }
): Promise<OrchestratorResult> {
  const businessCtx = JSON.parse(project.businessContext) as Record<string, string>;
  const url = businessCtx.competitorUrl;

  if (!url) {
    return {
      message: "No competitor URL provided. Let me create your page plan.",
      workflowState: "planning",
    };
  }

  const { insights, error } = await analyzeCompetitor(url);

  if (error || !insights) {
    await prisma.project.update({
      where: { id: project.id },
      data: { competitorData: JSON.stringify({ error: error || "Analysis failed" }) },
    });

    return {
      message: `I wasn't able to fully analyze the competitor website: ${error || "Unknown error"}. No worries — I'll create your page plan based on the information you've provided.`,
      workflowState: "planning",
    };
  }

  await prisma.project.update({
    where: { id: project.id },
    data: { competitorData: JSON.stringify(insights) },
  });

  return {
    message: `I've analyzed the competitor website and found some useful patterns:\n\n- **Sections identified**: ${insights.sections_identified.map((s) => s.type).join(", ")}\n- **Layout**: ${insights.layout_notes}\n- **Tone**: ${insights.content_tone}\n\nI'll use these insights to inform your page plan. Let me create it now.`,
    workflowState: "planning",
    competitorInsights: insights as unknown as Record<string, unknown>,
  };
}

async function handlePlanning(
  aiContext: Record<string, unknown>,
  project: { id: string; competitorData: string; pagePlan: { id: string; planData: string } | null },
  userMessage: string
): Promise<OrchestratorResult> {
  const competitorData = JSON.parse(project.competitorData);
  const hasCompetitorInsights =
    competitorData && !competitorData.error && Object.keys(competitorData).length > 0;

  // If plan exists and user is modifying
  if (project.pagePlan) {
    const currentPlan = JSON.parse(project.pagePlan.planData);
    const isApproval = /\b(approve|yes|looks good|go ahead|perfect|great|ok|generate)\b/i.test(userMessage);

    if (isApproval) {
      await prisma.pagePlan.update({
        where: { id: project.pagePlan.id },
        data: { status: "approved" },
      });
      return {
        message: "Plan approved! I'm now generating your landing page. This may take a moment...",
        workflowState: "generation",
        planData: currentPlan,
      };
    }

    // Modify the plan
    const modified = await modifyPlan(currentPlan, userMessage);
    if (modified) {
      await prisma.pagePlan.update({
        where: { id: project.pagePlan.id },
        data: {
          planData: JSON.stringify(modified),
          version: { increment: 1 },
        },
      });
      return {
        message: `I've updated the plan based on your feedback. Here's the revised structure:\n\n${modified.sections.map((s, i) => `${i + 1}. **${s.type.charAt(0).toUpperCase() + s.type.slice(1)}**: ${s.description}`).join("\n")}\n\nWould you like to approve this plan or make more changes?`,
        workflowState: "plan_review",
        planData: modified,
      };
    }
  }

  // Generate new plan
  const plan = await generatePlan(
    aiContext,
    hasCompetitorInsights ? competitorData : null
  );

  if (!plan) {
    return {
      message: "I had trouble generating the plan. Let me try again — could you confirm the main purpose of your landing page?",
      workflowState: "planning",
    };
  }

  // Save plan
  if (project.pagePlan) {
    await prisma.pagePlan.update({
      where: { id: project.pagePlan.id },
      data: { planData: JSON.stringify(plan), version: { increment: 1 } },
    });
  } else {
    await prisma.pagePlan.create({
      data: {
        projectId: project.id,
        planData: JSON.stringify(plan),
        status: "proposed",
      },
    });
  }

  return {
    message: `Here's my proposed landing page plan:\n\n**Page Structure:**\n${plan.sections.map((s, i) => `${i + 1}. **${s.type.charAt(0).toUpperCase() + s.type.slice(1)}**: ${s.description}`).join("\n")}\n\n**Branding:**\n- Primary color: ${plan.branding.primary_color}\n- Font: ${plan.branding.font_family}\n- Tone: ${plan.branding.tone}\n\nWould you like to approve this plan or suggest changes?`,
    workflowState: "plan_review",
    planData: plan,
  };
}

async function handleGeneration(
  project: { id: string; businessContext: string; pagePlan: { planData: string } | null; slug?: string }
): Promise<OrchestratorResult> {
  if (!project.pagePlan) {
    return {
      message: "No approved plan found. Let me create a plan first.",
      workflowState: "planning",
    };
  }

  const plan = JSON.parse(project.pagePlan.planData) as PagePlanData;
  const businessContext = JSON.parse(project.businessContext) as Record<string, unknown>;

  // Generate all sections
  const sections = await generateAllSections(plan, businessContext);

  // Render HTML
  const globalStyles = {
    primary_color: plan.branding.primary_color,
    secondary_color: plan.branding.secondary_color,
    accent_color: plan.branding.accent_color,
    font_family: plan.branding.font_family,
  };

  const renderedHtml = renderPageHtml(sections, globalStyles, plan.page_meta);

  // Save page
  const existingPage = await prisma.page.findUnique({
    where: { projectId: project.id },
  });

  if (existingPage) {
    // Create version backup
    await prisma.pageVersion.create({
      data: {
        pageId: existingPage.id,
        sectionsJson: existingPage.sectionsJson,
        globalStyles: existingPage.globalStyles,
        versionNumber: existingPage.version,
      },
    });

    await prisma.page.update({
      where: { id: existingPage.id },
      data: {
        sectionsJson: JSON.stringify(sections),
        globalStyles: JSON.stringify(globalStyles),
        renderedHtml,
        version: { increment: 1 },
      },
    });
  } else {
    await prisma.page.create({
      data: {
        projectId: project.id,
        sectionsJson: JSON.stringify(sections),
        globalStyles: JSON.stringify(globalStyles),
        renderedHtml,
      },
    });
  }

  // Update project status
  await prisma.project.update({
    where: { id: project.id },
    data: { status: "generated" },
  });

  return {
    message: "Your landing page has been generated! You can now view it or open the editor to customize it.",
    workflowState: "complete",
    generatedSections: sections,
  };
}
