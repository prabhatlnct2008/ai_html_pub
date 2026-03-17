# Agentic Architecture Shift For This Product

## Purpose

This document makes the product direction explicit:

this product is moving toward an agentic architecture.

We are not treating the future of the system as:

- rigid one-shot prompting
- hard-coded deterministic page assembly only
- narrow 2023-style prompt wrappers

We are building a system that can:

- understand user goals
- plan a website
- generate multiple pages
- review its own output
- repair problems
- iterate toward a better result
- eventually act with broader autonomy

The remaining question is not whether the system should be agentic.

The question is:

`what kind of agentic system should this product become, and in what order should those capabilities be introduced?`

---

## Position

The product should move from:

`deterministic landing-page workflow`

to:

`agentic website-building platform`

This means the system should no longer be thought of as:

- one workflow
- one page
- one generation step
- one output pass

It should be thought of as:

- a goal interpreter
- a planner
- a generator
- a reviewer
- a repairer
- an editor assistant
- eventually a background operator

---

## Why The Shift Is Necessary

Modern users do not want to issue perfectly structured commands for every page, section, and style decision.

They communicate in goals and intent.

Examples:

- "Build me a premium consulting website"
- "Make this site feel more trustworthy"
- "Turn this homepage into a full business website"
- "Improve this site for local lead generation"
- "Fix whatever is weak and get this publish-ready"

These requests are not deterministic instructions.

They are semantic goals.

A modern product must translate those goals into:

- plans
- page structures
- design choices
- repair steps
- follow-up actions

That is why agentic architecture is necessary.

---

## What We Mean By Agentic Here

For this product, agentic means:

1. the system reasons before acting
2. the system can break a goal into smaller tasks
3. the system can inspect what it produced
4. the system can decide what to fix
5. the system can retry with a narrower scope
6. the system can preserve partial progress
7. the system can use tools and validators
8. the system can operate across multiple pages and shared site state

This is not the same as "wild autonomous swarm."

It is controlled agency with clear boundaries.

---

## The Architectural Shift

## Old System Shape

The old system is centered around:

- fixed workflow states
- mostly single-page generation
- limited post-generation iteration
- one primary AI path
- deterministic renderer and storage

This is fine for a simpler product.

It is not enough for the product we want to build.

## New System Shape

The new system should be centered around:

- user goal interpretation
- site planning
- multi-page generation
- review and repair loops
- contextual editing
- bounded retries
- structured memory of the run
- background execution for long tasks

---

## The Right Agent Layers For This Product

The system should evolve in layers.

## Layer 1: Structured Website Agents

These agents operate on structured website objects:

- sites
- pages
- sections
- actions
- assets
- forms
- themes

These are the first agents we should build.

### Agents in this layer

- Site Planner Agent
- Shared Settings Agent
- Page Planner Agent
- Page Generator Agent
- Review Agent
- Repair Agent
- Editor Assistant Agent

### Why this is the right first layer

Because the product's current and near-term output is a structured website, not an arbitrary codebase.

This gives us:

- strong quality control
- lower operating cost
- better predictability
- easier debugging
- easier persistence

## Layer 2: Tool-Using Website Agents

These agents still operate on website objects, but gain more tools.

### Example tools

- schema validator
- page diff analyzer
- design consistency checker
- SEO checker
- accessibility checker
- form validator
- publish readiness checker

### What this unlocks

- stronger repair loops
- smarter quality checks
- better autonomous improvement
- more trustworthy publish decisions

## Layer 3: Operational / Background Agents

These agents run asynchronously or continuously.

### Examples

- scheduled optimization agent
- lead-flow improvement agent
- stale page checker
- publish monitor
- SEO refresh agent

### What this unlocks

- ongoing value after initial generation
- agentic product feel beyond the editor
- Base44-like background behavior

## Layer 4: Code / Runtime Agents

These agents operate on code, files, builds, and runtime environments.

### Examples

- custom code block agent
- site export patcher
- runtime/debug agent
- framework-aware code agent

### What this unlocks

- more Bolt-like behavior
- custom code workflows
- deeper extensibility

### Why this is later

Because it adds the most complexity:

- file mutation
- dependency management
- runtime debugging
- higher failure modes
- more expensive infrastructure

---

## What We Are Building Now

The current target should be:

`Layer 1 first, Layer 2 soon after`

That means:

- multi-page site architecture
- site planner
- multi-page generator
- reviewer
- repair loop
- contextual editor assistant

This is already meaningfully agentic.

It is not a retreat from the future.

It is the right first implementation of that future.

---

## Why We Are Not Going Backward

We are not moving backward into rigid determinism.

We are keeping deterministic components where they are structurally better:

- schema validation
- rendering
- persistence
- action reference checks
- slug rules
- navigation consistency
- retry ceilings
- migration logic

But those deterministic components are not the product brain.

They are the guardrails around the agentic system.

The agentic parts should own:

- goal interpretation
- planning
- generation
- review
- repair
- iterative improvement

This is the correct architecture for 2026:

`reasoning-based systems with deterministic safety boundaries`

not:

`raw deterministic automation only`

and not:

`unbounded autonomy with no guardrails`

---

## What Bolt-Like Means For This Product

For this repo, Bolt-like should mean:

- the system can plan before generating
- the system can inspect failures
- the system can retry and fix
- the system can change multiple related outputs coherently
- the system can iterate until acceptable

It does not have to mean, immediately:

- full repo sandbox
- package installation agent
- open-ended terminal mutation
- arbitrary code generation across frameworks

Those are later expansions if the product boundary moves toward an open-ended code builder.

---

## What Base44-Like Means For This Product

For this repo, Base44-like should mean:

- richer workflow-oriented autonomy
- stronger memory of user/site context
- reusable skill-like tool modules
- background agents
- trigger-based tasks
- broader tool use around publishing, forms, SEO, and automations

This should come after the structured website agent layer is strong.

---

## The Recommended Immediate Architecture

The next architecture should look like this:

1. User goal enters system
2. Site Planner Agent creates site plan
3. Shared Settings Agent creates theme, nav, actions, header, footer
4. Page Planner Agent creates per-page plans
5. Page Generator Agent generates each page
6. Review Agent evaluates site-wide quality
7. Repair Agent fixes weak or invalid output
8. Workflow completes with full or partial site
9. Editor Assistant Agent helps user refine results

This is the first real agentic platform version of the product.

---

## Mandatory Guardrails

Even in an agentic system, some controls must be mandatory.

### Every run should have:

- run ID
- agent step log
- prompt/input trace
- output trace
- retry count
- failure reason
- fallback path

### Every agent should have:

- explicit responsibility
- explicit inputs
- explicit outputs
- max retries
- bounded scope

### Every workflow should support:

- partial success
- resumability
- replay/debugging
- user-visible progress

This is what makes a solo-founder-manageable agentic system possible.

---

## The Product Philosophy

We are not building a system that passively waits for perfect instructions.

We are building a system that actively works toward a goal.

That means the system should:

- make decisions
- evaluate tradeoffs
- take corrective action
- keep going when one step fails
- present useful progress to the user

The user should feel:

- "the system is actually building this for me"

not:

- "the system just generated one draft and then gave up"

---

## Recommended Sequence

1. Build the multi-page site architecture
2. Build the agentic multi-page generation and repair system
3. Add stronger tool-using review and validation
4. Add background and memory-driven autonomy
5. Later, add code/runtime agents only if the product genuinely expands into that space

This keeps the platform aligned with the right future while remaining operable.

---

## Conclusion

The debate should be considered settled:

- this product should move toward agentic architecture
- deterministic-only generation is not the target
- the first agentic implementation should operate on structured website objects
- deterministic systems remain as guardrails, not as the primary product intelligence

The immediate goal is not to choose between:

- deterministic
- agentic

The immediate goal is to build:

`a safe, powerful, agentic website-building system`

with the right layers introduced in the right order.
