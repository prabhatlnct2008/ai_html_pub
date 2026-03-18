/**
 * Graph Node: repair
 * Fixes issues flagged by the review, persists patches to DB.
 */

import { prisma } from "@/lib/db";
import { renderPageFromDocument } from "@/lib/page/renderer";
import type { SiteBuildStateType } from "../site-build-state";
import { runRepairAgent } from "../../agents/repair-agent";
import { appendRunLog, updateRunProgress } from "../../run-lock";
import { saveArtifact } from "../../artifacts";
import type { LogEntry } from "../../types";
import type { PageDocument } from "@/lib/page/schema";

export async function repairNode(
  state: SiteBuildStateType
): Promise<Partial<SiteBuildStateType>> {
  const logs: LogEntry[] = [];
  const log = (message: string, level: "info" | "warn" | "error" = "info") => {
    logs.push({ timestamp: new Date().toISOString(), phase: "repairing", message, level });
  };

  if (state.repairQueue.length === 0) {
    log("No repairs needed");
    return { currentPhase: "reviewing", logs };
  }

  log(`Starting repair: ${state.repairQueue.length} issues`);
  await updateRunProgress(state.runId, { currentPhase: "repairing" });
  await appendRunLog(state.runId, {
    phase: "repairing",
    message: `Repairing ${state.repairQueue.length} issues`,
    level: "info",
  });

  const updatedDocuments = { ...state.pageDocuments };
  let repairsSucceeded = 0;
  let repairsFailed = 0;

  for (const item of state.repairQueue) {
    const doc = updatedDocuments[item.targetSlug];
    if (!doc) {
      log(`Page "${item.targetSlug}" not found — skipping repair`, "warn");
      repairsFailed++;
      continue;
    }

    log(`Repairing: ${item.issue.description} on /${item.targetSlug}`);

    // Persist repair attempt artifact
    await saveArtifact({
      projectId: state.projectId,
      generationRunId: state.runId,
      artifactType: "repair_attempt",
      phase: "repairing",
      status: "created",
      payloadJson: { issue: item.issue, targetSlug: item.targetSlug, targetSectionId: item.targetSectionId },
      pageSlug: item.targetSlug,
      sourceAgent: "repair-agent",
    });

    const { repairedSection, repairedSections, skipped } = await runRepairAgent(
      item.issue,
      doc,
      item.targetSlug,
      state.businessContext
    );

    if (skipped) {
      repairsFailed++;
      await saveArtifact({
        projectId: state.projectId,
        generationRunId: state.runId,
        artifactType: "repair_result",
        phase: "repairing",
        status: "failure",
        payloadJson: {},
        pageSlug: item.targetSlug,
        sourceAgent: "repair-agent",
        error: "Repair skipped or failed",
      });
      continue;
    }

    // Apply repair
    let updatedDoc: PageDocument;

    if (repairedSections) {
      // Page-scope repair — replace all sections
      updatedDoc = { ...doc, sections: repairedSections };
    } else if (repairedSection && item.targetSectionId) {
      // Section-scope repair — replace single section
      updatedDoc = {
        ...doc,
        sections: doc.sections.map((s) =>
          s.id === item.targetSectionId ? repairedSection : s
        ),
      };
    } else {
      repairsFailed++;
      continue;
    }

    updatedDocuments[item.targetSlug] = updatedDoc;
    repairsSucceeded++;

    // Persist repair result artifact
    await saveArtifact({
      projectId: state.projectId,
      generationRunId: state.runId,
      artifactType: "repair_result",
      phase: "repairing",
      status: "success",
      payloadJson: updatedDoc,
      pageSlug: item.targetSlug,
      sourceAgent: "repair-agent",
      metadataJson: { issueDescription: item.issue.description },
    });

    // Persist repaired page
    try {
      let renderedHtml = "";
      try {
        renderedHtml = renderPageFromDocument(updatedDoc);
      } catch { /* non-fatal */ }

      const page = await prisma.page.findUnique({
        where: {
          projectId_slug: { projectId: state.projectId, slug: item.targetSlug },
        },
      });

      if (page) {
        await prisma.page.update({
          where: { id: page.id },
          data: {
            documentJson: JSON.stringify(updatedDoc),
            renderedHtml,
            sectionsJson: JSON.stringify(updatedDoc.sections),
          },
        });
        log(`Persisted repair for /${item.targetSlug}`);
      }
    } catch (err) {
      log(`Failed to persist repair for /${item.targetSlug}: ${err}`, "error");
    }
  }

  log(`Repairs complete: ${repairsSucceeded} succeeded, ${repairsFailed} failed`);
  await appendRunLog(state.runId, {
    phase: "repairing",
    message: `Repairs: ${repairsSucceeded} ok, ${repairsFailed} failed`,
    level: "info",
  });

  return {
    pageDocuments: updatedDocuments,
    repairQueue: [],
    repairPassCount: state.repairPassCount + 1,
    repairsAttempted: repairsSucceeded + repairsFailed,
    repairsSucceeded: repairsSucceeded,
    currentPhase: "reviewing", // re-review after repair
    logs,
  };
}
