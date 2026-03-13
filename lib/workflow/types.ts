// ---- Workflow States ----

export const WORKFLOW_STATES = [
  "intake",
  "intake_complete",
  "competitor_analysis_running",
  "competitor_analysis_complete",
  "plan_generation_running",
  "plan_review",
  "generation_running",
  "rendering",
  "saving",
  "complete",
  "failed",
] as const;

export type WorkflowState = (typeof WORKFLOW_STATES)[number];

// States that require user input before proceeding
export const USER_INPUT_STATES: WorkflowState[] = ["intake", "plan_review"];

// States that auto-execute without user input
export const AUTO_EXECUTE_STATES: WorkflowState[] = [
  "intake_complete",
  "competitor_analysis_running",
  "competitor_analysis_complete",
  "plan_generation_running",
  "generation_running",
  "rendering",
  "saving",
];

export function requiresUserInput(state: WorkflowState): boolean {
  return USER_INPUT_STATES.includes(state);
}

// ---- Step Definitions ----

export interface WorkflowStep {
  name: string;
  label: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export const STEP_DEFINITIONS: Array<{ name: string; label: string }> = [
  { name: "intake", label: "Understanding business" },
  { name: "competitor_analysis", label: "Competitor analysis" },
  { name: "plan_generation", label: "Building page plan" },
  { name: "plan_approval", label: "Waiting for approval" },
  { name: "section_generation", label: "Generating sections" },
  { name: "rendering", label: "Rendering page" },
  { name: "saving", label: "Saving project" },
];

export function buildInitialSteps(hasCompetitorUrl: boolean): WorkflowStep[] {
  return STEP_DEFINITIONS.filter(
    (s) => hasCompetitorUrl || s.name !== "competitor_analysis"
  ).map((s) => ({
    name: s.name,
    label: s.label,
    status: s.name === "intake" ? "in_progress" : "pending",
  }));
}

// ---- Business Context Schema ----

export interface BusinessContext {
  // Required - must have these to proceed
  businessName: string;
  businessType: string;
  targetAudience: string;
  primaryCta: string;

  // Optional - auto-fill with defaults if missing
  location?: string;
  tone?: string;
  mainOffer?: string;
  secondaryCta?: string;
  contactEmail?: string;
  contactPhone?: string;
  competitorUrl?: string;
  differentiators?: string[];
  testimonials?: string[];
  brandColors?: string;
}

export const REQUIRED_FIELDS: (keyof BusinessContext)[] = [
  "businessName",
  "businessType",
  "targetAudience",
  "primaryCta",
];

export function getMissingRequiredFields(ctx: Partial<BusinessContext>): string[] {
  return REQUIRED_FIELDS.filter(
    (f) => !ctx[f] || (typeof ctx[f] === "string" && !(ctx[f] as string).trim())
  );
}

export function hasMinimumContext(ctx: Partial<BusinessContext>): boolean {
  return getMissingRequiredFields(ctx).length === 0;
}

export function fillDefaults(ctx: Partial<BusinessContext>): BusinessContext {
  return {
    businessName: ctx.businessName || "My Business",
    businessType: ctx.businessType || "",
    targetAudience: ctx.targetAudience || "",
    primaryCta: ctx.primaryCta || "Contact Us",
    location: ctx.location || "",
    tone: ctx.tone || "professional",
    mainOffer: ctx.mainOffer || "",
    secondaryCta: ctx.secondaryCta || "Learn More",
    contactEmail: ctx.contactEmail || "",
    contactPhone: ctx.contactPhone || "",
    competitorUrl: ctx.competitorUrl || "",
    differentiators: ctx.differentiators || [],
    testimonials: ctx.testimonials || [],
    brandColors: ctx.brandColors || "",
  };
}

// ---- Workflow Status (returned to frontend) ----

export interface WorkflowStatus {
  state: WorkflowState;
  currentStep: string;
  steps: WorkflowStep[];
  canUserReply: boolean;
  progressPercent: number;
  progressMessage: string;
  error: string | null;
  plan?: Record<string, unknown>;
  redirectTo?: string;
}
