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

**Goal:** Replace polling with real-time SSE for workflow progress and streamed text.

### Step 4.1: SSE workflow stream endpoint

**New file:** `app/api/projects/[id]/stream/route.ts`

GET endpoint that returns a Server-Sent Events stream.

Event types:
```
event: progress
data: { "state": "strategy_generation", "message": "Choosing page layout style", "progress": 35 }

event: question
data: { "field": "primaryCta", "question": "What should visitors do first?", "options": [...] }

event: text
data: { "content": "Based on your description, ", "done": false }

event: text
data: { "content": "I can see this is a dog training business targeting...", "done": true }

event: plan_ready
data: { "plan": { ... } }

event: complete
data: { "redirectUrl": "/projects/abc/editor" }

event: error
data: { "message": "Generation failed", "retryable": true }
```

The stream stays open while the workflow is active. The client subscribes on mount and unsubscribes on unmount.

### Step 4.2: Workflow event emitter

**New file:** `lib/workflow/events.ts`

A simple event emitter/channel pattern that workflow engine and runner can use to push events:

```ts
export function createWorkflowStream(projectId: string): ReadableStream
export function emitProgress(projectId: string, state: string, message: string): void
export function emitText(projectId: string, content: string, done: boolean): void
export function emitQuestion(projectId: string, question: QuestionData): void
```

Implementation: Use an in-memory Map of project ID → TransformStream pairs. The SSE endpoint creates a stream for the project; the workflow runner pushes events into it. If no listener is connected, events are dropped (the client can still poll as fallback).

### Step 4.3: Add progress emission to workflow runner

**File:** `lib/workflow/runner.ts`

Before each `executeState()` call, emit a human-readable progress message:

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

**File:** `lib/workflow/engine.ts`

In the `runWorkflow` loop, call `emitProgress()` at each state transition.

### Step 4.4: Update builder to use SSE

**File:** `app/projects/[id]/builder/page.tsx`

Replace the 1.5s polling with an EventSource connection to `/api/projects/[id]/stream`.

Keep polling as a fallback: if EventSource fails to connect, fall back to the existing polling behavior (1.5s interval). This ensures the app works even if SSE has issues.

The SSE connection:
- Updates progress panel in real time
- Appends streamed text to conversation area
- Shows question cards when `question` events arrive
- Handles `complete` event to show editor redirect

---

## Phase 5: Stream AI Text for Key Moments

**Goal:** Stream user-visible assistant text (not all AI calls — just the moments that benefit from progressive output).

### Step 5.1: Stream the business understanding summary

After initial inference, stream a 2-3 sentence summary of what the AI understood:

> "You're building a page for [business name], a [type] business that [main offer]. Your target audience is [audience]. I'll optimize for [CTA direction]."

This streams token-by-token into the builder conversation area via the SSE text events.

### Step 5.2: Stream plan explanation

When the plan is ready, stream a brief explanation before showing the structured plan card:

> "I've designed a [N]-section page focused on [strategy]. Here's the plan:"

### Step 5.3: Stream follow-up question context

When asking a question, optionally stream a short rationale:

> "I'm confident about most details, but I want to make sure about one thing:"

Then show the structured question card.

### Step 5.4: Streaming AI call wrapper

**New file:** `lib/ai/stream.ts`

A utility that wraps OpenAI/Anthropic streaming calls and pipes chunks through the workflow event emitter:

```ts
export async function streamAIText(
  projectId: string,
  messages: Message[],
  options?: { onComplete?: (fullText: string) => void }
): Promise<string>
```

This is used selectively — only for the moments identified above, not for every AI call (strategy/theme/asset planning/section generation stay non-streamed since their output is structured JSON, not user-visible text).

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
| `lib/ai/stream.ts` | Streaming AI call wrapper |
| `lib/workflow/events.ts` | Workflow event emitter for SSE |
| `app/api/projects/[id]/kickoff/route.ts` | Auto-inference endpoint |
| `app/api/projects/[id]/answer/route.ts` | Question answer endpoint |
| `app/api/projects/[id]/stream/route.ts` | SSE stream endpoint |
| `components/builder/QuestionCard.tsx` | Structured question UI |
| `components/builder/ProgressTracker.tsx` | Real-time progress indicator |
| `components/builder/PlanCard.tsx` | Concise plan approval card |

### Modified Files
| File | Change |
|---|---|
| `app/projects/new/page.tsx` | Reduce to 3 fields, rename button |
| `app/projects/[id]/builder/page.tsx` | New UX states, SSE, auto-kickoff, question cards |
| `app/api/projects/route.ts` | Accept reduced field set |
| `lib/ai/intake.ts` | Support auto-inference mode |
| `lib/ai/prompts/intake.ts` | Compose shared behavior layer |
| `lib/ai/prompts/planner.ts` | Compose shared behavior layer |
| `lib/ai/prompts/generator.ts` | Compose shared behavior layer |
| `lib/ai/prompts/competitor.ts` | Compose shared behavior layer |
| `lib/ai/prompts/section-update.ts` | Compose shared behavior layer |
| `lib/workflow/types.ts` | Add `kickoff_inferring` and `questioning` states |
| `lib/workflow/transitions.ts` | Add transitions for new states |
| `lib/workflow/engine.ts` | Emit progress events during execution |
| `lib/workflow/runner.ts` | Emit progress messages, handle kickoff state |

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

### Phase 4 — Streaming
11. Step 4.2: Event emitter
12. Step 4.1: SSE endpoint
13. Step 4.3: Progress emission in runner
14. Step 4.4: Builder SSE client

### Phase 5 — Streamed AI Text
15. Step 5.4: Streaming AI call wrapper
16. Step 5.1: Stream business summary
17. Step 5.2: Stream plan explanation
18. Step 5.3: Stream question context

### Phase 6 — Builder UX Polish
19. Step 6.1: Layout redesign
20. Step 6.2: Progress tracker
21. Step 6.3: Plan card redesign
22. Step 6.4: Input state management

---

## What This Plan Does NOT Change

- The V2 editor (`/projects/[id]/editor`) — untouched
- The V2 page document schema — untouched
- The V2 renderer — untouched
- The V2 action system — untouched
- The V2 asset system — untouched
- Section generation logic — only prompt composition changes, not output schema
- Database schema — no new tables needed (workflow state and businessContext already stored in existing tables)

---

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| SSE may not work behind all proxies | Keep polling as fallback; SSE is progressive enhancement |
| Auto-inference may be wrong | Always show summary and allow correction before proceeding |
| Too few questions → bad output | Confidence thresholds tuned conservatively; editor exists for refinement |
| Streaming adds complexity | Only stream 3 specific moments (summary, plan, question context), not everything |
| Builder state machine gets complex | New states are simple additions to existing machine, not a rewrite |
