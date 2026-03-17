/**
 * LangGraph state definition for the site build graph.
 * Defines the state annotations/channels that flow through the graph.
 */

import { Annotation } from "@langchain/langgraph";
import type {
  SitePlan,
  SiteSettingsDraft,
  AgenticPagePlan,
  SiteReviewResult,
  RepairItem,
  PageStatusEntry,
  LogEntry,
  BuildPhase,
} from "../types";
import type { PageDocument } from "@/lib/page/schema";

/**
 * SiteBuildState annotation for LangGraph.
 * Each field is a channel that can be read and written by graph nodes.
 */
export const SiteBuildStateAnnotation = Annotation.Root({
  // Immutable context
  projectId: Annotation<string>,
  runId: Annotation<string>,
  businessContext: Annotation<Record<string, unknown>>,

  // Agent outputs
  sitePlan: Annotation<SitePlan | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  siteSettingsDraft: Annotation<SiteSettingsDraft | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  pagePlans: Annotation<Record<string, AgenticPagePlan>>({
    reducer: (prev, next) => ({ ...prev, ...next }),
    default: () => ({}),
  }),
  pageDocuments: Annotation<Record<string, PageDocument>>({
    reducer: (prev, next) => ({ ...prev, ...next }),
    default: () => ({}),
  }),

  // Per-page tracking
  pageStatuses: Annotation<Record<string, PageStatusEntry>>({
    reducer: (prev, next) => ({ ...prev, ...next }),
    default: () => ({}),
  }),

  // Review and repair
  reviewResult: Annotation<SiteReviewResult | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  repairQueue: Annotation<RepairItem[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  reviewPassCount: Annotation<number>({
    reducer: (_, next) => next,
    default: () => 0,
  }),
  repairPassCount: Annotation<number>({
    reducer: (_, next) => next,
    default: () => 0,
  }),

  // Completion tracking
  completedPages: Annotation<string[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  failedPages: Annotation<string[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),

  // Logging
  logs: Annotation<LogEntry[]>({
    reducer: (prev, next) => [...prev, ...next],
    default: () => [],
  }),

  // Workflow phase
  currentPhase: Annotation<BuildPhase>({
    reducer: (_, next) => next,
    default: () => "planning" as BuildPhase,
  }),
});

export type SiteBuildStateType = typeof SiteBuildStateAnnotation.State;
