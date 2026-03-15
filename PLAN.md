# Refactor Plan: Autonomous Workflow Builder

## Problem Summary

The current builder is a passive chatbot where every state transition requires the user to send another message. This creates deadlocks (approval → generation never fires), excessive questioning (intake never stops), and a confusing UX where the user doesn't know what's happening.

## What Changes

### 1. New Workflow Engine (`lib/workflow/`)

Replace the message-triggered orchestrator with a job-oriented state machine.

**States:**
```
intake → intake_complete → competitor_analysis_running → competitor_analysis_complete →
plan_generation_running → plan_review → generation_running → rendering → saving → complete
```
Also: `failed` (any step can fail and be retried).

**Key difference:** Once a state is entered that doesn't require user input, the engine runs it immediately and advances to the next state autonomously. Only `intake` and `plan_review` wait for user input.

**New files:**
- `lib/workflow/types.ts` — State enum, WorkflowStatus type, BusinessContext schema
- `lib/workflow/engine.ts` — Core state machine: `runWorkflow(projectId)` that loops through states until it hits a user-input-required state or completes
- `lib/workflow/transitions.ts` — Pure functions: given current state + data, what's the next state?
- `lib/workflow/runner.ts` — Executes the action for each state (calls AI agents, saves data, renders HTML)

**How it works:**
1. `runWorkflow(projectId)` reads current state from DB
2. If the state is auto-executable (no user input needed), execute it
3. On success, transition to next state, loop back to step 2
4. On user-input-required state (`intake`, `plan_review`), stop and return status
5. On failure, set state to `failed` with error details

### 2. New Database Model

**Add `WorkflowRun` model** (replaces workflow tracking in Conversation):
```
WorkflowRun
  id              String @id
  projectId       String @unique
  state           String @default("intake")
  currentStep     String @default("")        // human-readable: "Generating hero section"
  steps           String @default("[]")      // JSON: [{name, status, startedAt, completedAt}]
  canUserReply    Boolean @default(true)
  progressPercent Int @default(0)
  lastError       String?
  startedAt       DateTime
  completedAt     DateTime?
  updatedAt       DateTime @updatedAt
```

**Keep `Conversation` model** but only for chat messages (remove `workflowState` and `aiContext` from it — move `aiContext` to WorkflowRun or keep on Project.businessContext).

Actually, simpler: keep `aiContext` on Conversation since it's accumulated from chat, but move `workflowState` to WorkflowRun. The Conversation becomes purely a chat log + extracted context.

### 3. New API Endpoints

Replace the single `POST /conversation` (which does everything) with task-specific endpoints:

| Endpoint | Purpose |
|----------|---------|
| `POST /api/projects/:id/intake` | Send user message during intake phase |
| `POST /api/projects/:id/approve-plan` | Approve plan → triggers autonomous generation |
| `POST /api/projects/:id/revise-plan` | Request plan modification with feedback |
| `POST /api/projects/:id/retry` | Retry after failure |
| `GET /api/projects/:id/workflow` | Poll workflow status (state, steps, canUserReply, etc.) |
| `GET /api/projects/:id/conversation` | Get chat messages only |

**Response shape from all workflow endpoints:**
```typescript
{
  state: string;
  currentStep: string;
  steps: Array<{name: string; status: "pending"|"in_progress"|"completed"|"failed"}>;
  canUserReply: boolean;
  progressPercent: number;
  progressMessage: string;
  error: string | null;
  plan?: PlanData;        // included when plan exists
  messages?: Message[];   // included from conversation
  redirectTo?: string;    // "/projects/:id/editor" when complete
}
```

### 4. Strict Intake Schema

Replace the AI-decides-when-to-stop approach with a fixed schema:

```typescript
type BusinessContext = {
  // REQUIRED (must have these to proceed)
  businessName: string;
  businessType: string;
  targetAudience: string;
  primaryCta: string;

  // OPTIONAL (auto-fill with defaults if missing)
  location?: string;
  tone?: string;            // default: "professional"
  mainOffer?: string;
  secondaryCta?: string;
  contactEmail?: string;
  contactPhone?: string;
  competitorUrl?: string;
  differentiators?: string[];  // default: generated from businessType
  testimonials?: string[];     // default: AI-generated mock
  brandColors?: string;
}
```

**Logic:**
1. On project creation, populate what we already have from the form
2. Intake AI extracts from each message into this schema
3. After each message, check: are all REQUIRED fields filled?
4. If yes → `intake_complete`, proceed autonomously
5. If no → ask ONLY about missing required fields (max 1-2 questions)
6. Never ask about optional fields. Auto-fill them later during generation.

### 5. Fix Approval Detection

Replace fragile regex with exact phrase matching + a dedicated endpoint:

**Primary fix:** The `POST /api/projects/:id/approve-plan` endpoint removes all ambiguity. The frontend calls this endpoint when the "Approve & Generate" button is clicked.

**Secondary fix:** If user types approval in chat, use stricter matching:
```typescript
const APPROVAL_PHRASES = [
  "approve", "approved", "i approve", "looks good", "go ahead",
  "perfect", "generate", "yes", "proceed", "let's go", "do it"
];
const isApproval = APPROVAL_PHRASES.some(phrase =>
  userMessage.trim().toLowerCase() === phrase ||
  userMessage.trim().toLowerCase().startsWith(phrase + " ")
);
```

### 6. Frontend Builder Redesign

**Layout changes:**

Left panel (55% width): Chat conversation + input
- Input disabled when `canUserReply === false`
- Shows status text instead: "AI is generating your page..."
- Explicit buttons appear for plan review: "Approve & Generate" / "Request Changes"

Right panel (45% width): Workflow progress dashboard
- Step-by-step progress list with statuses
- Steps:
  1. Understanding business
  2. Competitor analysis (if URL provided)
  3. Building page plan
  4. Waiting for approval (user action needed)
  5. Generating sections
  6. Rendering page
  7. Saving project
- Each step: pending → in_progress (spinner) → completed (checkmark) → failed (X)
- Current step highlighted with description of what's happening
- Plan preview shown inline when plan is generated
- Error display with retry button if failed

**Polling:**
- Frontend polls `GET /api/projects/:id/workflow` every 1.5 seconds while `canUserReply === false`
- Stops polling when `canUserReply === true` or `state === "complete"`
- On `complete`, auto-redirects to editor after 1 second

**Approval UX:**
- When plan is generated, show plan in right panel
- Show two buttons below the plan: "Approve & Generate" and "Request Changes"
- "Request Changes" opens a text input for feedback
- No more typing "approve" in chat

### 7. Automatic Transitions

The workflow engine handles these automatically (no user message needed):

```
intake_complete → competitor_analysis_running (if URL) or plan_generation_running
competitor_analysis_complete → plan_generation_running
plan approved → generation_running
generation_running → rendering → saving → complete
```

User input only needed at:
- `intake` — answering questions
- `plan_review` — approve or revise

## File Changes Summary

### New files
- `lib/workflow/types.ts`
- `lib/workflow/engine.ts`
- `lib/workflow/transitions.ts`
- `lib/workflow/runner.ts`
- `app/api/projects/[id]/intake/route.ts`
- `app/api/projects/[id]/approve-plan/route.ts`
- `app/api/projects/[id]/revise-plan/route.ts`
- `app/api/projects/[id]/retry/route.ts`
- `app/api/projects/[id]/workflow/route.ts`
- `components/builder/WorkflowProgress.tsx`
- `components/builder/PlanApproval.tsx`

### Modified files
- `prisma/schema.prisma` — add WorkflowRun model, simplify Conversation
- `lib/ai/intake.ts` — use strict required-fields schema
- `lib/ai/prompts/intake.ts` — updated prompt with strict schema
- `app/projects/[id]/builder/page.tsx` — full rewrite: polling, progress panel, approval buttons
- `components/chat/ChatPanel.tsx` — support disabled state with status message
- `app/api/projects/[id]/conversation/route.ts` — simplify to GET only (chat history)

### Removed/deprecated
- `lib/ai/orchestrator.ts` — replaced by `lib/workflow/engine.ts`
- `POST /api/projects/[id]/conversation` — replaced by task-specific endpoints

### Preserved (no changes)
- Editor flow (`app/projects/[id]/editor/`)
- All editor components (`components/editor/`)
- Page rendering (`lib/html-renderer.ts`)
- AI agents (`lib/ai/planner.ts`, `lib/ai/generator.ts`, `lib/ai/competitor.ts`, `lib/ai/section-updater.ts`)
- Published page route (`app/p/[slug]/`)
- Auth system
- Dashboard

## Implementation Order

1. Database: Add WorkflowRun model, migrate
2. Workflow engine: types → transitions → runner → engine
3. Update intake agent with strict schema
4. New API routes (intake, approve-plan, revise-plan, workflow, retry)
5. Frontend: WorkflowProgress component, PlanApproval component
6. Frontend: Rewrite builder page with polling + progress panel
7. Remove old orchestrator, update conversation route
8. Test full flow, fix edge cases
9. Commit and push
