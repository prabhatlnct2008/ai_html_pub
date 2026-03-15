# Unified AI Kickoff And Streaming Builder Spec

## Goal

Replace the current two-step onboarding flow:

1. separate intake form at `/projects/new`
2. AI builder experience after project creation

with a single unified experience that gets the user into the AI workflow faster, reduces abandonment, and makes the product feel modern, responsive, and agentic.

This document focuses on:

- why the current split flow is weak
- what should change in the UX and route behavior
- how the unified flow should work
- how streaming should be introduced
- what user impact we expect

This document does not cover external integrations like Google Sheets. Those should remain separate features.

---

## Why We Want This

The current onboarding flow is too front-loaded.

Users are first asked to fill a form, then moved into the AI builder. That creates multiple problems:

- it delays time-to-value
- it makes the product feel like a conventional admin tool
- it increases drop-off before the AI does anything visible
- it creates an artificial separation between "intake" and "building"
- it does not match current user expectations for AI products

If the promise is "AI will build this for you", then the product should start behaving like AI as early as possible.

The first minute of product experience matters the most. Users should feel momentum immediately.

What users want emotionally:

- "I can start quickly"
- "The AI understands what I mean"
- "I am already getting output"
- "I can skip details for now"
- "I am not stuck filling forms"

The current flow does not maximize those feelings.

---

## Product Thesis

The best experience is not:

- long static intake form first
- then a separate AI screen

The best experience is:

- minimal entry
- immediate AI engagement
- progressive questioning only when useful
- visible progress while the AI works
- early draft generation with the editor as the safety net

This means intake and builder should be merged at the UX level into a single "AI kickoff workspace".

There may still be multiple routes under the hood if needed technically, but the user should experience one continuous workflow.

---

## Before Vs After

## Before

### Entry Flow

User lands on `/projects/new` and sees a conventional form with fields like:

- project name
- business description
- competitor URL
- target audience
- primary CTA
- secondary CTA

The user must fill a meaningful portion of this before the AI starts doing anything.

### Builder Flow

After submission, the user enters the AI builder and the AI begins asking questions or generating a plan.

### Problems With This

- too much effort before reward
- visual style feels generic and "AI-generated app"
- duplicate cognition between form fields and later AI questions
- users may leave before seeing any AI value
- the split between intake and builder feels artificial

---

## After

### Unified Flow

User enters a single AI kickoff experience.

At the top:

- business name
- what the business offers
- optional website/reference link

Then the AI starts immediately.

### AI Behavior

The AI should:

- infer business type
- infer likely audience
- infer page type
- infer CTA direction
- infer tone candidates
- ask follow-up questions only when they materially improve the page
- let users skip any question for now
- proceed with defaults when enough information exists

### Progress Experience

Instead of waiting silently, the product should show:

- what the AI is doing now
- which business details it already inferred
- when it is asking something important
- when it has enough to generate

### Result

The experience becomes:

- faster
- more modern
- more engaging
- less form-heavy
- more consistent with the product promise

---

## Core UX Recommendation

Do not make the user choose between:

- form mode
- chat mode

Use a guided AI workspace with structured inputs plus conversational follow-ups.

The right model is a hybrid:

- tiny structured starting point
- AI-led progressive intake
- quick-reply options
- optional freeform response
- skip-anytime behavior

This combines speed and control.

---

## Screen Changes

## 1. `/projects/new`

### Current Role

This route currently acts as a classic project intake form.

### New Role

This route should become a lightweight kickoff surface, not a full intake screen.

It should do one of two things:

### Option A: Keep `/projects/new` as the visible kickoff page

Show only:

- business name
- what do you offer
- optional website/reference
- one primary button: `Start with AI`

On submit:

- create project immediately
- redirect into the unified builder workspace

### Option B: Eliminate `/projects/new` as a meaningful standalone page

Trigger project creation from a lightweight modal or embedded starter panel and go directly into the builder route.

### Recommendation

Option A is the safer first step.

It keeps current route structure simple while changing the user experience substantially.

The page should feel like a launch pad, not a setup form.

---

## 2. `/projects/[id]/builder`

### Current Role

This route currently acts as the AI conversation and workflow screen after intake is already done.

### New Role

This becomes the true unified AI kickoff workspace.

It should handle:

- project kickoff
- AI inference
- progressive intake questions
- plan generation
- plan approval
- generation progress

This is now the main "start building" screen.

### New Builder States

The builder should support these user-facing states:

1. `kickoff`
2. `inferring`
3. `questioning`
4. `plan-ready`
5. `generating`
6. `complete`
7. `failed`

---

## Detailed Unified Flow

## Step 1: Minimal Entry

The user provides:

- business name
- what the business offers
- optional website/reference link

That is enough to create the project.

No more than 2 required fields should exist at this stage.

Optional fields should remain optional.

### Why

This minimizes friction and gets the AI involved quickly.

---

## Step 2: AI Starts Working Immediately

As soon as the project is created, the builder should begin work.

The UI should show progress such as:

- Understanding your business
- Inferring audience and offer
- Choosing page structure
- Looking for strong CTA direction

This should happen even before asking follow-up questions.

### Why

The user should feel instant momentum.

---

## Step 3: Progressive Questions Only When Necessary

The AI should ask at most one focused question at a time.

Questions should appear only if:

- confidence is low
- the field matters to output quality
- the answer changes structure or CTA strategy materially

Examples of good questions:

- Who is this page mainly for?
- What should visitors do first?
- Which tone fits better?
- Which contact method should be featured?

Bad questions:

- optional details too early
- long open-ended prompts
- repeated requests for the same information

### Required Answer Options

Every question should support:

- quick reply chips
- custom answer
- `Skip for now`
- `Use AI suggestion` when possible

### Why

Users should not feel trapped in a back-and-forth before generation starts.

---

## Step 4: AI Summary And Plan

Once enough information exists, the AI should show:

- what it inferred
- selected page type
- CTA direction
- tone/theme direction
- likely section structure

Then ask for:

- approve
- one-line correction
- regenerate direction

This should be concise and structured, not a wall of chat text.

---

## Step 5: Generate While Showing Progress

After approval, the AI should continue generation autonomously.

The user should see structured live progress like:

- Generating hero copy
- Planning visuals
- Building services section
- Preparing testimonials
- Assembling page
- Rendering final page

The send input should be disabled while autonomous generation is in progress unless the AI explicitly needs user input.

---

## Why This Is Better For Users

## 1. Faster Time To Value

The user sees the AI working almost immediately.

## 2. Lower Cognitive Load

Users do not have to answer everything up front.

## 3. Better Attention Retention

Progress and streaming reduce the feeling of waiting.

## 4. More Modern Product Feel

The app feels like an AI assistant, not a setup wizard.

## 5. Better Tolerance For Incomplete Information

Users can skip questions and still get a usable draft.

## 6. Better Alignment With The Editor

The editor becomes the place for refinement, not the rescue step for bad onboarding.

---

## Streaming Recommendation

The current pattern where the UI waits until the full OpenAI call finishes is not good enough.

Users should not stare at a static screen while work happens invisibly.

We should introduce two forms of streaming:

## 1. Workflow Progress Streaming

This streams structured status events.

Examples:

- state changed
- started inference
- question ready
- plan ready
- generation started
- generation completed
- failed

These should update the progress panel immediately.

## 2. Text Streaming

This streams user-visible assistant text for places where progressive text is helpful.

Good uses:

- AI summary
- plan explanation
- follow-up question wording
- short strategic rationale

Not every background step needs token-by-token streaming.

For many steps, structured progress messages are better than raw token output.

---

## Recommended Streaming UX

The screen should have:

- a main conversation area
- a progress area
- a dynamic "currently doing" label

Examples:

- "Analyzing your offer"
- "Choosing a layout style"
- "Generating hero messaging"
- "Preparing your first draft"

This is much more engaging than a spinner or frozen UI.

---

## Streaming Architecture Recommendation

Use:

- persisted workflow state
- streamed workflow events
- streamed assistant text where appropriate

Recommended model:

### Backend

- start or continue workflow on demand
- persist workflow state transitions
- emit progress events
- emit question-ready events
- emit plan-ready events
- optionally emit text chunks for assistant-visible content

### Frontend

- subscribe to workflow events while builder is active
- update progress panel in real time
- append streamed text into the conversation area
- disable freeform input during autonomous work
- re-enable input only when user action is actually needed

### Suggested Transport

Practical options:

- Server-Sent Events
- streaming HTTP response
- WebSocket if the app later needs richer bidirectional session behavior

### Recommendation

For current scope, SSE or streaming HTTP is the most practical.

It is simpler than introducing a full WebSocket layer and fits the workflow/status use case well.

---

## Questioning Rules

These rules are essential to avoid repeating the earlier intake problems.

### Rule 1

Do not ask more than one meaningful question at a time.

### Rule 2

Do not ask for optional information when generation can proceed without it.

### Rule 3

If the user skips, the AI must continue.

### Rule 4

If the user says "just make something", the AI must stop questioning and proceed.

### Rule 5

If the system already inferred a field with high confidence, do not ask again.

### Rule 6

If there is a good AI suggestion, offer it as a quick option instead of forcing a custom answer.

---

## What Should Happen To The Existing Form Fields

The current intake fields do not need to disappear entirely, but they should move out of the initial mandatory experience.

### Keep Up Front

- project name
- business description
- optional reference URL

### Move To Progressive AI Questions

- target audience
- primary CTA direction
- tone
- contact method priority

### Move To Optional "More Details" Expansion Or Later Editor Setup

- secondary CTA
- location
- detailed offers
- detailed social proof

This keeps the start flow clean while preserving control.

---

## User Impact Summary

## Before

- user sees a generic form
- user does work before AI does work
- user waits for full responses
- user may lose interest before reaching value

## After

- user gives minimal input
- AI starts immediately
- AI asks only focused questions
- user can skip details
- progress is visible throughout
- system feels fast, alive, and more premium

This should improve:

- project start rate
- builder engagement
- completion rate to first draft
- perceived speed
- product differentiation

---

## Risks

## 1. Too Many Questions Again

If the AI asks too much, the unified flow still fails.

Mitigation:

- strict questioning rules
- skip-first philosophy
- confidence-based questioning

## 2. Messy Hybrid UI

If the workspace mixes form and chat poorly, it could feel cluttered.

Mitigation:

- keep the kickoff inputs small
- use structured question cards
- separate progress from conversation visually

## 3. Streaming Without Clarity

If raw token streaming is shown everywhere, the product may feel noisy.

Mitigation:

- stream polished user-facing text
- use clean progress events for background tasks

---

## Recommended Implementation Shape

## Phase 1

- simplify `/projects/new`
- create project from minimal input
- redirect quickly into builder
- make builder the true kickoff workspace

## Phase 2

- add focused AI questioning with skip support
- add inferred-context summary
- stop repeated questioning

## Phase 3

- add workflow progress streaming
- add streaming assistant text where useful
- improve status visibility

## Phase 4

- refine builder UX around approval and autonomous generation
- tighten plan summary and correction loop

---

## Explicit Product Decision

We should merge intake and builder at the UX level.

We do not need a heavy standalone intake screen anymore.

We may still keep `/projects/new` technically, but only as a lightweight project kickoff entry point.

The main user experience should be:

- minimal input
- immediate AI engagement
- progressive questioning
- visible live progress
- fast first draft generation

---

## Non-Negotiable Outcomes

When this redesign is complete:

- users should not have to fill a long form before the AI starts
- users should be able to skip non-critical questions
- the AI should begin visible work immediately after minimal input
- the builder should feel like the primary onboarding experience
- waiting states should be replaced with streaming progress and useful output
- the experience should feel faster, more modern, and less generic

If the user still feels like they are completing a setup form before the product begins, then this redesign is incomplete.
