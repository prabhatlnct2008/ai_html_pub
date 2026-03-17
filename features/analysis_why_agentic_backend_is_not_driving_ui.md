# Analysis: Why the Agentic Backend Is Not Driving the UI

## 1. Executive Summary

The agentic multi-page generation backend is fully implemented but **completely disconnected from the product UI**. No frontend component anywhere in the codebase invokes `POST /api/projects/[id]/generate-site` or polls `GET /api/projects/[id]/generation-status`. The builder page (`app/projects/[id]/builder/page.tsx`) exclusively calls the legacy workflow engine endpoints (`/workflow`, `/kickoff`, `/answer`, `/approve-plan`), which route through `lib/workflow/engine.ts` → `lib/workflow/runner.ts` — the old single-page deterministic pipeline. The new `lib/agents/orchestrator.ts` and its LangGraph-based graph are orphaned code with working API routes that nothing calls.

## 2. Actual Current User Flow

```
/projects/new (create project form)
  → POST /api/projects (creates Project with _kickoff object)
  → redirect to /projects/{id}/builder

/projects/{id}/builder (BuilderPage)
  → GET /api/projects/{id}/workflow (old WorkflowRun status)
  → POST /api/projects/{id}/kickoff (AI inference on business context)
  → POST /api/projects/{id}/answer (answer kickoff questions)
  → [when ready] transitionWorkflowPastIntake() → runWorkflow()

runWorkflow() (lib/workflow/engine.ts)
  → intake_complete
  → [competitor_analysis] (optional)
  → strategy_generation (single page strategy)
  → theme_generation
  → asset_planning
  → image_prompt_generation
  → image_generation
  → plan_generation_running (creates single PagePlan)
  → plan_review ← STOPS, waits for user

BuilderPage shows plan
  → POST /api/projects/{id}/approve-plan
  → runWorkflow() resumes
  → generation_running (generates ONE page's sections)
  → document_assembly
  → rendering
  → saving
  → complete

BuilderPage detects redirectTo in workflow status
  → navigates to /projects/{id}/editor (single page editor)
```

**Every step in this flow uses `WorkflowRun` (the legacy model) and `lib/workflow/runner.ts` (the legacy executor).** The new `GenerationRun` model is never created. The new orchestrator is never called.

## 3. Why The Product Still Feels Deterministic

It is not just "feeling" deterministic — it **is** running the deterministic pipeline. Specifically:

### 3a. The old workflow is still the only wired execution path

The builder page (`app/projects/[id]/builder/page.tsx`) contains:
- Polling loop that calls `GET /api/projects/{id}/workflow` (returns `WorkflowRun` state)
- Kickoff trigger that calls `POST /api/projects/{id}/kickoff`
- Plan approval that calls `POST /api/projects/{id}/approve-plan`
- All of these invoke `runWorkflow()` from `lib/workflow/engine.ts`

None of these call `POST /api/projects/{id}/generate-site`.

### 3b. The new agentic backend is never triggered

`POST /api/projects/{id}/generate-site` exists as a route file, but:
- No `fetch("/api/projects/.../generate-site")` exists in any frontend file
- No component imports or references `generate-site` or `generation-status`
- The route is callable via curl/Postman but is invisible to the product

### 3c. The editor only displays existing single-page data

`app/projects/[id]/editor/page.tsx` loads the page via legacy routes (`GET /api/projects/{id}/page` or `/pages`). It displays whatever `Page` rows exist. Since the old workflow only creates one page, the editor only shows one page.

### 3d. The builder/chat flow assumes single-page generation

The workflow states in `lib/workflow/types.ts` define a linear pipeline that produces exactly one `PagePlan`, generates sections for one page, assembles one document, renders one HTML output. The `plan_review` state shows one plan. `approve-plan` resumes generation for one page.

### 3e. Summary: all four factors are true simultaneously

The old workflow is wired in. The new backend is not triggered. The editor shows only what exists. The builder assumes single-page. The result is a product that behaves identically to how it did before the agentic backend was built.

## 4. Is The New Agentic Backend Actually Present?

### Already implemented (backend, not wired to UI):

| Component | File(s) | Status |
|-----------|---------|--------|
| GenerationRun Prisma model | `prisma/schema.prisma` | ✅ Migrated |
| Run locking (acquire/release) | `lib/agents/run-lock.ts` | ✅ Complete |
| LangGraph state annotations | `lib/agents/graph/site-build-state.ts` | ✅ Complete |
| Graph definition (7 nodes) | `lib/agents/graph/site-build-graph.ts` | ✅ Complete |
| Node: site_planning | `lib/agents/graph/nodes/site-planning.ts` | ✅ Complete |
| Node: shared_settings | `lib/agents/graph/nodes/shared-settings.ts` | ✅ Complete |
| Node: page_planning | `lib/agents/graph/nodes/page-planning.ts` | ✅ Complete |
| Node: page_generation | `lib/agents/graph/nodes/page-generation.ts` | ✅ Complete |
| Node: site_review | `lib/agents/graph/nodes/site-review.ts` | ✅ Complete |
| Node: repair | `lib/agents/graph/nodes/repair.ts` | ✅ Complete |
| Node: finalize | `lib/agents/graph/nodes/finalize.ts` | ✅ Complete |
| 6 agents (planner, settings, page planner, generator, reviewer, repair) | `lib/agents/agents/` | ✅ Complete |
| 6 prompt templates | `lib/agents/prompts/` | ✅ Complete |
| Validators + fallbacks | `lib/agents/tools/` | ✅ Complete |
| LangChain model wrapper | `lib/agents/model.ts` | ✅ Complete |
| Orchestrator (env-independent) | `lib/agents/orchestrator.ts` | ✅ Complete |
| POST /generate-site route | `app/api/projects/[id]/generate-site/route.ts` | ✅ Complete |
| GET /generation-status route | `app/api/projects/[id]/generation-status/route.ts` | ✅ Complete |

### Not wired to UI:

| Missing piece | Why it matters |
|---------------|----------------|
| No frontend calls `POST /generate-site` | The agentic pipeline never starts |
| No frontend polls `GET /generation-status` | Progress is invisible |
| No builder state for "agentic generation in progress" | Builder only knows legacy workflow states |
| No multi-page progress UI | No page-by-page progress, no phase indicators |
| No redirect from agentic completion to editor | User has no way to reach the result |
| No "Generate Site" button or trigger | The entry point does not exist in the UI |

### Verdict: The issue is **integration absence**, not architectural absence.

The backend is complete. The API routes exist. The problem is that nothing in the frontend calls them.

## 5. Exact Missing Integration Layer

The gap exists at five specific boundaries:

### 5a. Trigger boundary (builder → agentic generation)

**What exists:** Builder calls `POST /approve-plan` → `runWorkflow()` (old pipeline)
**What's missing:** A point in the builder flow where `POST /generate-site` is called instead of (or in addition to) the old workflow.

Options:
- Replace the `approve-plan` → `runWorkflow()` path with `POST /generate-site`
- Add a "Generate Full Site" button in the builder that calls `POST /generate-site`
- Auto-trigger agentic generation after kickoff completes (replacing the old workflow entirely)

### 5b. Polling boundary (builder → generation status)

**What exists:** Builder polls `GET /workflow` every 1.5s for `WorkflowRun` state
**What's missing:** A parallel or replacement polling loop that hits `GET /generation-status?runId=...`

The builder needs to:
1. Receive `runId` from the `POST /generate-site` response
2. Poll `GET /generation-status?runId={runId}` on interval
3. Display phase, progress (pages planned/completed/failed), recent logs
4. Detect terminal status (complete/partial_complete/failed)

### 5c. Progress display boundary (generation status → UI)

**What exists:** Builder shows workflow steps as a linear progress bar with step names
**What's missing:** A multi-page progress view showing:
- Current phase (planning → settings → page planning → generating → reviewing → repairing → finalizing)
- Per-page status (pending → generating → generated/failed)
- Page count (3/5 pages generated)
- Review score (when available)
- Recent log entries

### 5d. Completion/redirect boundary (terminal status → editor)

**What exists:** Builder checks `workflow.redirectTo` from `buildStatus()` and navigates to editor
**What's missing:** Equivalent logic that reads the terminal `generation-status` response and:
1. Detects `status === "complete"` or `status === "partial_complete"`
2. Navigates to `/projects/{id}/editor`
3. Handles `status === "failed"` with error display and retry option

### 5e. Editor multi-page boundary (editor → page list)

**What exists:** Editor loads a single page. It does have page list support via `GET /pages` but the agentic system's output (multiple pages) is only fully useful if the editor displays the page list rail and lets users switch between pages.

**What's partially present:** The editor does have multi-page support from the earlier multi-page site architecture work (`GET /pages`, page switching), but it was designed for manually-added pages, not bulk-generated pages.

## 6. What Needs To Happen Next

### Step 1: Decide on the trigger point

The most important decision: where in the builder flow does agentic generation replace the old workflow?

**Recommended approach:** After kickoff completes (all questions answered), instead of calling `transitionWorkflowPastIntake()` → `runWorkflow()`, call `POST /generate-site` and switch to agentic polling.

This means modifying:
- `app/api/projects/[id]/kickoff/route.ts` — when kickoff completes, do NOT start old workflow
- `app/api/projects/[id]/answer/route.ts` — when last question answered, do NOT start old workflow
- Builder page — detect that agentic generation should be used (e.g., a flag, or always for new projects)

### Step 2: Add agentic generation trigger in the builder

In `app/projects/[id]/builder/page.tsx`:
- After kickoff/intake completes, call `POST /api/projects/{id}/generate-site`
- Store the returned `runId` in component state

### Step 3: Replace/augment polling loop

In the builder page:
- When `runId` is present, poll `GET /api/projects/{id}/generation-status?runId={runId}` instead of `GET /workflow`
- Parse the response into UI state: phase, page counts, logs

### Step 4: Build agentic progress UI

Replace the linear progress bar with a multi-phase progress display:
- Show current phase name (human-readable: "Planning site...", "Generating pages...", "Reviewing quality...")
- Show page progress: "3 of 5 pages generated"
- Show recent log entries as status messages
- Handle partial_complete with appropriate messaging

### Step 5: Handle completion redirect

When polling detects terminal status:
- `complete` → redirect to editor with success message
- `partial_complete` → redirect to editor with warning about failed pages
- `failed` → show error with retry button (calls `POST /generate-site` again with `triggeredBy: "retry"`)

### Step 6: Skip the plan review step

The old flow had an explicit `plan_review` state where users approve a plan. The agentic system does its own planning internally. Decision needed:
- **Option A:** Skip plan review entirely — agentic system plans and generates without user approval (faster, more "agentic")
- **Option B:** Add a review checkpoint after `site_planning` node — show the site plan, let user approve, then continue (more controlled)

For Phase 1, Option A is simpler and matches the agentic philosophy.

### Step 7: Gate old vs new flow

Add a mechanism to decide which flow a project uses:
- **Simplest:** All new projects use agentic flow. Legacy projects with existing `WorkflowRun` continue using old flow.
- **Flag-based:** Add a project-level flag or check for presence of `GenerationRun` records.
- **Feature flag:** Environment variable `USE_AGENTIC_GENERATION=true`.

### Step 8: Verify editor handles multi-page output

Confirm the editor's page list and page switching works correctly when multiple pages exist from agentic generation. This should mostly work already from the earlier multi-page architecture work, but needs verification.

## 7. Recommendation

**Cleanest next implementation target: wire the builder to the agentic backend in a single focused patch.**

Specifically:

1. **Modify kickoff/answer completion** to NOT start the old workflow, and instead return a signal that the client should trigger agentic generation.
2. **Add agentic trigger + polling to the builder page** — call `POST /generate-site`, poll `GET /generation-status`, display progress, handle terminal states.
3. **Skip plan review** for the agentic flow (the system plans internally).
4. **Redirect to editor on completion** with the same pattern the old flow uses.

This is approximately 150-300 lines of changes across 3-4 files (builder page, kickoff route, answer route, and possibly a small progress component). The backend is ready. The editor multi-page support mostly exists. The only gap is the builder-to-backend wiring.

**Do not** try to make the old flow and new flow coexist in the same builder page with complex branching. Instead, gate at the project level: new projects use the agentic flow, old projects keep the legacy flow. This keeps the builder page logic clean.
