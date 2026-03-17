/**
 * Orchestrator — execution-environment-independent entry point.
 * Called by the API route handler (Phase 1: in-process) or a future queue consumer.
 * Reads/writes DB only. Does not depend on request/response objects.
 */

import { prisma } from "@/lib/db";
import { buildSiteBuildGraph } from "./graph/site-build-graph";
import { releaseRunLock, appendRunLog } from "./run-lock";
import type { SiteBuildState } from "./types";

/**
 * Run the site build orchestrator.
 * This is the main entry point for multi-page site generation.
 *
 * @param projectId - The project to generate for
 * @param runId - The GenerationRun ID (already created by acquireRunLock)
 */
export async function runSiteBuildOrchestrator(
  projectId: string,
  runId: string
): Promise<void> {
  try {
    // Load project and business context
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      await releaseRunLock(runId, "failed", { error: "Project not found" });
      return;
    }

    const businessContext = JSON.parse(project.businessContext || "{}");

    // Check minimum context
    if (!businessContext.businessName) {
      await releaseRunLock(runId, "failed", {
        error: "Business context is missing required fields (businessName)",
      });
      return;
    }

    await appendRunLog(runId, {
      phase: "planning",
      message: `Starting site build for "${businessContext.businessName}"`,
      level: "info",
    });

    // Build and run the graph
    const graph = buildSiteBuildGraph();

    const initialState: Partial<SiteBuildState> = {
      projectId,
      runId,
      businessContext,
      sitePlan: null,
      siteSettingsDraft: null,
      pagePlans: {},
      pageDocuments: {},
      pageStatuses: {},
      reviewResult: null,
      repairQueue: [],
      reviewPassCount: 0,
      repairPassCount: 0,
      repairsAttempted: 0,
      repairsSucceeded: 0,
      completedPages: [],
      failedPages: [],
      logs: [],
      currentPhase: "planning",
    };

    await graph.invoke(initialState);

    // Graph has completed — finalize node already released the lock
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown orchestrator error";
    console.error(`Orchestrator error for run ${runId}:`, err);

    // Ensure run is marked as failed
    try {
      await releaseRunLock(runId, "failed", { error: errorMsg });
      await appendRunLog(runId, {
        phase: "orchestrator",
        message: `Fatal error: ${errorMsg}`,
        level: "error",
      });
    } catch {
      // If even this fails, there's nothing more we can do
      console.error(`Failed to release run lock for ${runId}`);
    }
  }
}
