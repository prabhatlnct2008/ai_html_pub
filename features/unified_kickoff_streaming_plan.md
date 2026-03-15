# Unified AI Kickoff & Streaming Builder — Implementation Plan

Primary specs:
- `features/unified_ai_kickoff_and_streaming_builder_spec.md`
- `features/ai_behavior_and_prompt_contract.md`

Supporting context (existing V2 architecture):
- `features/v2_full_fledged_landing_page_builder_spec.md`
- `features/v2_full_fledged_landing_page_builder_plan.md`

---

## Current State

**`/projects/new`** — 6-field form (name, description, competitor URL, audience, primary CTA, secondary CTA). On submit, creates project and redirects to builder.

**`/projects/[id]/builder`** — Two-panel layout (55% chat, 45% progress). User chats in intake state, then workflow auto-executes through strategy → theme → assets → images → plan → generation. Polls every 1.5s. Plan review is approve/revise. Redirects to editor on complete.

**Intake AI** — `processIntakeMessage()` extracts businessName, businessType, targetAudience, primaryCta from freeform chat. Checks 4 required fields. Marks ready when all 4 present.

**Prompts** — Each module has its own system prompt in `lib/ai/prompts/`. No shared role definition or behavioral contract layer.

**Streaming** — None. All AI calls are request/response. Builder polls for status.

---

## What Changes

### Summary of changes, mapped to spec requirements:

| Spec Requirement | Current State | Change |
|---|---|---|
| Minimal entry (2 required fields) | 6-field form, 4 required fields in intake | Reduce `/projects/new` to name + description + optional URL |
| AI starts immediately | User must chat first | Builder auto-triggers inference on load |
| Progressive questioning with skip | Chat-based Q&A, no skip | Structured question cards with chips + skip |
| Streaming progress | 1.5s polling | SSE endpoint for real-time progress events |
| Streaming text | None | Stream assistant text for summary/questions |
| Shared AI behavior contract | Per-module prompts | Shared behavior layer composed into all prompts |
| Inference-first | Asks for 4 required fields | Infer audience/CTA/type from description, ask only if low confidence |
| Builder as kickoff workspace | Builder waits for intake completion | Builder handles inference → questioning → plan → generation |

---

## Architecture Decisions

These decisions address production safety, persistence, idempotency, and AI client design. They apply across all phases.

### A1: Streaming Architecture — DB-Backed Polling With Optional SSE Overlay

The app runs on Vercel (serverless). In-memory state does not survive across requests, instances, or cold starts. Therefore:

**Primary transport: Enhanced polling (always works)**

The existing 1.5s polling against `GET /api/projects/[id]/workflow` remains the source of truth. Workflow progress, questions, and streamed text summaries are persisted to the database as they are produced. The polling endpoint reads from DB and returns the latest state. This is production-safe, works across restarts, tabs, and serverless invocations.

**Secondary transport: SSE overlay (progressive enhancement, local/dev first)**

SSE via `GET /api/projects/[id]/stream` provides faster updates when a persistent connection is available. The SSE endpoint reads the same DB state but can also receive in-process events for the duration of a single request execution (e.g., during a long-running kickoff or generation call that happens to be on the same instance).

**Implementation rule:** Every event that SSE would emit must ALSO be persisted to DB before or at the same time. The client must never depend on catching a transient SSE event — it can always recover full state from the polling endpoint. SSE is a latency optimization, not the persistence layer.

**Event persistence model:** Add a `progressLog` JSON column to `WorkflowRun` that stores an append-only array of `{ ts, type, data }` entries. The SSE endpoint serves entries newer than the client's last-seen timestamp. The polling endpoint returns the latest entry as `currentProgress`. This avoids the in-memory Map entirely.

```
WorkflowRun.progressLog: Array<{
  ts: number,          // Date.now()
  type: "progress" | "text" | "question" | "plan_ready" | "complete" | "error",
  data: Record<string, unknown>
}>
```

**SSE scope:** Phase 4 implements SSE as local/dev enhancement. Production SSE hardening (extracting to an edge-compatible transport if needed) is a separate future scope item. The DB-backed polling path is the production-safe default from day one.

### A2: Kickoff/Questioning State Persistence Model

The plan introduces structured questions, skip behavior, AI suggestions, confidence scores, and kickoff summaries. These must survive page refresh, re-entry, and multi-tab access.

**Where it lives:** All kickoff/questioning state is persisted in `Project.businessContext` (existing JSON column). The schema expands from flat key-value business fields to include a `_kickoff` metadata namespace:

```ts
// Inside Project.businessContext JSON:
{
  // Existing business fields (unchanged)
  businessName: "Pawsitive Training",
  businessType: "service-business",
  targetAudience: "dog owners in metro areas",
  primaryCta: "book a session",
  // ... other fields

  // New: kickoff metadata namespace
  _kickoff: {
    status: "pending" | "inferring" | "questioning" | "complete",
    inferredAt: string | null,           // ISO timestamp, null if not yet run
    summary: string | null,              // AI-generated business understanding summary
    confidence: Record<string, "high" | "medium" | "low">,
    questions: Array<{
      field: string,
      question: string,
      options: string[],
      aiSuggestion?: string,
      required: boolean,
      answered: boolean,
      skipped: boolean,
      answer?: string,
    }>,
    currentQuestionIndex: number,
  }
}
```

**Read behavior:** When the builder loads, it reads `businessContext._kickoff.status` to determine what to show:
- `pending` → trigger kickoff
- `inferring` → show progress (kickoff in flight or interrupted — see A3 for recovery)
- `questioning` → show question at `currentQuestionIndex`
- `complete` → normal workflow behavior

**Write behavior:** The kickoff endpoint and answer endpoint both write to `_kickoff` atomically via Prisma `update`. Each answer/skip updates the specific question entry and advances `currentQuestionIndex`.

This approach requires no new tables. The `_kickoff` namespace is ignored by all existing code that reads `businessContext` for business fields.

### A3: Kickoff Idempotency and Race Control

The kickoff endpoint can be called multiple times (page refresh, multiple tabs, retry after partial failure). It must be safe to call repeatedly.

**Rule: Kickoff is idempotent based on `_kickoff.status`.**

The kickoff endpoint checks `_kickoff.status` before doing anything:

| Current `_kickoff.status` | Kickoff endpoint behavior |
|---|---|
| `undefined` or `pending` | Run inference. Set status to `inferring` atomically FIRST (optimistic lock). Proceed. |
| `inferring` | Check `inferredAt`. If null and `updatedAt` is >60s ago, assume interrupted — reset to `pending` and re-run. Otherwise return current state (another request is in flight). |
| `questioning` | Do not re-run inference. Return current questions. |
| `complete` | Do not re-run. Return current state. |

**Atomicity:** The status transition from `pending` → `inferring` uses a Prisma conditional update:

```ts
const result = await prisma.project.updateMany({
  where: {
    id: projectId,
    // Only transition if still in expected state
    businessContext: { path: ["_kickoff", "status"], equals: "pending" }
  },
  data: { ... }
});
if (result.count === 0) {
  // Another request already started — return current state
}
```

Since Prisma's JSON path filtering varies by provider, the practical implementation uses a simpler pattern: read current state, check status, write with full businessContext replacement. The `updatedAt` column on Project provides a coarse-grained staleness check. For SQLite (current dev DB), this is sufficient since there's only one server process.

**Multi-tab safety:** If two tabs both call kickoff simultaneously, only the first one transitions from `pending` → `inferring`. The second sees `inferring` and returns the current state without re-running. The builder polls or uses SSE to pick up results from the first request.

**WorkflowRun state guard:** The kickoff endpoint also checks that `WorkflowRun.state` is still `intake` or `kickoff_inferring`. If the workflow has already advanced past intake (e.g., user completed intake via chat in another tab), kickoff is a no-op.

### A4: AI Client Split — Structured JSON vs Streamed Text

The current AI client (`lib/ai/openai-client.ts`) has one function: `chatCompletion()`. It always returns a complete JSON string using `response_format: { type: "json_object" }`. This is correct for machine-readable stages and must not change.

The new streaming requirement adds a second calling pattern. These two patterns must coexist cleanly.

**Two distinct AI call modes:**

| Mode | Function | Used by | Response format | Streaming |
|---|---|---|---|---|
| Structured JSON | `chatCompletion()` (existing) | Strategy, theme, asset planning, image prompts, section generation, plan generation, intake extraction | `response_format: { type: "json_object" }` | No |
| Streamed text | `streamChatText()` (new) | Kickoff summary, plan explanation, question context | No response_format constraint (plain text) | Yes, token-by-token |

**New file:** `lib/ai/openai-client.ts` (extended, not replaced)

```ts
// Existing — unchanged
export async function chatCompletion(...): Promise<string>

// New — streaming text for user-visible copy
export async function streamChatText(
  systemPrompt: string,
  userPrompt: string,
  onChunk: (text: string) => void,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string>
```

`streamChatText()` uses the same OpenAI client but calls `openai.chat.completions.create({ stream: true, ... })` WITHOUT `response_format: { type: "json_object" }`. It iterates the async stream, calls `onChunk()` for each token, and returns the full accumulated text.

**`lib/ai/stream.ts` becomes a workflow-aware wrapper:**

```ts
export async function streamAITextToWorkflow(
  projectId: string,
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string>
```

This calls `streamChatText()` with an `onChunk` that:
1. Appends each chunk to `WorkflowRun.progressLog` (batched, not per-token — flush every ~200ms or ~50 chars)
2. If an SSE listener is connected on the same instance, also pushes to it for lower latency

**What is NOT streamed:**
- Strategy generation → structured JSON → `chatCompletion()`
- Theme generation → structured JSON → `chatCompletion()`
- Section generation → structured JSON → `chatCompletion()`
- Plan generation → structured JSON → `chatCompletion()`
- Asset/image planning → structured JSON → `chatCompletion()`
- Kickoff inference → structured JSON → `chatCompletion()` (the inferred fields are JSON; only the summary text is streamed separately)

**What IS streamed (3 moments only):**
- Kickoff summary text (~2-3 sentences) → `streamAITextToWorkflow()`
- Plan explanation text (~1-2 sentences) → `streamAITextToWorkflow()`
- Question context text (~1 sentence) → `streamAITextToWorkflow()`

**Progress messages during autonomous workflow steps are NOT AI-generated.** They are static template strings from `PROGRESS_MESSAGES` (e.g., "Choosing page layout and CTA strategy"). These are written to `progressLog` directly by the runner, not by an AI call.

---

## Phase 1: Simplify `/projects/new` + Auto-Kickoff

**Goal:** Reduce entry friction. Get user into builder in <10 seconds.

### Step 1.1: Reduce `/projects/new` to minimal kickoff

**File:** `app/projects/new/page.tsx`

Current form has 6 fields. New form has 3:
- Business name (required)
- What does your business offer? (required, textarea)
- Website or reference URL (optional)

Remove: target audience, primary CTA, secondary CTA fields from the form.

The button text changes from "Create Project" to "Start with AI".

The POST to `/api/projects` stays the same but sends fewer fields.

### Step 1.2: Auto-trigger AI inference on builder load

**File:** `app/projects/[id]/builder/page.tsx`

Currently the builder waits in `intake` state for the user to type a message.

New behavior: When the builder loads and the workflow is in `intake` state with `businessContext` already populated (from `/projects/new`), auto-trigger the first AI inference immediately without waiting for user input.

Add a new API endpoint:

**New file:** `app/api/projects/[id]/kickoff/route.ts`

This endpoint:
1. Reads the project's existing businessContext (name + description + optional URL)
2. Runs initial AI inference to extract/infer: businessType, targetAudience, primaryCta, tone, pageType
3. Stores inferred fields in businessContext
4. Determines what follow-up questions (if any) are needed based on confidence
5. If high confidence on all fields → transitions to `intake_complete` and runs workflow
6. If questions needed → transitions to a new `questioning` state with structured questions
7. Emits progress events throughout

**Key rule:** The AI must attempt to infer everything from the business description before asking. Only ask if confidence is genuinely low on a field that materially affects output.

### Step 1.3: Update project creation API

**File:** `app/api/projects/route.ts`

Accept the reduced field set. Store `businessDescription` (the "what do you offer" field) alongside name and competitorUrl. Remove requirement for targetAudience and primaryCta at creation time — those get inferred.

---

## Phase 2: Shared AI Behavior Contract Layer

**Goal:** One canonical AI role and behavior ruleset composed into all prompts.

### Step 2.1: Create shared behavior module

**New file:** `lib/ai/prompts/behavior.ts`

This file exports:

```ts
export const AI_ROLE: string          // canonical role text (from spec)
export const QUESTIONING_RULES: string // 7 rules from the contract
export const INFERENCE_RULES: string   // confidence-based inference rules
export const OUTPUT_RULES: string      // output quality requirements
export const STREAMING_VOICE: string   // how streamed text should sound
```

The `AI_ROLE` is the paragraph from the spec:
> "You are an expert landing page strategist and builder. Your job is to help the user create a strong, publishable landing page with the least necessary effort from them..."

### Step 2.2: Compose shared behavior into existing prompts

**Modified files:**
- `lib/ai/prompts/intake.ts` — prepend AI_ROLE + QUESTIONING_RULES + INFERENCE_RULES
- `lib/ai/prompts/planner.ts` — prepend AI_ROLE + OUTPUT_RULES
- `lib/ai/prompts/generator.ts` — prepend AI_ROLE + OUTPUT_RULES
- `lib/ai/prompts/competitor.ts` — prepend AI_ROLE (lighter touch)
- `lib/ai/prompts/section-update.ts` — prepend AI_ROLE + OUTPUT_RULES

Each prompt file's `buildSystemPrompt()` composes the shared layer with its module-specific instructions. The existing module-specific logic stays — we're adding a shared foundation, not replacing module prompts.

### Step 2.3: Create kickoff inference prompt

**New file:** `lib/ai/prompts/kickoff.ts`

This prompt is used by the kickoff endpoint (Step 1.2). It receives the business name + description + optional URL and returns:

```ts
{
  inferred: {
    businessType: string,
    targetAudience: string,
    primaryCta: { type: string, label: string },
    tone: string,
    pageType: string,
    mainOffer: string,
  },
  confidence: Record<string, "high" | "medium" | "low">,
  questions: Array<{
    field: string,
    question: string,
    options: string[],       // quick-reply chips
    aiSuggestion?: string,   // pre-selected best guess
    required: boolean,       // false = can skip without penalty
  }> | null,  // null = no questions needed, proceed
  summary: string,  // 2-3 sentence business understanding summary
}
```

The prompt composes AI_ROLE + QUESTIONING_RULES + INFERENCE_RULES and instructs the AI to:
- Infer all fields from the description
- Only generate questions for low-confidence high-impact fields
- Generate at most 2-3 questions total
- Each question must have quick-reply options + "Skip for now"

---

## Phase 3: Progressive Questioning UI

**Goal:** Replace freeform chat intake with structured question cards that support skip.

### Step 3.1: Add builder questioning state

**File:** `lib/workflow/types.ts`

Add new workflow states:
- `kickoff_inferring` — AI is processing initial context (auto-execute)
- `questioning` — AI has questions for user (user-input state)

Add `questioning` to `USER_INPUT_STATES`.

**File:** `lib/workflow/transitions.ts`

Add transitions:
- `kickoff_inferring` → `questioning` (if questions needed) or `intake_complete` (if confident)
- `questioning` → `intake_complete` (after user answers or skips all)

### Step 3.2: Question card UI component

**New file:** `components/builder/QuestionCard.tsx`

A structured question card that renders:
- Question text (streamed or static)
- Quick-reply chip buttons (2-4 options)
- "Use AI suggestion" chip (highlighted, if suggestion exists)
- Freeform text input for custom answer
- "Skip for now" button
- Progress indicator (question 1 of N)

This replaces the freeform chat input during the questioning phase.

### Step 3.3: Update builder page for new states

**File:** `app/projects/[id]/builder/page.tsx`

The builder needs to handle the new UX states:

**kickoff (initial load):**
- Show "Starting AI..." with animated progress
- Auto-call `/api/projects/[id]/kickoff`
- Display streamed inference progress: "Understanding your business...", "Inferring audience...", etc.

**questioning:**
- Show AI's business understanding summary (streamed text)
- Show question cards one at a time
- Each answer or skip immediately updates context and may advance to next question or to plan generation
- "Skip all remaining" button

**plan-ready (existing `plan_review`):**
- Show concise structured plan summary (not wall of text)
- Approve / one-line correction / regenerate

**generating (existing auto-execute states):**
- Show structured progress messages
- "Generating hero copy...", "Building services section...", etc.
- Disable input

**complete:**
- Show "Open Editor" button

### Step 3.4: Question answer API

**New file:** `app/api/projects/[id]/answer/route.ts`

POST endpoint that:
1. Accepts `{ field, value }` or `{ field, skipped: true }`
2. Updates businessContext with the answer (or marks field as skipped)
3. Checks if more questions remain
4. If no more questions → transitions to `intake_complete` → runs workflow
5. If more questions → returns next question
6. Returns updated workflow status

---

## Phase 4: Streaming Infrastructure

**Goal:** Add real-time progress visibility. DB-backed polling is the production-safe primary transport; SSE is a progressive enhancement overlay. See Architecture Decision A1 for the full rationale.

### Step 4.1: Add `progressLog` column to WorkflowRun

**File:** `prisma/schema.prisma`

Add `progressLog String @default("[]")` to the `WorkflowRun` model. This is an append-only JSON array of `{ ts, type, data }` entries that stores all progress events, streamed text chunks, and question events.

Run `npx prisma db push` to apply (no migration needed for SQLite dev).

### Step 4.2: Progress log writer utility

**New file:** `lib/workflow/progress.ts`

Provides functions for writing progress entries to the DB:

```ts
export async function appendProgress(
  projectId: string,
  type: "progress" | "text" | "question" | "plan_ready" | "complete" | "error",
  data: Record<string, unknown>
): Promise<void>

export async function getProgressSince(
  projectId: string,
  sinceTs: number
): Promise<ProgressEntry[]>
```

`appendProgress()` reads current `progressLog`, appends the new entry, writes back. For streamed text, chunks are batched (~200ms or ~50 chars) before flushing to DB to avoid excessive writes.

### Step 4.3: Add progress emission to workflow runner

**File:** `lib/workflow/runner.ts`

Before each `executeState()` call, write a human-readable progress message to `progressLog`:

```ts
const PROGRESS_MESSAGES: Record<string, string> = {
  strategy_generation: "Choosing page layout and CTA strategy",
  theme_generation: "Designing colors and typography",
  asset_planning: "Planning visual elements",
  image_prompt_generation: "Creating image descriptions",
  image_generation: "Generating hero and section images",
  plan_generation_running: "Building your page plan",
  generation_running: "Writing section content",
  document_assembly: "Assembling your page",
  rendering: "Rendering final page",
  saving: "Saving your page",
};
```

These are static template strings, NOT AI-generated. They are written to `progressLog` directly.

**File:** `lib/workflow/engine.ts`

In the `runWorkflow` loop, call `appendProgress("progress", ...)` at each state transition.

### Step 4.4: Update polling endpoint to return progress

**File:** `app/api/projects/[id]/workflow/route.ts`

Extend the existing GET response to include:
- `latestProgress`: the most recent `progressLog` entry
- `progressLog`: full log (or entries since a `?since=` query param timestamp)

The builder client sends `?since={lastSeenTs}` to get only new entries. This gives near-real-time progress without SSE, just by polling faster (500ms during active generation, 1.5s during idle).

### Step 4.5: SSE endpoint (progressive enhancement)

**New file:** `app/api/projects/[id]/stream/route.ts`

GET endpoint returning Server-Sent Events. Scoped as local/dev enhancement in this phase.

Implementation: Polls `progressLog` from DB every 500ms and sends new entries as SSE events. This is not in-memory fan-out — it reads the same persisted state as the polling endpoint, just with lower latency and push semantics.

Event types remain as originally specified:
```
event: progress
event: text
event: question
event: plan_ready
event: complete
event: error
```

If Vercel's serverless runtime kills the connection, the client falls back to polling automatically. No state is lost because everything is in `progressLog`.

### Step 4.6: Update builder to consume progress

**File:** `app/projects/[id]/builder/page.tsx`

Primary: Enhanced polling. The builder polls `GET /api/projects/[id]/workflow?since={ts}` and applies new `progressLog` entries to the UI:
- `progress` → update progress tracker label and percentage
- `text` → append to conversation area (token-by-token reconstruction)
- `question` → show question card
- `plan_ready` → show plan card
- `complete` → show editor redirect
- `error` → show error with retry

Secondary: Attempt SSE connection to `/api/projects/[id]/stream`. If connected, reduce polling interval to 5s (heartbeat only). If SSE disconnects, resume 500ms polling. The SSE path applies the same entry types — it's just a faster delivery mechanism for the same persisted data.

---

## Phase 5: Stream AI Text for Key Moments

**Goal:** Stream user-visible assistant text at 3 specific moments. See Architecture Decision A4 for the full AI client split rationale.

### Step 5.1: Add `streamChatText()` to OpenAI client

**File:** `lib/ai/openai-client.ts`

Add alongside existing `chatCompletion()` (which remains unchanged):

```ts
export async function streamChatText(
  systemPrompt: string,
  userPrompt: string,
  onChunk: (text: string) => void,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string>
```

Uses `openai.chat.completions.create({ stream: true, ... })` WITHOUT `response_format: { type: "json_object" }`. Iterates the async stream, calls `onChunk()` per token, returns accumulated text.

**Existing `chatCompletion()` is NOT modified.** All structured JSON calls continue using it.

### Step 5.2: Create workflow-aware streaming wrapper

**New file:** `lib/ai/stream.ts`

```ts
export async function streamAITextToWorkflow(
  projectId: string,
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string>
```

Calls `streamChatText()` with an `onChunk` that batches text chunks (~200ms or ~50 chars) and flushes them to `WorkflowRun.progressLog` via `appendProgress("text", { content, done: false })`. On completion, writes a final `{ content: fullText, done: true }` entry.

### Step 5.3: Stream the business understanding summary

After kickoff inference (which uses `chatCompletion()` for the structured JSON), make a second `streamAITextToWorkflow()` call with a short prompt that produces a 2-3 sentence summary:

> "You're building a page for Pawsitive Training, a dog training service targeting pet owners in metro areas. I'll optimize for booking consultations."

The summary is also persisted to `businessContext._kickoff.summary`.

### Step 5.4: Stream plan explanation

When the plan is ready, stream a brief explanation before showing the structured plan card:

> "I've designed a 10-section page focused on lead generation. Here's the plan:"

### Step 5.5: Stream follow-up question context

When asking a question, stream a short rationale:

> "I'm confident about most details, but I want to make sure about one thing:"

Then the structured question card appears (from `progressLog` question event, not streamed).

---

## Phase 6: Builder UX Polish

**Goal:** Make the builder feel like a modern AI workspace, not a form + chat.

### Step 6.1: Redesign builder layout

**File:** `app/projects/[id]/builder/page.tsx`

The current 55/45 split with chat on left and progress on right needs to evolve:

New layout:
- **Main area:** Conversation + question cards + plan review (takes full width when no progress to show)
- **Right sidebar or overlay:** Compact progress tracker (collapsible)
- **Top:** "Currently doing" dynamic label

The conversation area should not look like a generic chat window. It should feel like a guided AI workspace with:
- Streamed assistant messages (not chat bubbles)
- Structured question cards (not text prompts)
- Concise plan summary cards (not walls of text)
- Progress indicator integrated into the flow

### Step 6.2: Progress indicator redesign

**New file:** `components/builder/ProgressTracker.tsx`

Replace the current step-list progress with a more compact, dynamic indicator:
- Shows current step label prominently: "Generating hero copy..."
- Shows overall progress bar (percentage)
- Optionally expandable to show all steps
- Uses streamed progress events for real-time updates

### Step 6.3: Plan approval card redesign

**New file:** `components/builder/PlanCard.tsx`

Replace the current plan approval UI with a more concise card:
- Business understanding summary (2-3 lines)
- Section list (compact, with variant indicators)
- CTA strategy (one line)
- Theme direction (color swatches + font names)
- Three actions: "Looks good" / text input for correction / "Start over"

### Step 6.4: Disable input during autonomous work

**File:** `app/projects/[id]/builder/page.tsx`

When the workflow is auto-executing (generating, assembling, rendering):
- Hide the chat input entirely (not just disable)
- Show the progress tracker prominently
- Show a "working..." indicator where the input would be

Re-enable input only when the AI genuinely needs user input (questioning, plan review).

---

## File Inventory

### New Files
| File | Purpose |
|---|---|
| `lib/ai/prompts/behavior.ts` | Shared AI role + rules (composed into all prompts) |
| `lib/ai/prompts/kickoff.ts` | Kickoff inference prompt |
| `lib/ai/stream.ts` | Workflow-aware streaming text wrapper (uses `streamChatText` + writes to `progressLog`) |
| `lib/workflow/progress.ts` | DB-backed progress log writer/reader (`appendProgress`, `getProgressSince`) |
| `app/api/projects/[id]/kickoff/route.ts` | Auto-inference endpoint (idempotent, see A3) |
| `app/api/projects/[id]/answer/route.ts` | Question answer endpoint |
| `app/api/projects/[id]/stream/route.ts` | SSE endpoint (progressive enhancement, polls `progressLog` from DB) |
| `components/builder/QuestionCard.tsx` | Structured question UI |
| `components/builder/ProgressTracker.tsx` | Real-time progress indicator |
| `components/builder/PlanCard.tsx` | Concise plan approval card |

### Modified Files
| File | Change |
|---|---|
| `prisma/schema.prisma` | Add `progressLog` column to `WorkflowRun` |
| `app/projects/new/page.tsx` | Reduce to 3 fields, rename button |
| `app/projects/[id]/builder/page.tsx` | New UX states, enhanced polling, SSE overlay, auto-kickoff, question cards |
| `app/api/projects/route.ts` | Accept reduced field set |
| `app/api/projects/[id]/workflow/route.ts` | Return `progressLog` entries, support `?since=` param |
| `lib/ai/openai-client.ts` | Add `streamChatText()` alongside existing `chatCompletion()` |
| `lib/ai/intake.ts` | Support auto-inference mode |
| `lib/ai/prompts/intake.ts` | Compose shared behavior layer |
| `lib/ai/prompts/planner.ts` | Compose shared behavior layer |
| `lib/ai/prompts/generator.ts` | Compose shared behavior layer |
| `lib/ai/prompts/competitor.ts` | Compose shared behavior layer |
| `lib/ai/prompts/section-update.ts` | Compose shared behavior layer |
| `lib/workflow/types.ts` | Add `kickoff_inferring` and `questioning` states |
| `lib/workflow/transitions.ts` | Add transitions for new states |
| `lib/workflow/engine.ts` | Write progress events to `progressLog` during execution |
| `lib/workflow/runner.ts` | Write progress messages to `progressLog`, handle kickoff state |

---

## Delivery Order

### Phase 1 — Minimal Kickoff (foundation)
1. Step 1.1: Reduce `/projects/new`
2. Step 1.3: Update project creation API
3. Step 1.2: Auto-kickoff endpoint + builder auto-trigger

### Phase 2 — AI Behavior Contract
4. Step 2.1: Create `behavior.ts`
5. Step 2.2: Compose into existing prompts
6. Step 2.3: Create kickoff inference prompt

### Phase 3 — Progressive Questioning
7. Step 3.1: Add workflow states
8. Step 3.4: Answer API
9. Step 3.2: Question card component
10. Step 3.3: Update builder page

### Phase 4 — Streaming Infrastructure
11. Step 4.1: Add `progressLog` column to WorkflowRun
12. Step 4.2: Progress log writer utility
13. Step 4.3: Progress emission in runner/engine
14. Step 4.4: Update polling endpoint to return progress
15. Step 4.5: SSE endpoint (progressive enhancement)
16. Step 4.6: Builder progress consumption (polling + SSE overlay)

### Phase 5 — Streamed AI Text
17. Step 5.1: Add `streamChatText()` to OpenAI client
18. Step 5.2: Workflow-aware streaming wrapper
19. Step 5.3: Stream business summary
20. Step 5.4: Stream plan explanation
21. Step 5.5: Stream question context

### Phase 6 — Builder UX Polish
22. Step 6.1: Layout redesign
23. Step 6.2: Progress tracker
24. Step 6.3: Plan card redesign
25. Step 6.4: Input state management

---

## What This Plan Does NOT Change

- The V2 editor (`/projects/[id]/editor`) — untouched
- The V2 page document schema — untouched
- The V2 renderer — untouched
- The V2 action system — untouched
- The V2 asset system — untouched
- Section generation logic — only prompt composition changes, not output schema
- `chatCompletion()` in `openai-client.ts` — unchanged; all structured JSON AI calls continue using it
- No new database tables — one new column (`progressLog`) on existing `WorkflowRun`, plus expanded JSON structure in existing `Project.businessContext`

---

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| SSE fails in serverless/Vercel | SSE is overlay only; DB-backed polling is primary transport; no state lost if SSE dies (A1) |
| Auto-kickoff called multiple times | Idempotent based on `_kickoff.status`; race-controlled with conditional update (A3) |
| Kickoff interrupted mid-inference | 60s staleness check allows recovery; status reset to `pending` on stale `inferring` (A3) |
| Auto-inference may be wrong | Always show summary and allow correction before proceeding |
| Too few questions → bad output | Confidence thresholds tuned conservatively; editor exists for refinement |
| Questioning state lost on refresh | All question state persisted in `businessContext._kickoff` (A2); builder reconstructs from DB |
| `progressLog` grows unbounded | Entries are small (~100 bytes each); typical workflow produces <50 entries; can truncate on workflow completion |
| Streaming adds complexity | Only 3 AI-streamed moments; all other progress is static template strings; two distinct AI client functions (A4) |
| Builder state machine gets complex | New states are simple additions to existing machine, not a rewrite |
