# Planning: Agentic Multi-Page Website Generation and Repair

## 1. Purpose and Scope

### Purpose

Build the first production-grade agentic website-generation layer using LangGraph as the orchestration backbone. This system replaces the current single-page deterministic workflow with an agentic multi-page pipeline that can plan, generate, review, and repair entire business websites.

### Scope

**In scope:**

- LangGraph-based orchestrator for multi-page site generation
- Site Planner Agent (infer sitemap, page purposes, minimum viable pages)
- Shared Settings Agent (theme, actions, header, footer, navigation)
- Page Planner Agent (per-page section plans)
- Page Generator Agent (structured PageDocument generation per page)
- Site Review Agent (site-wide quality evaluation)
- Repair Agent (targeted fixes at site/page/section scope)
- Typed state machine with explicit transitions
- Bounded retry policy (max 2 per agent)
- Partial success handling (failed pages don't wipe successful ones)
- Workflow logging and observability
- Deterministic validators for schema, navigation, and action references
- Integration with existing Project/Page/SiteSettings models
- New API routes to trigger agentic site generation and poll status
- Dedicated `GenerationRun` Prisma model (new table, separate from legacy `WorkflowRun`)
- Background execution model (async trigger, poll for status via `GET /generation-status`)
- Incremental persistence (each page saved as soon as it is generated)
- Generation-run locking (one active run per project, reject duplicates)
- Worker-ready orchestrator architecture (execution-environment independent)

**Out of scope:**

- Editor Assistant Agent (post-generation editing help — later phase)
- Code/runtime agents
- Open-ended sandbox execution
- Durable external job queue (Redis, BullMQ, SQS) — Phase 1 uses in-process execution; architecture is designed so a queue consumer can replace the caller later
- Custom domains, analytics, collaboration
- Image generation pipeline changes (reuses existing)
- UI/editor changes beyond wiring to the new generation API

---

## 2. Current-State Analysis

### Current Workflow

The existing system generates a single landing page through a linear deterministic pipeline:

```
intake → kickoff_inferring → questioning → intake_complete →
competitor_analysis → strategy_generation → theme_generation →
asset_planning → image_prompt_generation → image_generation →
plan_generation → plan_review → generation_running →
document_assembly → rendering → saving → complete
```

**Key characteristics:**

- 1:1 workflow per project (WorkflowRun has `@unique` on projectId)
- Generates exactly one page (the homepage)
- Uses raw OpenAI SDK calls (no LangChain/LangGraph)
- Linear state machine with no loops or branching (except skip competitor analysis)
- Single failure mode: any step fails → whole workflow fails
- No review/repair loop — only a basic `autoRepairDocument()` in document assembly
- No concept of generating multiple pages per run
- State stored as JSON strings in WorkflowRun table

### Current AI Layer

- `lib/ai/openai-client.ts` — raw OpenAI SDK wrapper
- `lib/ai/strategist.ts` — generates page type and section sequence
- `lib/ai/theme-generator.ts` — generates brand/theme
- `lib/ai/planner.ts` — generates section plan for one page
- `lib/ai/generator.ts` / `section-generator.ts` — generates section content
- `lib/ai/prompts/` — prompt templates as string functions
- No structured output parsing (uses `response_format: { type: "json_object" }`)
- No retry logic at the AI call level

### Current Data Model

- `Project` — contains `businessContext`, `siteSettings`, pages relation
- `Page` — `documentJson` (canonical PageDocument), `renderedHtml`, multi-page ready
- `SiteSettings` — brand, actions, navigation, header, footer (JSON in Project)
- `PageDocument` — meta, brand (sentinel), assets, actions, sections
- `WorkflowRun` — state machine state, steps, progress (1:1 with Project)
- `PagePlan` — section plan for one page (1:1 with Project)

### What Already Exists That We Build On

- Multi-page data model (Page with projectId, slug, isHomepage, navOrder)
- SiteSettings with brand, actions, nav, header, footer
- Site migration logic (single-page to multi-page)
- Page renderer (`renderPageFromDocument`)
- Site shell composer (`composePageWithSiteShell`)
- Quality validators and auto-repair (`validateDocumentQuality`, `autoRepairDocument`)
- Typed section content interfaces for all 17 section types
- Published page routing (`/p/[slug]` and `/p/[slug]/[pageSlug]`)

---

## 3. Agent Set (First Implementation)

### 1. Site Planner Agent

**Responsibility:** Given business context, produce a site plan (which pages to create and why).

**Input:** `BusinessContext`

**Output:** `SitePlan` — list of pages with slugs, titles, purposes, section hints

**Retry:** max 2 attempts, fallback to minimal sitemap (homepage + contact)

### 2. Shared Settings Agent

**Responsibility:** Generate site-wide theme, actions, header, footer, and navigation strategy.

**Input:** `BusinessContext` + `SitePlan`

**Output:** `SiteSettingsDraft` — brand, actions pool, header config, footer config, nav items

**Retry:** max 2 attempts, fallback to DEFAULT_SITE_SETTINGS with business name

### 3. Page Planner Agent

**Responsibility:** Create a section-level plan for one page.

**Input:** `SitePlan` + `SiteSettingsDraft` + page goal + summaries of already-planned pages

**Output:** `PagePlan` — ordered section types with descriptions, distinct from other pages

**Retry:** max 2 attempts per page, fallback to default section template for page type

### 4. Page Generator Agent

**Responsibility:** Generate a full structured `PageDocument` from a page plan.

**Input:** `PagePlan` + `SiteSettingsDraft` + `BusinessContext` + action pool

**Output:** `PageDocument` (with sections, content, action refs, style)

**Retry:** max 2 attempts per page, mark page as failed if still broken

### 5. Site Review Agent

**Responsibility:** Review the complete generated site for quality issues.

**Input:** `SitePlan` + `SiteSettingsDraft` + all generated `PageDocument`s

**Output:** `SiteReviewResult` — list of issues with scope (site/page/section), severity, and repair hints

**Retry:** max 1 attempt (review itself)

### 6. Repair Agent

**Responsibility:** Apply targeted fixes to flagged issues.

**Input:** review issue + current page/section state + business context

**Output:** patched `PageDocument` or section content

**Retry:** max 2 attempts per repair target, skip if still failing

---

## 4. LangGraph Flow / State Machine

### Graph Nodes

```
START (acquire generation-run lock)
  → site_planning
  → shared_settings         (persist site settings incrementally)
  → page_planning           (loops over all pages)
  → page_generation         (loops over all pages, homepage first; persist each page to DB on success)
  → site_review
  → repair                  (conditional: only if review found repairable issues; persist patches)
  → finalize                (deterministic: update nav, flip statuses, close generation run)
  → END (complete | partial_complete | failed)
```

### Detailed Flow

```
┌─────────────────────────────────────────────────────┐
│  START                                              │
│  Acquire generation-run lock (409 if already running)│
│  Create GenerationRun record (status: running)      │
│  Initialize state from businessContext + projectId  │
└──────────────┬──────────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────┐
│  site_planning                                   │
│  Site Planner Agent → SitePlan                   │
│  Validator: homepage exists, no duplicate slugs  │
│  Retry: 2x, fallback: minimal sitemap           │
└──────────────┬───────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────┐
│  shared_settings                                 │
│  Shared Settings Agent → SiteSettingsDraft       │
│  Validator: brand has required fields, actions   │
│  have IDs, nav initialized                       │
│  Retry: 2x, fallback: defaults                   │
│  ** Persist: save SiteSettings to Project **     │
└──────────────┬───────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────┐
│  page_planning (loop over sitePlan.pages)        │
│  For each page:                                  │
│    Page Planner Agent → PagePlan                 │
│    Validator: sections non-empty, types valid    │
│    Retry: 2x per page, fallback template         │
│  Produces: pagePlans map                         │
└──────────────┬───────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────┐
│  page_generation (loop, homepage first)          │
│  For each page:                                  │
│    Page Generator Agent → PageDocument           │
│    Validator: schema valid, actions exist         │
│    Retry: 2x per page, mark failed if broken     │
│    ** Persist: save Page.documentJson +          │
│       Page.renderedHtml immediately on success ** │
│  Produces: pageDocuments map + per-page statuses │
└──────────────┬───────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────┐
│  site_review                                     │
│  Site Review Agent → SiteReviewResult            │
│  Deterministic checks + LLM quality review       │
│  Produces: reviewResult + repairQueue            │
└──────────────┬───────────────────────────────────┘
               ▼
         ┌─────────────┐
         │ Has repairs? │──── No ────┐
         └──────┬──────┘             │
                │ Yes                │
                ▼                    │
┌──────────────────────────────┐     │
│  repair (bounded loop)       │     │
│  For each repair target:     │     │
│    Repair Agent → patch      │     │
│    Retry: 2x per target      │     │
│    Skip if still failing     │     │
│  Then re-review (max 1x)     │     │
└──────────────┬───────────────┘     │
               ▼                     │
         ┌─────────────┐             │
         │ Re-review    │◄───────────┘
         │ (max 1 pass) │
         └──────┬──────┘
                ▼
┌──────────────────────────────────────────────────┐
│  finalize (deterministic — lightweight)          │
│  - Update navigation (pages already in DB)       │
│  - Flip page statuses: draft → published/failed  │
│  - Close GenerationRun: set terminal status      │
│  - Determine: complete | partial_complete        │
└──────────────┬───────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────┐
│  END                                             │
│  complete: all pages generated successfully      │
│  partial_complete: some pages ok, some failed    │
│  failed: critical failure (no pages generated)   │
└──────────────────────────────────────────────────┘
```

### Conditional Transitions

| Condition | Transition |
|-----------|------------|
| site_planning fails 2x | Use fallback sitemap, continue |
| shared_settings fails 2x | Use DEFAULT_SITE_SETTINGS, continue |
| page planning fails for one page | Mark page plan as failed, continue with other pages |
| page generation fails for one page | Mark page as failed, continue with other pages |
| review finds repairable issues | Go to repair node |
| repair pass completes | Re-review once, then finalize |
| repair still fails | Skip, finalize with partial results |
| all pages fail | End as failed |
| some pages fail | End as partial_complete |
| all pages succeed | End as complete |

---

## 5. State Shape and Persistence

### LangGraph State

```ts
interface SiteBuildState {
  // Immutable context
  projectId: string;
  runId: string;
  businessContext: BusinessContext;

  // Agent outputs
  sitePlan: SitePlan | null;
  siteSettingsDraft: SiteSettingsDraft | null;
  pagePlans: Record<string, PagePlan>;       // keyed by page slug
  pageDocuments: Record<string, PageDocument>; // keyed by page slug

  // Per-page tracking
  pageStatuses: Record<string, {
    status: "pending" | "planning" | "plan_failed" | "generating" |
            "generated" | "gen_failed" | "reviewing" | "repairing" |
            "complete" | "failed";
    retryCount: number;
    issues: string[];
  }>;

  // Review and repair
  reviewResult: SiteReviewResult | null;
  repairQueue: RepairItem[];
  reviewPassCount: number;
  repairPassCount: number;

  // Completion tracking
  completedPages: string[];
  failedPages: string[];

  // Logging
  logs: LogEntry[];

  // Workflow phase
  currentPhase: "planning" | "settings" | "page_planning" |
                "page_generation" | "reviewing" | "repairing" |
                "finalizing" | "complete" | "partial_complete" | "failed";
}
```

### Type Definitions for Agent Outputs

```ts
interface SitePlan {
  pages: Array<{
    slug: string;
    title: string;
    purpose: string;
    isHomepage: boolean;
    suggestedSections: string[];   // section type hints
    priority: "required" | "recommended" | "optional";
  }>;
  siteGoal: string;
  ctaStrategy: string;
  contactStrategy: string;
}

interface SiteSettingsDraft {
  siteName: string;
  brand: BrandSettings;
  actions: Action[];
  header: SiteHeader;
  footer: SiteFooter;
  navigation: NavItem[];
}

interface PagePlan {
  slug: string;
  title: string;
  purpose: string;
  sections: Array<{
    type: SectionType;
    variant: string;
    description: string;
    keyContent: string;
  }>;
  seoIntent: string;
  ctaActionIds: string[];          // references to shared action pool
}

interface SiteReviewResult {
  overallScore: number;            // 0-100
  issues: ReviewIssue[];
  strengths: string[];
}

interface ReviewIssue {
  severity: "critical" | "warning" | "suggestion";
  scope: "site" | "page" | "section";
  targetSlug?: string;             // page slug
  targetSectionId?: string;
  issue: string;
  repairHint: string;
  autoRepairable: boolean;
}

interface RepairItem {
  scope: "site" | "page" | "section";
  targetSlug: string;
  targetSectionId?: string;
  issue: string;
  repairHint: string;
  retryCount: number;
}

interface LogEntry {
  ts: string;
  phase: string;
  agent: string;
  action: string;
  message: string;
  durationMs?: number;
}
```

### Persistence Strategy — Incremental

The LangGraph state is in-memory during execution, but **results are persisted incrementally** as each milestone completes. This ensures that a crash after generating 4 of 5 pages does not lose those 4 pages.

**Incremental write points:**

| Milestone | What is persisted |
|-----------|-------------------|
| `shared_settings` completes | `SiteSettingsDraft` → `Project.siteSettings` (JSON) |
| Each page plan completes | `PagePlan` row or JSON field written per page |
| Each page generation completes | `Page.documentJson` + `Page.renderedHtml` written immediately, `Page.status = "draft"` |
| `site_review` completes | Review result + repair queue persisted to `GenerationRun.reviewResult` |
| Each repair completes | Patched `Page.documentJson` + `Page.renderedHtml` overwritten |
| `finalize` (final) | Navigation updated, page statuses finalized (`published` / `failed`), `GenerationRun.status` set to terminal state |

**Why incremental:**

- If the process dies after generating 4 of 5 pages, those 4 pages exist as `draft` records in the DB. The user (or a future retry mechanism) can pick up from there.
- Logs are appended to `GenerationRun.logs` at each step, not buffered until the end.
- The `finalize` node is a lightweight close-out step: update navigation, flip page statuses from `draft` to `published`, and mark the run as complete.

**What is NOT persisted incrementally:**

- Full LangGraph checkpoint state (no durable checkpoint store). We persist *outputs* incrementally, not the graph execution pointer. A crashed run cannot auto-resume from the exact interrupted node — but its completed work is safe.

### Generation Run Model

A **dedicated `GenerationRun` table** tracks each agentic generation attempt. This is a new Prisma model, separate from the legacy `WorkflowRun` (which remains for the single-page deterministic workflow). A project may have **multiple `GenerationRun` records** over its lifetime (re-generations, retries after failure, etc.).

```ts
interface GenerationRun {
  id: string;                     // UUID primary key
  projectId: string;              // FK to Project (not @unique — multiple runs per project)
  status: "running" | "complete" | "partial_complete" | "failed" | "cancelled";
  currentPhase: string;           // matches SiteBuildState.currentPhase
  pagesPlanned: number;
  pagesCompleted: number;
  pagesFailed: number;
  reviewScore: number | null;
  logs: LogEntry[];               // JSON array, appended incrementally
  error: string | null;
  executionMode: string;          // "local_in_process" for Phase 1; future: "worker", "container"
  triggeredBy: string;            // "api" | "retry" | "manual" — tracks how the run started
  summaryJson: string | null;     // terminal summary payload (set on completion), see Section 7
  startedAt: Date;
  completedAt: Date | null;
  updatedAt: Date;                // @updatedAt — tracks last DB write (used for stale detection)
}
```

**Prisma model (to be added to `prisma/schema.prisma`):**

```prisma
model GenerationRun {
  id              String    @id @default(uuid())
  projectId       String
  status          String    @default("running")
  currentPhase    String    @default("planning")
  pagesPlanned    Int       @default(0)
  pagesCompleted  Int       @default(0)
  pagesFailed     Int       @default(0)
  reviewScore     Float?
  logs            String    @default("[]")
  error           String?
  executionMode   String    @default("local_in_process")
  triggeredBy     String    @default("api")
  summaryJson     String?
  startedAt       DateTime  @default(now())
  completedAt     DateTime?
  updatedAt       DateTime  @updatedAt
  project         Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

**Key differences from `WorkflowRun`:**

| | `WorkflowRun` (legacy) | `GenerationRun` (new) |
|---|---|---|
| Scope | Single-page deterministic workflow | Multi-page agentic generation |
| Cardinality | 1:1 with Project (`@unique projectId`) | Many:1 with Project (run history) |
| State model | Linear state machine (intake → complete) | Phase-based (planning → finalizing) |
| Persistence | Updated at each state transition | Incremental (pages saved as generated) |
| Execution | Synchronous within request | Async, execution-environment independent |

### Generation-Run Locking

**One active run per project.** Before starting a new generation:

1. Check for an existing `GenerationRun` with `status = "running"` for this project.
2. If one exists and its `updatedAt` is < 15 minutes ago → reject with `409 Conflict` ("generation already in progress"). The run is still actively writing progress.
3. If one exists but `updatedAt` is > 15 minutes ago → mark it as `failed` (stale/crashed), allow new run. A run that hasn't written to the DB in 15 minutes is dead.
4. Create a new `GenerationRun` with `status = "running"` before launching the graph.
5. On completion (any terminal state), update the run record.

This prevents two concurrent requests from racing on the same project's pages and site settings.

---

## 6. Module/File Structure

```
lib/agents/                          # New directory for agentic system
  graph/
    site-build-graph.ts              # LangGraph graph definition
    site-build-state.ts              # State type + annotations
    nodes/
      site-planning.ts               # site_planning node
      shared-settings.ts             # shared_settings node (persists settings)
      page-planning.ts               # page_planning node (loop)
      page-generation.ts             # page_generation node (loop, persists each page)
      site-review.ts                 # site_review node
      repair.ts                      # repair node (persists patches)
      finalize.ts                    # finalize node (nav, statuses, close run)
    transitions.ts                   # Edge/conditional logic

  agents/
    site-planner.ts                  # LangChain-based site planner
    shared-settings-agent.ts         # LangChain-based settings generator
    page-planner.ts                  # LangChain-based page planner
    page-generator.ts                # LangChain-based page generator
    site-reviewer.ts                 # LangChain-based reviewer
    repair-agent.ts                  # LangChain-based repair agent

  prompts/
    site-planner.ts                  # Prompt template for site planning
    shared-settings.ts               # Prompt template for settings
    page-planner.ts                  # Prompt template for page planning
    page-generator.ts                # Prompt template for page generation
    site-reviewer.ts                 # Prompt template for review
    repair.ts                        # Prompt template for repair

  tools/
    validators.ts                    # Deterministic validation tools
    fallbacks.ts                     # Fallback generators (minimal sitemap, etc.)

  orchestrator.ts                    # Execution-environment-independent entry point (see Section 7)
  run-lock.ts                        # Generation-run locking (acquire/release/stale check)
  types.ts                           # All agentic type definitions

app/api/projects/[id]/generate-site/
  route.ts                           # POST endpoint: acquire lock, invoke orchestrator, return 202
app/api/projects/[id]/generation-status/
  route.ts                           # GET endpoint: poll GenerationRun status + progress + terminal summary
```

### Integration Points

- `app/api/projects/[id]/generate-site/route.ts` — POST: acquire lock, invoke orchestrator, return 202
- `app/api/projects/[id]/generation-status/route.ts` — GET: poll GenerationRun status, progress, terminal summary
- Existing `lib/page/renderer.ts` — reused for rendering
- Existing `lib/page/validators.ts` — reused and extended
- Existing `lib/site/navigation.ts` — reused for nav updates
- Existing `lib/site/render-helpers.ts` — reused for site shell
- Existing `lib/ai/openai-client.ts` — replaced by LangChain model wrapper
- `prisma/schema.prisma` — **add `GenerationRun` model + `generationRuns` relation on Project** (see Section 5)

---

## 7. Execution Model and API Contract

### Why Not Synchronous

A 3-6 page agentic build with planning, generation, review, and repair can run 2-5 minutes. This exceeds typical HTTP request timeouts (Vercel: 60s on hobby, 300s on pro; most reverse proxies: 30-120s). A synchronous request/response model would:

- Time out on most hosting providers
- Leave the user staring at a spinner with no progress feedback
- Lose all work if the connection drops

### Architecture: Orchestrator / Executor Separation

The core design principle is that **the orchestration logic is execution-environment independent**. The LangGraph graph, agents, validators, and incremental persistence logic live in a reusable orchestrator module (`lib/agents/orchestrator.ts`) that:

- Takes a `projectId` and `runId` as input
- Reads business context from the DB
- Runs the graph nodes in sequence
- Writes results incrementally to the DB
- Updates the `GenerationRun` record at each step
- Returns nothing — all output is in the DB

The orchestrator does NOT know how it was invoked. It could be called from:

- A Next.js route handler (Phase 1 — local/dev)
- A serverless function with extended timeout (Vercel Pro)
- A queue consumer (future — BullMQ, SQS, Azure Queue)
- A standalone container process (future — ECS, Cloud Run)

**Phase 1 executor: in-process async.** The API route handler creates the `GenerationRun` record, then calls the orchestrator as a detached async function. This is the simplest executor that works for local development and testing. It is **not** treated as durable infrastructure — it is explicitly a convenience executor with known limitations.

```
┌────────────────────────────┐      ┌──────────────────────────┐
│  Executor (Phase 1)        │      │  Orchestrator            │
│  Next.js route handler     │─────▶│  lib/agents/orchestrator │
│  Detached async call       │      │  (env-independent)       │
│  NOT durable               │      │  Reads/writes DB only    │
└────────────────────────────┘      └──────────────────────────┘
        │                                      │
        │  Future executors:                   │  Same orchestrator,
        │  - Queue consumer                    │  different caller
        │  - Container process                 │
        │  - Serverless w/ long timeout        │
```

### Client / Server Flow

```
Client                              Server
  │                                   │
  │  POST /generate-site              │
  │ ──────────────────────────────►   │
  │                                   │  1. Acquire run lock (409 if busy)
  │                                   │  2. Create GenerationRun (status: running)
  │                                   │  3. Invoke orchestrator (detached async)
  │  ◄──────────────────────────────  │
  │  202 Accepted { runId }           │
  │                                   │
  │  GET /generation-status?runId=... │
  │ ──────────────────────────────►   │
  │  ◄──────────────────────────────  │
  │  { status: "running", ... }       │
  │                                   │
  │  ... (poll every 3-5s) ...        │
  │                                   │
  │  GET /generation-status?runId=... │
  │ ──────────────────────────────►   │
  │  ◄──────────────────────────────  │
  │  { status: "complete", ... }      │  ← includes terminal summary
```

### POST /generate-site — Request / Response

**Request:** `POST /api/projects/{id}/generate-site`

No body required (uses project's existing `businessContext`).

**Response (success):** `202 Accepted`

```json
{
  "runId": "uuid-of-generation-run"
}
```

**Response (locked):** `409 Conflict`

```json
{
  "error": "generation already in progress",
  "existingRunId": "uuid-of-running-generation"
}
```

### GET /generation-status — Response Contract

**Request:** `GET /api/projects/{id}/generation-status?runId={runId}`

The `runId` query parameter is required. This endpoint serves both in-progress polling and terminal summary retrieval.

**Response shape (all statuses):**

```ts
interface GenerationStatusResponse {
  runId: string;
  status: "running" | "complete" | "partial_complete" | "failed" | "cancelled";
  currentPhase: string;                    // e.g., "page_generation", "finalizing", "complete"
  progress: {
    pagesPlanned: number;
    pagesCompleted: number;
    pagesFailed: number;
  };
  reviewScore: number | null;              // null until review completes
  startedAt: string;                       // ISO timestamp
  completedAt: string | null;              // set when terminal
  updatedAt: string;                       // last DB write timestamp
  error: string | null;                    // set on failure
  recentLogs: LogEntry[];                  // last N log entries (e.g., last 20)
  summary: GenerationSummary | null;       // set only when status is terminal
}

interface GenerationSummary {
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
  warnings: string[];                      // non-fatal issues for user awareness
}
```

**Example — running:**

```json
{
  "runId": "abc-123",
  "status": "running",
  "currentPhase": "page_generation",
  "progress": { "pagesPlanned": 5, "pagesCompleted": 2, "pagesFailed": 0 },
  "reviewScore": null,
  "startedAt": "2026-03-17T10:30:00Z",
  "completedAt": null,
  "updatedAt": "2026-03-17T10:31:15Z",
  "error": null,
  "recentLogs": [ ... ],
  "summary": null
}
```

**Example — complete:**

```json
{
  "runId": "abc-123",
  "status": "complete",
  "currentPhase": "complete",
  "progress": { "pagesPlanned": 5, "pagesCompleted": 5, "pagesFailed": 0 },
  "reviewScore": 85,
  "startedAt": "2026-03-17T10:30:00Z",
  "completedAt": "2026-03-17T10:33:45Z",
  "updatedAt": "2026-03-17T10:33:45Z",
  "error": null,
  "recentLogs": [ ... ],
  "summary": {
    "pages": [
      { "slug": "home", "title": "Home", "status": "published", "sectionCount": 8 },
      { "slug": "services", "title": "Services", "status": "published", "sectionCount": 6 }
    ],
    "totalDurationMs": 225000,
    "reviewScore": 85,
    "repairsAttempted": 2,
    "repairsSucceeded": 1,
    "warnings": []
  }
}
```

### Phase 1 Limitations (Accepted)

The in-process executor has known limitations that are **intentionally accepted** for Phase 1:

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| Server restart kills running generation | Running step is lost | Incremental persistence preserves completed pages. Stale run detectable via `updatedAt`. User can start new run. |
| No automatic retry of entire run | User must manually trigger retry | Completed pages survive; retry only re-generates what's missing (future enhancement) |
| Requires long process lifetime | Won't work on Vercel hobby (60s limit) | Documented as hosting requirement. Works on VPS, containers, Vercel Pro. |

These limitations are acceptable because:
1. The orchestrator architecture does not depend on the executor — swapping to a queue consumer later requires zero changes to the graph, agents, or persistence logic.
2. Incremental persistence ensures the worst-case data loss from a crash is one step, not the entire run.
3. The `GenerationRun` table with `updatedAt` provides the detection mechanism for stale runs.

### Future Executor Migration Path

When moving beyond Phase 1:

1. Add a queue (BullMQ, SQS, etc.) and a consumer process
2. `POST /generate-site` enqueues a job instead of calling orchestrator directly
3. Consumer calls the same `runSiteBuildOrchestrator(projectId, runId)` function
4. `GET /generation-status` remains unchanged — it reads from the same `GenerationRun` table
5. No changes needed to: orchestrator, graph, agents, prompts, validators, persistence logic

---

## 8. Tool Layer Design

### Deterministic Validator Tools

These run after each agent call. They are NOT LLM-powered — they are pure functions.

| Tool | Purpose | Used After |
|------|---------|------------|
| `validateSitePlan` | Homepage exists, no duplicate slugs, ≤ 8 pages, contact path exists | site_planning |
| `validateSiteSettings` | Brand has required fields, actions have unique IDs, nav matches pages | shared_settings |
| `validatePagePlan` | Sections non-empty, types are valid SectionTypes, no exact duplicate of another page's plan | page_planning |
| `validatePageDocument` | Schema valid (reuse existing `validateDocumentQuality`), actions reference valid IDs from pool | page_generation |
| `validateSiteNavigation` | Nav items match generated pages, homepage marked, no orphaned refs | finalize |

### Fallback Tools

| Tool | Purpose | Triggered When |
|------|---------|----------------|
| `buildFallbackSitePlan` | Minimal sitemap: homepage + contact | Site planner fails 2x |
| `buildFallbackSettings` | DEFAULT_SITE_SETTINGS with business name injected | Settings agent fails 2x |
| `buildFallbackPagePlan` | Default section template per page type (e.g., services page → hero + services + cta-band + contact) | Page planner fails 2x for a page |

### Analysis Tools (used by Review Agent)

| Tool | Purpose |
|------|---------|
| `detectDuplicateCopy` | Compare headings/subheadings across pages for near-duplicates |
| `detectMissingCta` | Check each page has at least one CTA button referencing a valid action |
| `detectMissingContactPath` | Verify at least one page has contact section or contact action |
| `detectEmptySections` | Find sections with placeholder or minimal content |
| `validateActionRefs` | Ensure all buttonRef.actionId values exist in the action pool |

---

## 9. Deterministic Validators vs Agent Responsibilities

### What Agents Own (LLM-powered)

- Deciding which pages to create (Site Planner)
- Choosing brand palette, fonts, tone (Shared Settings)
- Deciding section sequence and content direction per page (Page Planner)
- Writing actual section content — headings, copy, items (Page Generator)
- Evaluating overall quality and coherence (Site Reviewer)
- Rewriting weak content (Repair Agent)

### What Deterministic Code Owns

- Schema validation (required fields, types, structure)
- Action ID uniqueness and reference integrity
- Slug uniqueness within project
- Navigation consistency (nav matches pages)
- Retry counting and ceiling enforcement
- Fallback generation (minimal sitemap, default settings)
- Database persistence
- HTML rendering
- Published page routing and composition

### Principle

Agents produce content. Validators verify structure. The orchestrator controls flow. This separation makes the system debuggable and safe.

---

## 10. Retry / Repair / Fallback Policy

### Retry Ceilings

| Agent | Max Retries | Fallback |
|-------|------------|----------|
| Site Planner | 2 | Minimal sitemap (homepage + contact) |
| Shared Settings | 2 | DEFAULT_SITE_SETTINGS + business name |
| Page Planner | 2 per page | Default section template for page type |
| Page Generator | 2 per page | Mark page as failed, continue |
| Site Reviewer | 1 | Skip review, proceed to finalize |
| Repair Agent | 2 per target | Skip repair for that target |

### Review/Repair Loop

- Review runs once after all pages are generated
- If review finds repairable issues, repair agent runs on each flagged target
- After repair, one more review pass runs (max 2 review passes total)
- If review still finds issues after repair, they are logged and the workflow continues
- The system never enters an unbounded review/repair loop

### Error Handling

- LLM call timeout: 60 seconds per call, then retry
- JSON parse failure: retry with "return valid JSON" reinforcement in prompt
- Validation failure: retry with validation errors included in prompt context
- Network error: retry with exponential backoff (1s, 2s)

---

## 11. Partial Success Behavior

### Rules

1. **One page failure does NOT abort the entire run.** The workflow continues generating remaining pages.
2. **Successful pages are persisted incrementally** — each page is saved to the DB as soon as it is generated, not at the end. If the process crashes, completed pages survive.
3. **Failed pages are saved with `status: "draft"`** and empty/minimal content, so they appear in the editor as needing attention.
4. **The workflow completes as `partial_complete`** if at least one page succeeded but some failed.
5. **The workflow completes as `failed`** only if zero pages were generated (including homepage).
6. **The homepage is always generated first.** If the homepage fails, the workflow still attempts other pages (but marks overall as degraded).

### User Experience

- After `partial_complete`, the user sees:
  - Successfully generated pages in the editor
  - Failed pages listed with a "Generation failed" indicator
  - Option to retry generation for failed pages individually (future feature)
- After `complete`, the user sees a fully generated multi-page site in the editor
- After `failed`, the user sees an error message with retry option

---

## 12. Workflow Logging and Observability

### Log Structure

Every significant event is appended to `state.logs`:

```ts
{
  ts: "2026-03-17T10:30:00Z",
  phase: "page_generation",
  agent: "page-generator",
  action: "generate",
  message: "Generated homepage with 8 sections",
  durationMs: 4500
}
```

### What Gets Logged

- Agent invocation start/end with duration
- Retry attempts with reason
- Validation results (pass/fail with details)
- Fallback activations
- Review issues found
- Repair attempts and outcomes
- Final completion status with page-level summary

### Persistence

- Logs are **appended incrementally** to `GenerationRun.logs` at each step (not buffered until end)
- This ensures logs survive a crash mid-generation
- Stored as JSON array in the `GenerationRun` record

### Observability for Solo Founder

- The API response includes a structured summary:
  - Total pages planned / generated / failed
  - Review score
  - Repair actions taken
  - Duration per phase
  - Any warnings or issues
- The frontend can display this as a generation report

---

## 13. Implementation Phases

### Phase 1: Foundation (LangGraph Setup + Types + Operational Infrastructure)

1. Install `langchain` and `@langchain/langgraph` and `@langchain/openai`
2. Add `GenerationRun` model to `prisma/schema.prisma` (new table, add `generationRuns` relation on Project). Run migration.
3. Create `lib/agents/types.ts` with all type definitions
4. Create `lib/agents/graph/site-build-state.ts` with state annotations
5. Create `lib/agents/tools/validators.ts` with deterministic validators
6. Create `lib/agents/tools/fallbacks.ts` with fallback generators
7. Create LangChain model wrapper (replacing raw OpenAI calls for agents)
8. Create `lib/agents/run-lock.ts` with generation-run locking logic (acquire/release/stale detection)
9. Create `lib/agents/orchestrator.ts` — execution-environment-independent entry point (takes projectId + runId, reads/writes DB only)

### Phase 2: Agent Implementations

1. Site Planner Agent + prompt
2. Shared Settings Agent + prompt
3. Page Planner Agent + prompt
4. Page Generator Agent + prompt
5. Site Review Agent + prompt
6. Repair Agent + prompt

### Phase 3: Graph Nodes (with Incremental Persistence)

1. `site-planning` node (calls Site Planner, validates, retries)
2. `shared-settings` node (calls Settings Agent, validates, retries, **persists settings to DB**)
3. `page-planning` node (loops pages, calls Planner per page)
4. `page-generation` node (loops pages, calls Generator per page, **persists each page to DB on success**)
5. `site-review` node (calls Reviewer + deterministic checks)
6. `repair` node (loops repair queue, calls Repair Agent, **persists patches to DB**)
7. `finalize` node (update nav, flip page statuses, close generation run)

### Phase 4: Graph Assembly + API + Execution

1. Wire all nodes into LangGraph graph with conditional edges
2. Create `app/api/projects/[id]/generate-site/route.ts` (POST: acquire lock, invoke orchestrator via in-process executor, return 202)
3. Create `app/api/projects/[id]/generation-status/route.ts` (GET: poll run status + progress + terminal summary)
4. Integration testing: full flow from business context to saved multi-page site
5. Error path testing: partial failures, retries, fallbacks
6. Concurrency testing: duplicate trigger returns 409, stale lock recovery works
7. Verify orchestrator is callable standalone (not coupled to route handler)

### Phase 5: Polish + Testing

1. Verify published pages render correctly with site shell
2. Verify editor loads generated pages correctly
3. Verify partial_complete surfaces failed pages in editor
4. Performance testing (total generation time)
5. Cost estimation (token usage per full site generation)

---

## 14. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM output not valid JSON | High | Use structured output mode + JSON parse retry with error feedback |
| Generation takes too long (>3 min) | Medium | Per-agent timeout (60s), per-node timeout (120s), total workflow timeout (10 min). Background execution avoids HTTP timeout. |
| Server crash mid-generation | Medium | Incremental persistence saves completed pages immediately. Stale run detectable via `updatedAt`. User can start new run; completed pages are preserved. |
| Duplicate generation requests race | High | Generation-run lock (one active run per project). Second request gets 409 Conflict. |
| Process lifetime too short for generation | Medium | Phase 1 requires long-lived process or ≥ 10 min serverless timeout. Architecture is worker-ready for future queue-based execution. |
| Token cost too high for multi-page | Medium | Use focused prompts, pass summaries not full documents between agents, use GPT-4o-mini for planning/review |
| Page Generator produces low-quality content | Medium | Review + repair loop catches weak content; bounded retries |
| LangGraph/LangChain adds too much complexity | Medium | Keep LangGraph usage minimal — use it as a state machine, not for advanced features |
| Review Agent catches too many false positives | Low | Use severity levels; only repair "critical" and "warning", ignore "suggestion" |
| Repair loop doesn't actually fix issues | Medium | Bounded to 2 attempts; accept imperfect output over infinite loops |
| Existing workflow breaks | High | New system is separate (`generate-site` endpoint); old workflow untouched |
| Homepage generation fails | High | Fallback: generate minimal homepage from business context without LLM |
| LangGraph npm package compatibility | Low | Test in dev before committing; use stable versions |
| Partial success confuses users | Medium | Clear status indicators per page in the editor UI |

---

## 15. Acceptance Criteria

### Must-Pass

1. User provides business context → system generates a multi-page site (3-6 pages)
2. Homepage is always generated first
3. Each page has distinct content (not cloned from homepage)
4. Site settings (brand, actions, nav, header, footer) are shared and consistent
5. Navigation links match generated pages
6. At least one page has a contact path (contact section or contact action)
7. Failed individual pages do not prevent successful pages from being saved
8. Review pass identifies at least: duplicate copy, missing CTA, missing contact path
9. Repair pass can fix at least one category of review issue
10. Retry ceiling is respected (no infinite loops)
11. Generated pages are viewable in the editor
12. Generated pages are viewable at published URLs
13. Total generation time < 5 minutes for a 5-page site
14. Workflow logs capture each agent step with timing
15. POST /generate-site returns 202 immediately; status is polled via GET /generation-status
16. Duplicate generation request while one is running returns 409
17. Pages are persisted to DB incrementally (crash after 4/5 pages preserves those 4)
18. Stale generation run (>15 min) is recoverable — new run can start
19. GenerationRun is a dedicated Prisma model (not WorkflowRun); multiple runs per project are supported
20. Orchestrator is callable standalone — not coupled to route handler or any specific execution environment

### Should-Pass

1. Review score reflects site quality meaningfully (not always 100 or always 0)
2. Repair improves at least one flagged issue
3. Partial complete state is distinguishable from full complete in API response
4. Token usage is reasonable (< $0.50 per 5-page site with GPT-4o-mini)
5. Error messages are actionable (not generic "something went wrong")
6. Generation-status endpoint shows real-time progress (current phase, pages completed)

---

## 16. Repo Alignment — What Changes, What Stays

### Current Repo State

- SQLite database via Prisma ORM
- `WorkflowRun` model: 1:1 with Project, `@unique` on projectId, powers the legacy single-page deterministic workflow
- `PagePlan` model: 1:1 with Project, stores one page plan
- `Page` model: supports multi-page (projectId + slug unique constraint, isHomepage, navOrder)
- `Project.siteSettings`: JSON string storing site-level brand, actions, nav, header, footer
- Next.js 14 API routes
- No LangChain/LangGraph dependencies

### What Gets Added

| Item | Description |
|------|-------------|
| `GenerationRun` Prisma model | New table — many:1 with Project (run history). See Section 5 for schema. |
| `generationRuns` relation on Project | `Project` model gets a new `generationRuns GenerationRun[]` relation |
| `lib/agents/` directory | All agentic system code: graph, agents, prompts, tools, orchestrator, run-lock, types |
| `POST /generate-site` route | Trigger endpoint — acquire lock, invoke orchestrator, return 202 |
| `GET /generation-status` route | Poll endpoint — returns progress and terminal summary |
| LangChain + LangGraph npm deps | `langchain`, `@langchain/langgraph`, `@langchain/openai` |

### What Remains Unchanged

| Item | Reason |
|------|--------|
| `WorkflowRun` model and table | Powers legacy single-page workflow. Not touched. Both systems coexist. |
| `PagePlan` model | Used by legacy workflow. Agentic system stores plans in `SiteBuildState` / incremental DB writes. |
| All existing `lib/ai/` modules | Legacy workflow continues to use them. Agentic system uses new LangChain-based agents. |
| All existing `lib/workflow/` modules | Legacy workflow engine. Untouched. |
| `lib/page/renderer.ts` | Reused by agentic system (rendering is shared). |
| `lib/page/validators.ts` | Reused and extended by agentic system. |
| `lib/site/` modules | Reused for navigation updates and site shell composition. |
| Published page routes (`/p/[slug]`) | Unchanged — agentic pages use the same Page model. |

### Migration Path (Future)

1. **Phase 1 (this plan):** Both systems coexist. Legacy workflow creates single pages. Agentic system creates multi-page sites. No migration of existing projects.
2. **Future:** Once agentic system is stable, new projects default to agentic flow. Legacy workflow remains for existing projects.
3. **Eventually:** Legacy workflow can be deprecated. `WorkflowRun` table becomes read-only historical data.

---

## 17. Out-of-Scope Items

- Editor Assistant Agent (interactive editing after generation)
- Durable external job queue (Redis, BullMQ, SQS) — Phase 1 uses in-process execution; orchestrator is worker-ready for future migration
- Durable LangGraph checkpoint persistence (auto-resume from exact interrupted graph node)
- Image generation for new pages (reuses existing asset pipeline)
- Custom domain setup
- A/B testing of generated variants
- Multi-user collaboration
- Competitor analysis integration (reuses existing if available)
- UI for triggering site generation (can be wired later — API-first)
- Server-Sent Events or WebSocket progress streaming (uses polling via GET /generation-status for now)
- Migration of existing single-page `WorkflowRun` workflows to agentic system (both coexist)
- Rate limiting or cost controls (manual monitoring for now)
- Auto-retry of entire crashed runs (user manually triggers new run; completed pages from prior run are preserved)
