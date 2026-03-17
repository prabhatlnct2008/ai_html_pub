/**
 * Graph Node: site_planning
 * Runs the Site Planner Agent to generate a SitePlan.
 */

import type { SiteBuildStateType } from "../site-build-state";
import { runSitePlannerAgent } from "../../agents/site-planner";
import { appendRunLog, updateRunProgress } from "../../run-lock";
import type { LogEntry } from "../../types";

export async function sitePlanningNode(
  state: SiteBuildStateType
): Promise<Partial<SiteBuildStateType>> {
  const logs: LogEntry[] = [];
  const log = (message: string, level: "info" | "warn" | "error" = "info") => {
    logs.push({ timestamp: new Date().toISOString(), phase: "planning", message, level });
  };

  log("Starting site planning...");

  await updateRunProgress(state.runId, { currentPhase: "planning" });
  await appendRunLog(state.runId, { phase: "planning", message: "Site planning started", level: "info" });

  const { plan, usedFallback } = await runSitePlannerAgent(state.businessContext);

  if (usedFallback) {
    log("Used fallback site plan (minimal: home + contact)", "warn");
    await appendRunLog(state.runId, { phase: "planning", message: "Used fallback site plan", level: "warn" });
  } else {
    log(`Site plan generated: ${plan.pages.length} pages`);
    await appendRunLog(state.runId, {
      phase: "planning",
      message: `Site plan: ${plan.pages.map((p) => p.slug).join(", ")}`,
      level: "info",
    });
  }

  // Initialize page statuses
  const pageStatuses: Record<string, { status: "pending"; retryCount: 0; issues: string[] }> = {};
  for (const page of plan.pages) {
    pageStatuses[page.slug] = { status: "pending", retryCount: 0, issues: [] };
  }

  await updateRunProgress(state.runId, { pagesPlanned: plan.pages.length });

  return {
    sitePlan: plan,
    pageStatuses,
    currentPhase: "settings",
    logs,
  };
}
