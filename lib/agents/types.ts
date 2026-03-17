/**
 * Agentic multi-page generation types.
 * These types define the state and contracts for the LangGraph-based
 * site generation pipeline.
 */

import type { PageDocument, BrandSettings, SectionType, Action } from "@/lib/page/schema";
import type { SiteSettings, NavItem } from "@/lib/site/types";

// ---- Site Plan ----

export interface SitePlanPage {
  slug: string;
  title: string;
  purpose: string;
  pageType: string;
  isHomepage: boolean;
  suggestedSections: SectionType[];
}

export interface SitePlan {
  pages: SitePlanPage[];
  siteGoal: string;
  targetAudience: string;
}

// ---- Site Settings Draft ----

export interface SiteSettingsDraft {
  brand: BrandSettings;
  /** Site-wide theme variant that drives layout, spacing, and variant selection. */
  themeVariant?: string;
  actions: Action[];
  navigation: NavItem[];
  header: {
    siteName: string;
    showNav: boolean;
    ctaActionId?: string;
  };
  footer: {
    companyName: string;
    tagline?: string;
    columns: Array<{
      title: string;
      links: Array<{ text: string; href?: string; actionId?: string }>;
    }>;
    copyrightYear: string;
    socialLinks?: Array<{ platform: string; url: string }>;
  };
  socialLinks: Array<{ platform: string; url: string }>;
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

// ---- Page Plan (agentic) ----

export interface AgenticPagePlan {
  slug: string;
  title: string;
  pageType: string;
  sections: Array<{
    type: SectionType;
    purpose: string;
    variant?: string;
  }>;
}

// ---- Site Review ----

export interface ReviewIssue {
  severity: "error" | "warning";
  scope: "page" | "section" | "site";
  targetSlug?: string;
  targetSectionId?: string;
  description: string;
  suggestedFix?: string;
}

export interface SiteReviewResult {
  overallScore: number; // 0-100
  issues: ReviewIssue[];
  summary: string;
}

// ---- Repair ----

export interface RepairItem {
  issue: ReviewIssue;
  targetSlug: string;
  targetSectionId?: string;
}

// ---- Per-Page Status Tracking ----

export type PageBuildStatus =
  | "pending"
  | "planning"
  | "plan_failed"
  | "generating"
  | "generated"
  | "gen_failed"
  | "reviewing"
  | "repairing"
  | "complete"
  | "failed";

export interface PageStatusEntry {
  status: PageBuildStatus;
  retryCount: number;
  issues: string[];
}

// ---- Log Entry ----

export interface LogEntry {
  timestamp: string;
  phase: string;
  message: string;
  level: "info" | "warn" | "error";
  data?: Record<string, unknown>;
}

// ---- Graph State ----

export type BuildPhase =
  | "planning"
  | "settings"
  | "page_planning"
  | "page_generation"
  | "reviewing"
  | "repairing"
  | "finalizing"
  | "complete"
  | "partial_complete"
  | "failed";

export interface SiteBuildState {
  // Immutable context
  projectId: string;
  runId: string;
  businessContext: Record<string, unknown>;

  // Agent outputs
  sitePlan: SitePlan | null;
  siteSettingsDraft: SiteSettingsDraft | null;
  pagePlans: Record<string, AgenticPagePlan>;
  pageDocuments: Record<string, PageDocument>;

  // Per-page tracking
  pageStatuses: Record<string, PageStatusEntry>;

  // Review and repair
  reviewResult: SiteReviewResult | null;
  repairQueue: RepairItem[];
  reviewPassCount: number;
  repairPassCount: number;

  // Repair metrics
  repairsAttempted: number;
  repairsSucceeded: number;

  // Completion tracking
  completedPages: string[];
  failedPages: string[];

  // Logging
  logs: LogEntry[];

  // Workflow phase
  currentPhase: BuildPhase;
}

// ---- Generation Summary (terminal response) ----

export interface GenerationSummary {
  pages: Array<{
    slug: string;
    title: string;
    status: "published" | "failed";
    sectionCount: number;
  }>;
  totalDurationMs: number;
  reviewScore: number | null;
  repairsAttempted: number;
  repairsSucceeded: number;
  warnings: string[];
}

// ---- API Response Types ----

export interface GenerationStatusResponse {
  runId: string;
  status: string;
  currentPhase: string;
  progress: {
    pagesPlanned: number;
    pagesCompleted: number;
    pagesFailed: number;
  };
  reviewScore: number | null;
  startedAt: string;
  completedAt: string | null;
  updatedAt: string;
  error: string | null;
  recentLogs: LogEntry[];
  summary: GenerationSummary | null;
}
