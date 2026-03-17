# Planning: Builder-to-Agentic Generation Integration

## 1. Purpose and Scope

### Purpose

Wire the existing product UI (builder page, chat flow, editor) to the already-implemented agentic multi-page generation backend so that new projects use the LangGraph-based orchestrator instead of the legacy single-page workflow engine.

### Scope

**In scope:**

- Modifying the builder page to trigger `POST /generate-site` instead of the legacy workflow for new projects
- Adding polling of `GET /generation-status?runId=...` with a progress UI
- Handling completion, partial completion, and failure states
- Redirecting to the editor on success
- Gating new projects toward the agentic flow while preserving legacy flow for old projects
- Keeping the kickoff/questioning intake phase (it collects good business context)
- Removing the plan-review gate from the agentic flow (the system plans internally)

**Out of scope:**

- Modifying the agentic backend itself (already built and reviewed)
- Modifying the editor's multi-page support (already present)
- Building new intake/questioning flows
- Worker-based execution infrastructure
- Streaming progress (polling is sufficient for now)

---

## 2. Current-State Summary

The agentic multi-page generation backend is fully implemented:

| Component | Status |
|-----------|--------|
| `lib/agents/orchestrator.ts` | Complete |
| LangGraph state + graph (7 nodes) | Complete |
| 6 agents + prompts | Complete |
| Validators + fallbacks | Complete |
| `GenerationRun` Prisma model | Complete |
| Run locking | Complete |
| `POST /api/projects/[id]/generate-site` | Complete |
| `GET /api/projects/[id]/generation-status` | Complete |

**The problem:** No frontend code calls these endpoints. The builder page exclusively calls the legacy workflow endpoints. The two systems are completely disconnected.

---

## 3. Exact Current Legacy Flow Still in Use

```
User creates project → /projects/new
  ↓
POST /api/projects (creates Project with _kickoff in businessContext)
  ↓
Redirect to /projects/{id}/builder
  ↓
BuilderPage mounts → triggerKickoff()
  ↓
POST /api/projects/{id}/kickoff
  → AI infers businessType, targetAudience, tone, mainOffer, etc.
  → If questions needed: status="questioning"
  → If no questions: status="complete" → transitionWorkflowPastIntake() → runWorkflow()
  ↓
POST /api/projects/{id}/answer (per question)
  → Updates businessContext
  → When all answered: transitionWorkflowPastIntake() → runWorkflow()
  ↓
runWorkflow() (lib/workflow/engine.ts)
  → intake_complete → competitor_analysis → strategy → theme → assets →
    image_prompts → images → plan_generation → plan_review [STOPS]
  ↓
Builder polls GET /api/projects/{id}/workflow every 1500ms
  → Shows progress bar with steps
  → Detects plan_review → shows PlanApproval component
  ↓
POST /api/projects/{id}/approve-plan
  → Transitions to generation_running → runWorkflow() resumes
  → generation → document_assembly → rendering → saving → complete
  ↓
Builder detects workflow.redirectTo → navigates to /projects/{id}/editor
  ↓
Editor loads single page via GET /api/projects/{id}/page
```

**Key observations:**
- The kickoff/questioning phase is valuable and should be retained
- The plan_review gate is specific to the legacy flow — the agentic system plans internally
- runWorkflow() is called from answer/kickoff completion AND from approve-plan
- The builder has clear "auto-executing" vs "user-input" state awareness

---

## 4. Target New Flow

```
User creates project → /projects/new
  ↓
POST /api/projects (creates Project with _kickoff in businessContext)
  ↓
Redirect to /projects/{id}/builder
  ↓
BuilderPage mounts → triggerKickoff() [SAME AS TODAY]
  ↓
POST /api/projects/{id}/kickoff [SAME AS TODAY]
  → AI infers context, generates questions
  ↓
POST /api/projects/{id}/answer (per question) [SAME AS TODAY]
  → Updates businessContext
  → When all answered:
    OLD: transitionWorkflowPastIntake() → runWorkflow()
    NEW: transitionWorkflowPastIntake() [still, for state tracking]
         → return { agenticReady: true } signal to client
  ↓
BuilderPage detects agenticReady → calls POST /api/projects/{id}/generate-site
  → Returns { runId: "..." } with 202
  ↓
BuilderPage stores runId → starts polling GET /generation-status?runId=...
  → Shows multi-phase progress UI:
    "Planning site..." → "Generating pages (2/5)..." → "Reviewing..." → "Finalizing..."
  ↓
[NO plan_review gate — agentic system plans internally]
  ↓
Polling detects terminal status:
  → "complete": redirect to /projects/{id}/editor
  → "partial_complete": redirect to editor with warning banner
  → "failed": show error + retry button
  ↓
Editor loads pages via GET /api/projects/{id}/pages [existing multi-page support]
  → Shows page list rail, allows switching between generated pages
```

---

## 5. Where the Trigger Should Happen

**Decision:** The trigger point is **after kickoff/questioning completes** — the exact moment where `transitionWorkflowPastIntake()` is called today.

**Why this point:**
- All business context has been collected (businessName, type, audience, tone, offer, etc.)
- The agentic orchestrator needs this context to plan the site
- This is the natural handoff from "user provides input" to "system generates output"

**What changes at this point:**

| Current | New |
|---------|-----|
| `transitionWorkflowPastIntake()` creates/updates WorkflowRun | Still called (for backward compat tracking) |
| `runWorkflow(projectId)` starts legacy pipeline | **Skipped for agentic projects** |
| Builder polls `/workflow` | Builder calls `POST /generate-site` then polls `/generation-status` |

---

## 6. How Kickoff/Answer/Builder/Workflow Interaction Should Change

### Kickoff endpoint (`app/api/projects/[id]/kickoff/route.ts`)

**Change:** When kickoff completes (no questions or all questions answered), instead of calling `runWorkflow()`, return a signal indicating the client should trigger agentic generation.

```
Current behavior (when kickoff.status becomes "complete"):
  → transitionWorkflowPastIntake()
  → runWorkflow(projectId)
  → return { status: "complete", workflow: buildStatus() }

New behavior (when kickoff.status becomes "complete" AND project is agentic):
  → transitionWorkflowPastIntake()  // still create WorkflowRun for tracking
  → DO NOT call runWorkflow()
  → return { status: "complete", agenticReady: true }
```

### Answer endpoint (`app/api/projects/[id]/answer/route.ts`)

**Same change:** When the last answer completes and project is agentic:

```
Current (all questions answered):
  → kickoff.status = "complete"
  → transitionWorkflowPastIntake()
  → runWorkflow(projectId)
  → return { status: "complete", workflow }

New (all questions answered AND project is agentic):
  → kickoff.status = "complete"
  → transitionWorkflowPastIntake()
  → DO NOT call runWorkflow()
  → return { status: "complete", agenticReady: true }
```

### Builder page (`app/projects/[id]/builder/page.tsx`)

**Changes:**

1. **Detect agentic mode:** Check response from kickoff/answer for `agenticReady: true`
2. **Trigger agentic generation:** Call `POST /generate-site`, store `runId` in state
3. **Switch polling target:** When `runId` is set, poll `/generation-status?runId=...` instead of `/workflow`
4. **New progress UI:** Replace linear workflow steps with phase-based progress for agentic generation
5. **Remove plan review for agentic flow:** No `PlanApproval` component needed — the system plans internally
6. **Handle terminal states:** Map generation-status terminal states to navigation/UI actions

---

## 7. How `POST /generate-site` Should Be Triggered

The builder page triggers generation **immediately** when it detects `agenticReady: true` from the kickoff/answer response:

```typescript
// In builder page, after kickoff/answer completion
async function handleAgenticGeneration() {
  const res = await fetch(`/api/projects/${projectId}/generate-site`, {
    method: "POST",
  });
  const data = await res.json();

  if (res.status === 202) {
    setRunId(data.runId);
    setGenerationPhase("running");
    startAgenticPolling(data.runId);
  } else if (res.status === 409) {
    // Existing run in progress — resume polling
    setRunId(data.existingRunId);
    startAgenticPolling(data.existingRunId);
  } else {
    // Error — show message and retry option
    setGenerationPhase("failed");
    setError(data.error);
  }
}
```

**On builder page mount:** If the project already has a `GenerationRun` in progress, the builder must recover the `runId` and resume polling. See section 7a for the recovery mechanism.

### 7a. How the builder recovers `runId` after a page reload

The `GET /generation-status` endpoint requires `runId` — there is no "latest run" fallback. After a page reload, the builder has lost its in-memory `runId`. Three options were considered:

**Option A (chosen): New lightweight lookup endpoint**

Add `GET /api/projects/[id]/active-generation` that returns the most recent `running` GenerationRun for the project, or 404 if none exists:

```typescript
// app/api/projects/[id]/active-generation/route.ts
export async function GET(request, { params }) {
  const { id } = await params;
  const run = await prisma.generationRun.findFirst({
    where: { projectId: id, status: "running" },
    orderBy: { startedAt: "desc" },
    select: { id: true, currentPhase: true, startedAt: true },
  });
  if (!run) return errorResponse("No active generation", 404);
  return jsonResponse({ runId: run.id, currentPhase: run.currentPhase });
}
```

The builder calls this on mount. If a running generation exists, it stores the `runId` and resumes polling `/generation-status?runId=...`. If 404, no active generation — proceed with normal kickoff flow.

**Why not Option B (localStorage):** `runId` in localStorage is fragile — stale across sessions, wrong if user opens a different project, not cleared on completion in another tab.

**Why not Option C (project field):** Adding `activeRunId` to the Project model creates a migration and couples the project to generation state that already lives in GenerationRun.

**Builder mount flow with recovery:**

```typescript
// On builder page mount:
async function detectFlowMode() {
  // 1. Check for active agentic generation (handles reload case)
  const activeGenRes = await fetch(`/api/projects/${projectId}/active-generation`);
  if (activeGenRes.ok) {
    const { runId, currentPhase } = await activeGenRes.json();
    setRunId(runId);
    setFlowMode("agentic");
    startAgenticPolling(runId);
    return;
  }

  // 2. Check legacy workflow state
  const workflowRes = await fetch(`/api/projects/${projectId}/workflow`);
  const workflowData = await workflowRes.json();
  if (workflowData.workflow?.state &&
      workflowData.workflow.state !== "intake" &&
      workflowData.workflow.state !== "kickoff_inferring") {
    setFlowMode("legacy");
    return;
  }

  // 3. New or early-stage project → agentic flow (will go through kickoff first)
  setFlowMode("agentic");
}
```

**Files affected by this decision:**
- New: `app/api/projects/[id]/active-generation/route.ts` (~20 lines)
- Changed: `builder/page.tsx` (mount detection logic)

---

## 8. How `GET /generation-status?runId=...` Should Be Polled

### Polling interval

Use **2000ms** (slightly longer than the legacy 1500ms, since agentic generation takes longer and phases change less frequently).

### Polling logic

```typescript
async function pollAgenticStatus(runId: string) {
  const res = await fetch(
    `/api/projects/${projectId}/generation-status?runId=${runId}`
  );
  const data: GenerationStatusResponse = await res.json();

  // Update UI state
  setCurrentPhase(data.currentPhase);
  setProgress({
    pagesPlanned: data.progress.pagesPlanned,
    pagesCompleted: data.progress.pagesCompleted,
    pagesFailed: data.progress.pagesFailed,
  });
  setRecentLogs(data.recentLogs);
  if (data.reviewScore !== null) setReviewScore(data.reviewScore);

  // Handle terminal states
  if (data.status === "complete" || data.status === "partial_complete") {
    stopPolling();
    handleGenerationComplete(data);
  } else if (data.status === "failed") {
    stopPolling();
    handleGenerationFailed(data);
  }
  // "running" → continue polling
}
```

### Error handling during polling

- Network errors: Continue polling (transient), log warning
- 404 (run not found): Stop polling, show error
- 500: Continue polling up to 3 consecutive failures, then stop

---

## 9. How Progress Should Appear in Builder/Chat UI

### Phase-based progress display

Replace the legacy linear progress bar with a phase-aware progress component for the agentic flow:

```
┌──────────────────────────────────────────────┐
│  Building Your Website                        │
│                                               │
│  ✓ Planning site structure                    │
│  ✓ Setting up brand & navigation              │
│  ✓ Planning pages                             │
│  ● Generating pages (3 of 5)                  │
│    ○ Reviewing quality                        │
│    ○ Finalizing                               │
│                                               │
│  ┌─────────────────────────────┐              │
│  │ ████████████████░░░░░░░░░░░ │  60%         │
│  └─────────────────────────────┘              │
│                                               │
│  Latest: Generated "Services" page            │
└──────────────────────────────────────────────┘
```

### Phase-to-display mapping

| `currentPhase` | Display Text | Icon |
|----------------|-------------|------|
| `planning` | "Planning site structure..." | 📋 |
| `settings` | "Setting up brand & navigation..." | 🎨 |
| `page_planning` | "Planning pages..." | 📝 |
| `page_generation` | "Generating pages (X of Y)..." | ⚡ |
| `reviewing` | "Reviewing quality..." | 🔍 |
| `repairing` | "Fixing issues..." | 🔧 |
| `finalizing` | "Finalizing..." | ✅ |
| `complete` | "Your website is ready!" | 🎉 |
| `failed` | "Generation failed" | ❌ |
| `partial_complete` | "Website partially generated" | ⚠️ |

### Progress percentage calculation

```typescript
function calculateProgress(data: GenerationStatusResponse): number {
  const phaseWeights: Record<string, number> = {
    planning: 10,
    settings: 20,
    page_planning: 30,
    page_generation: 40, // + per-page increment
    reviewing: 75,
    repairing: 85,
    finalizing: 95,
    complete: 100,
    partial_complete: 100,
    failed: 100,
  };

  if (data.currentPhase === "page_generation" && data.progress.pagesPlanned > 0) {
    const pageProgress = data.progress.pagesCompleted / data.progress.pagesPlanned;
    return 30 + pageProgress * 40; // 30% to 70% during page generation
  }

  return phaseWeights[data.currentPhase] ?? 0;
}
```

### Chat messages during generation

Inject system messages into the chat panel as phases complete:

- "I'm planning your website structure..."
- "Setting up your brand and navigation..."
- "Generating 5 pages for your business..."
- "Generated 'Home' page ✓"
- "Generated 'About' page ✓"
- "Reviewing quality across all pages..."
- "Your website is ready! Redirecting to editor..."

These can be derived from `recentLogs` in the generation-status response.

---

## 10. How Completion / Partial Completion / Failure Should Be Handled

### `status === "complete"`

1. Show success message in chat: "Your website is ready! X pages generated."
2. Show completion state in progress component
3. After 1500ms delay (same as legacy), redirect to `/projects/{id}/editor`
4. Editor loads all pages via `GET /api/projects/{id}/pages`

### `status === "partial_complete"`

1. Show warning message in chat: "Your website is partially ready. X of Y pages generated successfully. Z pages could not be generated."
2. Show partial completion state with warning styling
3. After 2000ms delay, redirect to `/projects/{id}/editor`
4. Editor loads all pages — failed pages exist in DB with `status="failed"`, `showInNav: false`
5. Editor should show a banner: "Some pages could not be generated. You can try regenerating them."

### `status === "failed"`

1. Show error message in chat: "Generation failed: [error message]"
2. Show error state in progress component with:
   - Error description from `data.error`
   - **Retry button** that calls `POST /generate-site` again
   - Option to go back to chat/intake to modify business context
3. Do NOT redirect to editor

---

## 11. How Redirect to Editor Should Work

### Same pattern as legacy

The legacy flow sets `workflow.redirectTo` which the builder detects and navigates to. For the agentic flow:

```typescript
// In builder page, when generation completes
function handleGenerationComplete(data: GenerationStatusResponse) {
  const summary = data.summary;
  const totalPages = (summary?.pagesGenerated ?? 0) + (summary?.pagesFailed ?? 0);
  const successPages = summary?.pagesGenerated ?? 0;

  if (data.status === "complete") {
    addChatMessage("assistant", `Your ${successPages}-page website is ready!`);
    setTimeout(() => {
      router.push(`/projects/${projectId}/editor`);
    }, 1500);
  } else if (data.status === "partial_complete") {
    addChatMessage("assistant",
      `${successPages} of ${totalPages} pages generated. Some pages had issues.`
    );
    setTimeout(() => {
      router.push(`/projects/${projectId}/editor`);
    }, 2000);
  }
}
```

### Editor entry point

The editor's existing `loadSite()` + `loadPage()` flow handles multi-page loading correctly:
1. `GET /api/projects/{id}/site` returns site settings + page list
2. Editor finds homepage and loads it
3. Page list rail shows all generated pages

No changes needed in the editor itself.

---

## 12. How Legacy Workflow Should Be Gated from New Projects

### Gating strategy: project-level flag

**Decision:** Use the presence of a `GenerationRun` record (or absence of a completed `WorkflowRun` past intake) to determine which flow to use.

**Simpler alternative (recommended):** Add an environment variable `AGENTIC_GENERATION_ENABLED=true` (default `true`) and always use the agentic flow for new projects unless disabled.

### Where gating applies

| Location | Current | New (agentic enabled) |
|----------|---------|----------------------|
| `kickoff/route.ts` (on complete) | Calls `runWorkflow()` | Returns `agenticReady: true`, skips `runWorkflow()` |
| `answer/route.ts` (all answered) | Calls `runWorkflow()` | Returns `agenticReady: true`, skips `runWorkflow()` |
| Builder page (on `agenticReady`) | N/A | Calls `POST /generate-site` |
| Builder page (polling) | Polls `/workflow` | Polls `/generation-status` |
| `approve-plan/route.ts` | Calls `runWorkflow()` | Not reached in agentic flow |

### Implementation

```typescript
// lib/config.ts or similar
export function isAgenticGenerationEnabled(): boolean {
  return process.env.AGENTIC_GENERATION_ENABLED !== "false";
}
```

```typescript
// In kickoff/route.ts and answer/route.ts, where runWorkflow() is called:
if (isAgenticGenerationEnabled()) {
  // Don't run legacy workflow — let client trigger agentic generation
  return NextResponse.json({
    status: "complete",
    agenticReady: true,
    summary: ...,
  });
} else {
  await runWorkflow(projectId);
  return NextResponse.json({
    status: "complete",
    workflow: buildStatus(project),
  });
}
```

---

## 13. How to Keep Old Projects Safe

### Rule: old projects with existing `WorkflowRun` records past intake continue using the legacy flow

**Detection logic on builder mount** (see section 7a for the full `detectFlowMode()` implementation):

1. **First:** Check `GET /api/projects/{id}/active-generation` — if 200, an agentic run is active. Resume polling with returned `runId`.
2. **Second:** Check `GET /api/projects/{id}/workflow` — if WorkflowRun state is past intake (e.g., `plan_review`, `generation_running`, `complete`), this is a legacy project. Use `flowMode = "legacy"`.
3. **Third:** If neither condition matches, this is a new or early-stage project. Use `flowMode = "agentic"` and proceed through kickoff.

### Decision: agentic projects stop showing WorkflowRun state after intake completes

For agentic projects, the WorkflowRun is created by `transitionWorkflowPastIntake()` and stays at `intake_complete` permanently. The builder never polls `/workflow` for agentic projects after that point — all progress comes from `/generation-status`. The WorkflowRun row exists purely so that `flowMode` detection can distinguish "legacy project already in workflow" from "new project at intake stage."

The builder does NOT show any legacy workflow steps, progress bar, or plan review for agentic projects. The `AgenticProgress` component fully replaces `WorkflowProgress` when `flowMode === "agentic"`.

### Rule: the builder page supports both flows in the same component

The builder page should have a `flowMode` state: `"legacy" | "agentic" | "detecting"`.

- `"detecting"`: Initial mount, checking which flow to use
- `"legacy"`: Use existing workflow polling, plan review, approve-plan flow
- `"agentic"`: Use kickoff → generate-site → generation-status polling flow

This avoids breaking existing projects while enabling the new flow for new ones.

---

## 14. Files/Modules to Change

### Must change

| File | Change |
|------|--------|
| `app/projects/[id]/builder/page.tsx` | Add `flowMode` state, agentic trigger, generation-status polling, phase progress UI, terminal state handling |
| `app/api/projects/[id]/kickoff/route.ts` | Conditionally skip `runWorkflow()`, return `agenticReady: true` |
| `app/api/projects/[id]/answer/route.ts` | Conditionally skip `runWorkflow()`, return `agenticReady: true` |

### New files

| File | Purpose |
|------|---------|
| `app/projects/[id]/builder/AgenticProgress.tsx` | Progress component for agentic generation (phases, page count, logs) |
| `app/api/projects/[id]/active-generation/route.ts` | Lightweight endpoint to recover `runId` for active generation (used on builder page reload) |
| `lib/config.ts` (or add to existing) | `isAgenticGenerationEnabled()` helper |

### May need minor changes

| File | Why |
|------|-----|
| `app/projects/[id]/editor/page.tsx` | May need a banner for partial_complete projects |

### No longer needed

| File | Why |
|------|-----|
| `app/api/projects/[id]/workflow/route.ts` | NOT modified — agentic projects do not show WorkflowRun state after intake. The builder's `flowMode` detection reads WorkflowRun to classify legacy projects, but does not need new fields. |

### No changes needed

| File | Why |
|------|-----|
| `lib/agents/*` | Backend already complete |
| `app/api/projects/[id]/generate-site/route.ts` | Already complete |
| `app/api/projects/[id]/generation-status/route.ts` | Already complete |
| `lib/workflow/engine.ts` | Legacy flow preserved as-is |
| `prisma/schema.prisma` | GenerationRun model already exists |

---

## 15. Implementation Phases

### Phase 1: Server-side gating (smallest change, enables everything)

**Files:** `kickoff/route.ts`, `answer/route.ts`, `lib/config.ts`

1. Add `isAgenticGenerationEnabled()` config helper
2. In kickoff route: when kickoff completes and agentic is enabled, skip `runWorkflow()`, return `{ status: "complete", agenticReady: true }`
3. In answer route: same change when last answer completes
4. Set `AGENTIC_GENERATION_ENABLED=true` in `.env`

**Test:** Verify kickoff/answer no longer starts the legacy workflow for new projects. Verify setting the flag to `false` preserves legacy behavior.

### Phase 2: Builder page agentic trigger + basic polling

**Files:** `builder/page.tsx`, `app/api/projects/[id]/active-generation/route.ts`

1. Create `GET /active-generation` endpoint (returns runId of active GenerationRun or 404)
2. Add `flowMode` state with `detectFlowMode()` on mount (see section 7a)
3. When `agenticReady: true` received, call `POST /generate-site`
4. Store `runId`, start polling `/generation-status?runId=...` at 2000ms
5. Display raw status in a simple text element (temporary UI)
6. Handle terminal states: redirect on complete, show error on failed
7. Handle page reload: `detectFlowMode()` checks `/active-generation` first, resumes polling if active

**Test:** Verify new project goes through kickoff → generate-site → polling → redirect to editor. Verify page reload during generation resumes polling.

### Phase 3: Agentic progress component

**Files:** `builder/AgenticProgress.tsx`, `builder/page.tsx`

1. Build `AgenticProgress` component with phase steps, page counter, progress bar
2. Integrate into builder's right panel (replaces `WorkflowProgress` for agentic mode)
3. Add chat messages derived from `recentLogs`
4. Handle partial_complete with warning banner

**Test:** Verify progress UI updates correctly through all phases.

### Phase 4: Polish and edge cases

**Files:** Various

1. Handle builder page reload during active generation (detect existing run, resume polling)
2. Handle network errors during polling (retry logic, consecutive failure threshold)
3. Handle 409 from generate-site (existing run — resume polling with `existingRunId`)
4. Add retry button for failed generation
5. Confirm editor shows all generated pages correctly
6. Add partial_complete banner in editor if applicable

**Test:** Full flow regression including edge cases.

---

## 16. Risks / Edge Cases

| Risk | Impact | Mitigation |
|------|--------|------------|
| Builder page reloads during agentic generation | User loses polling state, sees blank builder | On mount, check for active `GenerationRun` via workflow endpoint or dedicated check; resume polling |
| Network error during `POST /generate-site` | Generation never starts, user stuck | Show error with retry button; detect and handle 409 (already running) |
| Agentic generation takes very long (>5 min) | User thinks it's stuck | Show incremental progress via logs and page count; add "still working..." messages |
| Race condition: user closes tab, reopens, triggers second generation | Duplicate run attempt | Run lock in `generate-site` prevents this — returns 409 with existing runId |
| Legacy projects accidentally routed to agentic flow | Broken experience | `flowMode` detection on builder mount checks WorkflowRun state; projects past intake stay in legacy |
| `partial_complete` state confuses users | User doesn't understand failed pages | Clear messaging: "X pages generated, Y could not be created. You can edit what was generated." |
| Editor doesn't show multiple pages properly | User only sees one page | Editor already has multi-page support via `loadSite()` + page list; verify it works with agentic output |
| Both WorkflowRun and GenerationRun exist for same project | State confusion | WorkflowRun stays at `intake_complete`; GenerationRun tracks agentic progress. They don't conflict because they track different things. |
| `transitionWorkflowPastIntake()` fails | Neither flow starts | Wrap in try/catch; if it fails, still return `agenticReady: true` — the WorkflowRun is just for state tracking, not critical path |

---

## 17. Acceptance Criteria

### Must-pass

1. A new project completes kickoff → questions → triggers `POST /generate-site` (not `runWorkflow`)
2. `runId` is returned and stored in builder state
3. Builder polls `GET /generation-status?runId=...` and displays progress
4. Progress UI shows current phase, page count, and percentage
5. On `complete`: builder redirects to editor within 2 seconds
6. Editor loads and displays all generated pages in the page list
7. On `partial_complete`: builder redirects to editor with a warning message
8. On `failed`: builder shows error message and retry button
9. Retry button calls `POST /generate-site` again and resumes polling
10. Existing legacy projects (with WorkflowRun past intake) still use the old workflow flow
11. The old workflow is NOT triggered for agentic projects
12. Setting `AGENTIC_GENERATION_ENABLED=false` restores legacy behavior for all projects
13. Reloading the builder page during active generation resumes polling (doesn't restart)
14. The kickoff/questioning flow is unchanged — users still answer intake questions

### Should-pass

1. Chat panel shows phase transition messages during generation
2. Progress component shows recent log entries
3. Multiple generated pages appear in editor page list with correct titles and types
4. Failed pages (from partial_complete) are visible in editor with `status="failed"` indicator
5. Navigation items in the editor reflect only successfully generated pages

---

## 18. Sequencing Relative to Variation Work

This integration work should be done **first**, before the dynamic landing-page variation improvements (Track 2).

**Reason:** Until the builder is wired to the agentic backend, no one can see or test the output of the agentic system through the product UI. The variation work modifies how the agentic backend generates pages — but those improvements are invisible without this integration.

**Exception:** One variation change can be done in parallel with Phase 1-2 of this track:
- Replacing `getDefaultVariant()` with `selectVariant()` is a backend-only change in `lib/ai/section-generator.ts` and `lib/page/section-library.ts`. It does not depend on any UI integration and will immediately improve output quality once the agentic flow is wired up.

**Recommended parallel work:**
- Track 1, Phases 1-2 (server gating + builder trigger) + Track 2, Phase 1 (dynamic variant selection) can proceed simultaneously since they touch completely different files.
