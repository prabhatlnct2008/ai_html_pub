/**
 * Graph Node: page_planning
 * Loops through all pages in the site plan and generates page plans.
 */

import type { SiteBuildStateType } from "../site-build-state";
import { runPagePlannerAgent } from "../../agents/page-planner";
import { appendRunLog, updateRunProgress } from "../../run-lock";
import type { LogEntry, AgenticPagePlan, PageStatusEntry } from "../../types";

export async function pagePlanningNode(
  state: SiteBuildStateType
): Promise<Partial<SiteBuildStateType>> {
  const logs: LogEntry[] = [];
  const log = (message: string, level: "info" | "warn" | "error" = "info") => {
    logs.push({ timestamp: new Date().toISOString(), phase: "page_planning", message, level });
  };

  if (!state.sitePlan) {
    log("No site plan — cannot plan pages", "error");
    return { currentPhase: "failed", logs };
  }

  log("Starting page planning...");
  await updateRunProgress(state.runId, { currentPhase: "page_planning" });
  await appendRunLog(state.runId, { phase: "page_planning", message: "Page planning started", level: "info" });

  const pagePlans: Record<string, AgenticPagePlan> = {};
  const pageStatuses: Record<string, PageStatusEntry> = { ...state.pageStatuses };
  const existingPlans: AgenticPagePlan[] = [];

  for (const page of state.sitePlan.pages) {
    const slug = page.slug;
    pageStatuses[slug] = { ...pageStatuses[slug], status: "planning" };

    log(`Planning page: ${page.title} (/${slug})`);
    await appendRunLog(state.runId, {
      phase: "page_planning",
      message: `Planning: ${page.title}`,
      level: "info",
    });

    const otherSummaries = existingPlans.map(
      (p) => `- ${p.title} (/${p.slug}): ${p.sections.map((s) => s.type).join(", ")}`
    );

    const themeVariant = state.siteSettingsDraft?.themeVariant || "clean";
    const { plan, usedFallback } = await runPagePlannerAgent(
      page,
      otherSummaries,
      state.businessContext,
      existingPlans,
      themeVariant
    );

    pagePlans[slug] = plan;
    existingPlans.push(plan);

    if (usedFallback) {
      log(`Used fallback plan for "${slug}"`, "warn");
      pageStatuses[slug] = { ...pageStatuses[slug], status: "pending" };
    } else {
      log(`Plan ready for "${slug}": ${plan.sections.length} sections`);
      pageStatuses[slug] = { ...pageStatuses[slug], status: "pending" };
    }
  }

  log(`All ${Object.keys(pagePlans).length} page plans ready`);

  return {
    pagePlans,
    pageStatuses,
    currentPhase: "page_generation",
    logs,
  };
}
