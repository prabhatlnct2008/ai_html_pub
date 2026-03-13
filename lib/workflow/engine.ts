import { prisma } from "@/lib/db";
import {
  requiresUserInput,
  type WorkflowState,
  type WorkflowStep,
  type WorkflowStatus,
} from "./types";
import { getNextState, stateToStepName, stateToProgress } from "./transitions";
import { executeState } from "./runner";

/**
 * Run the workflow engine for a project.
 * Loops through auto-executable states until hitting a user-input state,
 * terminal state, or error.
 */
export async function runWorkflow(projectId: string): Promise<WorkflowStatus> {
  let workflow = await getOrCreateWorkflow(projectId);
  let state = workflow.state as WorkflowState;

  // If we're in a user-input state or terminal state, just return status
  if (requiresUserInput(state) || state === "complete") {
    return buildStatus(projectId);
  }

  // Auto-execute loop
  let iterations = 0;
  const maxIterations = 15; // safety limit

  while (iterations < maxIterations) {
    iterations++;

    // Check for auto-transition first (states that just redirect)
    const autoNext = getNextState(state, {
      hasCompetitorUrl: await projectHasCompetitorUrl(projectId),
    });

    if (autoNext) {
      state = autoNext;
      await updateWorkflowState(projectId, state);
      continue;
    }

    // If this state requires user input, stop
    if (requiresUserInput(state) || state === "complete" || state === "failed") {
      break;
    }

    // Execute the state action
    await updateStepStatus(projectId, state, "in_progress");
    await updateWorkflowState(projectId, state, getStepMessage(state));

    try {
      const result = await executeState(projectId, state);

      if (result.error) {
        await updateStepStatus(projectId, state, "failed", result.error);
        await updateWorkflowState(projectId, "failed", result.error);
        state = "failed";
        break;
      }

      await updateStepStatus(projectId, state, "completed");
      state = result.nextState;
      await updateWorkflowState(projectId, state);

      // If next state requires user input or is terminal, stop
      if (requiresUserInput(state) || state === "complete" || state === "failed") {
        break;
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      await updateStepStatus(projectId, state, "failed", errorMsg);
      await updateWorkflowState(projectId, "failed", errorMsg);
      state = "failed";
      break;
    }
  }

  // Mark plan_approval step as in_progress when we reach plan_review
  if (state === "plan_review") {
    await updateStepStatus(projectId, "plan_review" as WorkflowState, "in_progress");
  }

  return buildStatus(projectId);
}

/**
 * Build the status object for frontend consumption.
 */
export async function buildStatus(projectId: string): Promise<WorkflowStatus> {
  const workflow = await prisma.workflowRun.findUnique({ where: { projectId } });
  if (!workflow) {
    return {
      state: "intake",
      currentStep: "Understanding your business",
      steps: [],
      canUserReply: true,
      progressPercent: 0,
      progressMessage: "Tell us about your business to get started",
      error: null,
    };
  }

  const state = workflow.state as WorkflowState;
  const steps = JSON.parse(workflow.steps) as WorkflowStep[];
  const hasCompetitorUrl = await projectHasCompetitorUrl(projectId);

  // Get plan if it exists
  const plan = await prisma.pagePlan.findUnique({ where: { projectId } });
  const planData = plan ? JSON.parse(plan.planData) : undefined;

  // Get project for redirect
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  return {
    state,
    currentStep: workflow.currentStep,
    steps,
    canUserReply: requiresUserInput(state),
    progressPercent: stateToProgress(state, hasCompetitorUrl),
    progressMessage: getProgressMessage(state),
    error: workflow.lastError || null,
    plan: planData,
    redirectTo: state === "complete" ? `/projects/${projectId}/editor` : undefined,
  };
}

// ---- Internal helpers ----

async function getOrCreateWorkflow(projectId: string) {
  let workflow = await prisma.workflowRun.findUnique({ where: { projectId } });
  if (!workflow) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    const ctx = JSON.parse(project?.businessContext || "{}");
    const hasCompetitorUrl = !!ctx.competitorUrl;

    const { buildInitialSteps } = await import("./types");
    const steps = buildInitialSteps(hasCompetitorUrl);

    workflow = await prisma.workflowRun.create({
      data: {
        projectId,
        state: "intake",
        currentStep: "Understanding your business",
        steps: JSON.stringify(steps),
        canUserReply: true,
      },
    });
  }
  return workflow;
}

async function updateWorkflowState(
  projectId: string,
  state: WorkflowState,
  message?: string
) {
  const data: Record<string, unknown> = {
    state,
    canUserReply: requiresUserInput(state),
    currentStep: message || getStepMessage(state),
    progressPercent: stateToProgress(state, await projectHasCompetitorUrl(projectId)),
    lastError: state === "failed" ? message : null,
  };

  if (state === "complete") {
    data.completedAt = new Date();
  }

  await prisma.workflowRun.update({ where: { projectId }, data });
}

async function updateStepStatus(
  projectId: string,
  state: WorkflowState,
  status: "in_progress" | "completed" | "failed",
  error?: string
) {
  const workflow = await prisma.workflowRun.findUnique({ where: { projectId } });
  if (!workflow) return;

  const steps = JSON.parse(workflow.steps) as WorkflowStep[];
  const stepName = stateToStepName(state);
  const step = steps.find((s) => s.name === stepName);

  if (step) {
    step.status = status;
    if (status === "in_progress") step.startedAt = new Date().toISOString();
    if (status === "completed") step.completedAt = new Date().toISOString();
    if (status === "failed") step.error = error;
  }

  await prisma.workflowRun.update({
    where: { projectId },
    data: { steps: JSON.stringify(steps) },
  });
}

async function projectHasCompetitorUrl(projectId: string): Promise<boolean> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return false;
  const ctx = JSON.parse(project.businessContext);
  return !!ctx.competitorUrl;
}

function getStepMessage(state: WorkflowState): string {
  const messages: Record<string, string> = {
    intake: "Understanding your business",
    intake_complete: "Business info collected",
    competitor_analysis_running: "Analyzing competitor website...",
    competitor_analysis_complete: "Competitor analysis done",
    plan_generation_running: "Building your page plan...",
    plan_review: "Review your page plan",
    generation_running: "Generating page sections...",
    rendering: "Rendering your landing page...",
    saving: "Saving your project...",
    complete: "Your page is ready!",
    failed: "Something went wrong",
  };
  return messages[state] || "";
}

function getProgressMessage(state: WorkflowState): string {
  const messages: Record<string, string> = {
    intake: "Tell us about your business to get started",
    intake_complete: "Processing your information...",
    competitor_analysis_running: "Analyzing the competitor website for design patterns...",
    competitor_analysis_complete: "Moving to plan generation...",
    plan_generation_running: "AI is creating your page structure and branding...",
    plan_review: "Review the plan below and approve or request changes",
    generation_running: "AI is writing content for each section of your page...",
    rendering: "Assembling your landing page HTML...",
    saving: "Saving everything...",
    complete: "Your landing page is ready! Redirecting to editor...",
    failed: "An error occurred. You can retry.",
  };
  return messages[state] || "";
}
