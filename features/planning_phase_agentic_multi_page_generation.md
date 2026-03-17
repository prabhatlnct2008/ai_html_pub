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
- New API route to trigger agentic site generation

**Out of scope:**

- Editor Assistant Agent (post-generation editing help — later phase)
- Background/autonomous agents
- Code/runtime agents
- Open-ended sandbox execution
- Worker-based background queue (uses synchronous execution for now)
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
START
  → site_planning
  → shared_settings
  → page_planning          (loops over all pages)
  → page_generation        (loops over all pages, homepage first)
  → site_review
  → repair                 (conditional: only if review found repairable issues)
  → persist_results        (deterministic: save to DB)
  → END (complete | partial_complete | failed)
```

### Detailed Flow

```
┌─────────────────────────────────────────────────────┐
│  START                                              │
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
│  persist_results (deterministic)                 │
│  - Save SiteSettings to Project                  │
│  - Save each PageDocument to Page records        │
│  - Render HTML for each page                     │
│  - Update navigation                             │
│  - Set page statuses (published/draft/failed)    │
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
| repair pass completes | Re-review once, then persist |
| repair still fails | Skip, persist with partial results |
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
                "persisting" | "complete" | "partial_complete" | "failed";
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

### Persistence Strategy

The LangGraph state is **in-memory during execution**. On completion (or partial completion):

1. `SiteSettingsDraft` → `Project.siteSettings` (JSON)
2. Each `PageDocument` → `Page.documentJson` (one Page record per page)
3. Rendered HTML → `Page.renderedHtml` (via existing renderer)
4. Navigation → updated via `updateSiteNavigation()`
5. Page statuses → `Page.status` ("published" for complete, "draft" for failed)
6. Workflow logs → stored in a new `workflowLog` field on WorkflowRun or a dedicated table

For this first implementation, we do NOT persist intermediate LangGraph state. The run is atomic — if the server crashes mid-run, the user retries. Durable state persistence is a future enhancement.

---

## 6. Module/File Structure

```
lib/agents/                          # New directory for agentic system
  graph/
    site-build-graph.ts              # LangGraph graph definition
    site-build-state.ts              # State type + annotations
    nodes/
      site-planning.ts               # site_planning node
      shared-settings.ts             # shared_settings node
      page-planning.ts               # page_planning node (loop)
      page-generation.ts             # page_generation node (loop)
      site-review.ts                 # site_review node
      repair.ts                      # repair node
      persist-results.ts             # persist_results node (deterministic)
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

  types.ts                           # All agentic type definitions

app/api/projects/[id]/generate-site/
  route.ts                           # POST endpoint to trigger agentic generation
```

### Integration Points

- `app/api/projects/[id]/generate-site/route.ts` — new API endpoint
- Existing `lib/page/renderer.ts` — reused for rendering
- Existing `lib/page/validators.ts` — reused and extended
- Existing `lib/site/navigation.ts` — reused for nav updates
- Existing `lib/site/render-helpers.ts` — reused for site shell
- Existing `lib/ai/openai-client.ts` — replaced by LangChain model wrapper
- Existing `prisma/schema.prisma` — no changes needed (models already support multi-page)

---

## 7. Tool Layer Design

### Deterministic Validator Tools

These run after each agent call. They are NOT LLM-powered — they are pure functions.

| Tool | Purpose | Used After |
|------|---------|------------|
| `validateSitePlan` | Homepage exists, no duplicate slugs, ≤ 8 pages, contact path exists | site_planning |
| `validateSiteSettings` | Brand has required fields, actions have unique IDs, nav matches pages | shared_settings |
| `validatePagePlan` | Sections non-empty, types are valid SectionTypes, no exact duplicate of another page's plan | page_planning |
| `validatePageDocument` | Schema valid (reuse existing `validateDocumentQuality`), actions reference valid IDs from pool | page_generation |
| `validateSiteNavigation` | Nav items match generated pages, homepage marked, no orphaned refs | persist_results |

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

## 8. Deterministic Validators vs Agent Responsibilities

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

## 9. Retry / Repair / Fallback Policy

### Retry Ceilings

| Agent | Max Retries | Fallback |
|-------|------------|----------|
| Site Planner | 2 | Minimal sitemap (homepage + contact) |
| Shared Settings | 2 | DEFAULT_SITE_SETTINGS + business name |
| Page Planner | 2 per page | Default section template for page type |
| Page Generator | 2 per page | Mark page as failed, continue |
| Site Reviewer | 1 | Skip review, proceed to persist |
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

## 10. Partial Success Behavior

### Rules

1. **One page failure does NOT abort the entire run.** The workflow continues generating remaining pages.
2. **Successful pages are persisted immediately** in the persist_results node, regardless of other pages' status.
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

## 11. Workflow Logging and Observability

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

- Logs are collected in `state.logs` during execution
- On completion, logs are serialized and stored:
  - In `WorkflowRun.progressLog` (existing JSON field)
  - Or in a new `agentLogs` field if the existing field is too overloaded

### Observability for Solo Founder

- The API response includes a structured summary:
  - Total pages planned / generated / failed
  - Review score
  - Repair actions taken
  - Duration per phase
  - Any warnings or issues
- The frontend can display this as a generation report

---

## 12. Implementation Phases

### Phase 1: Foundation (LangGraph Setup + Types)

1. Install `langchain` and `@langchain/langgraph` and `@langchain/openai`
2. Create `lib/agents/types.ts` with all type definitions
3. Create `lib/agents/graph/site-build-state.ts` with state annotations
4. Create `lib/agents/tools/validators.ts` with deterministic validators
5. Create `lib/agents/tools/fallbacks.ts` with fallback generators
6. Create LangChain model wrapper (replacing raw OpenAI calls for agents)

### Phase 2: Agent Implementations

1. Site Planner Agent + prompt
2. Shared Settings Agent + prompt
3. Page Planner Agent + prompt
4. Page Generator Agent + prompt
5. Site Review Agent + prompt
6. Repair Agent + prompt

### Phase 3: Graph Nodes

1. `site-planning` node (calls Site Planner, validates, retries)
2. `shared-settings` node (calls Settings Agent, validates, retries)
3. `page-planning` node (loops pages, calls Planner per page)
4. `page-generation` node (loops pages, calls Generator per page)
5. `site-review` node (calls Reviewer + deterministic checks)
6. `repair` node (loops repair queue, calls Repair Agent)
7. `persist-results` node (saves to DB, renders HTML)

### Phase 4: Graph Assembly + API

1. Wire all nodes into LangGraph graph with conditional edges
2. Create `app/api/projects/[id]/generate-site/route.ts`
3. Integration testing: full flow from business context to saved multi-page site
4. Error path testing: partial failures, retries, fallbacks

### Phase 5: Polish + Testing

1. Verify published pages render correctly with site shell
2. Verify editor loads generated pages correctly
3. Verify partial_complete surfaces failed pages in editor
4. Performance testing (total generation time)
5. Cost estimation (token usage per full site generation)

---

## 13. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM output not valid JSON | High | Use structured output mode + JSON parse retry with error feedback |
| Generation takes too long (>3 min) | Medium | Per-agent timeout (60s), per-node timeout (120s), total workflow timeout (10 min) |
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

## 14. Acceptance Criteria

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

### Should-Pass

1. Review score reflects site quality meaningfully (not always 100 or always 0)
2. Repair improves at least one flagged issue
3. Partial complete state is distinguishable from full complete in API response
4. Token usage is reasonable (< $0.50 per 5-page site with GPT-4o-mini)
5. Error messages are actionable (not generic "something went wrong")

---

## 15. Out-of-Scope Items

- Editor Assistant Agent (interactive editing after generation)
- Background/worker-based execution
- Durable LangGraph state persistence (checkpoint/resume across server restarts)
- Image generation for new pages (reuses existing asset pipeline)
- Custom domain setup
- A/B testing of generated variants
- Multi-user collaboration
- Competitor analysis integration (reuses existing if available)
- UI for triggering site generation (can be wired later — API-first)
- Streaming progress to frontend (initial version returns final result)
- Migration of existing single-page workflows to agentic system
- Rate limiting or cost controls (manual monitoring for now)
