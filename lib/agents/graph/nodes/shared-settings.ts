/**
 * Graph Node: shared_settings
 * Runs the Shared Settings Agent + persists to Project.siteSettings.
 */

import { prisma } from "@/lib/db";
import type { SiteBuildStateType } from "../site-build-state";
import { runSharedSettingsAgent } from "../../agents/shared-settings-agent";
import { appendRunLog, updateRunProgress } from "../../run-lock";
import { saveArtifact } from "../../artifacts";
import type { LogEntry, SiteSettingsDraft } from "../../types";
import type { SiteSettings } from "@/lib/site/types";
import { CURRENT_MIGRATION_VERSION } from "@/lib/site/types";

export async function sharedSettingsNode(
  state: SiteBuildStateType
): Promise<Partial<SiteBuildStateType>> {
  const logs: LogEntry[] = [];
  const log = (message: string, level: "info" | "warn" | "error" = "info") => {
    logs.push({ timestamp: new Date().toISOString(), phase: "settings", message, level });
  };

  if (!state.sitePlan) {
    log("No site plan available — cannot generate settings", "error");
    return { currentPhase: "failed", logs };
  }

  log("Generating shared site settings...");
  await updateRunProgress(state.runId, { currentPhase: "settings" });
  await appendRunLog(state.runId, { phase: "settings", message: "Generating shared settings", level: "info" });

  const { settings, usedFallback } = await runSharedSettingsAgent(
    state.businessContext,
    state.sitePlan
  );

  if (usedFallback) {
    log("Used fallback site settings", "warn");
    await appendRunLog(state.runId, { phase: "settings", message: "Used fallback settings", level: "warn" });
  } else {
    log(`Generated settings: ${settings.actions.length} actions, ${settings.navigation.length} nav items`);
  }

  // Persist shared settings artifact
  await saveArtifact({
    projectId: state.projectId,
    generationRunId: state.runId,
    artifactType: "shared_settings",
    phase: "settings",
    status: "success",
    payloadJson: settings,
    sourceAgent: "shared-settings-agent",
    metadataJson: { usedFallback },
  });

  // Persist to Project.siteSettings
  const siteSettings: SiteSettings = {
    migrationVersion: CURRENT_MIGRATION_VERSION,
    siteName: settings.header.siteName,
    brand: settings.brand,
    actions: settings.actions,
    navigation: settings.navigation,
    header: settings.header,
    footer: { ...settings.footer, extracted: true },
    socialLinks: settings.socialLinks,
    contactInfo: settings.contactInfo,
  };

  await prisma.project.update({
    where: { id: state.projectId },
    data: { siteSettings: JSON.stringify(siteSettings) },
  });

  log("Site settings persisted to database");
  await appendRunLog(state.runId, { phase: "settings", message: "Settings persisted", level: "info" });

  return {
    siteSettingsDraft: settings,
    currentPhase: "page_planning",
    logs,
  };
}
