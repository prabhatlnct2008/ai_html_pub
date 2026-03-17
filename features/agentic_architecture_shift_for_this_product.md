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

---

## Exact Design And Libraries To Use

This section defines the practical implementation direction for the agentic system in this repo.

The goal is to remove ambiguity and make the architecture concrete enough to build.

## Core Stack Direction

Use:

- `LangChain` for model/tool orchestration primitives
- `LangGraph` for stateful, retryable, graph-based agent workflows
- `CrewAI` or “langcrew-style” role modeling only where role framing adds clarity, but keep the actual production orchestration centered on `LangGraph`

### Recommended interpretation

- `LangChain` = model wrappers, prompts, tools, output parsing
- `LangGraph` = main execution engine for agent state transitions and loops
- `Crew-style roles` = conceptual/organizational layer for defining agent responsibilities

This gives the product:

- explicit workflow graphs
- persistent state
- retries
- branching
- repair loops
- easier debugging than loose multi-agent chats

For this product, `LangGraph` should be the backbone.

Do not build the core production system as:

- agents freely chatting with each other without state control
- ad hoc prompt chains with unclear ownership
- uncontrolled multi-agent loops

---

## Recommended Libraries

### Primary

- `langchain`
- `langgraph`
- OpenAI SDK for model access where needed under LangChain wrappers

### Optional / selective

- `crewai` or equivalent role-definition pattern only if it stays thin and does not become a second orchestration runtime
- `zod` for strict schema validation of agent inputs/outputs

### Keep deterministic utilities in-house

Do not outsource core validation logic to the agent framework.

Keep these as application-owned tools/utilities:

- schema validation
- navigation consistency checks
- action existence checks
- slug uniqueness checks
- page/site persistence
- rendering
- migration logic
- retry counting
- workflow logging

---

## Why LangGraph Should Be The Core

This product needs:

- multi-step planning
- page-by-page execution
- review and repair loops
- bounded retries
- explicit state
- partial completion

That maps cleanly to a graph/state-machine style orchestration system.

`LangGraph` is the right fit because it gives:

- explicit nodes
- explicit state passing
- conditional transitions
- persistence compatibility
- interrupt/resume patterns
- easier inspection for a solo founder

This is safer than a freeform “multi-agent conversation” architecture.

---

## Agent Model

The product should use a small set of explicit agents.

Each agent should have:

- one responsibility
- typed input
- typed output
- limited tools
- bounded retry policy

## Agent Set

### 1. Site Planner Agent

Purpose:

- infer sitemap
- define page purposes
- choose the minimum viable useful set of pages

Input:

- business context
- user answers
- optional competitor/ref context

Output:

- `SitePlan`

### 2. Shared Settings Agent

Purpose:

- create site-level theme
- create shared actions
- create header/footer defaults
- initialize nav strategy

Input:

- business context
- site plan

Output:

- `SiteSettingsDraft`

### 3. Page Planner Agent

Purpose:

- create a page plan for one page
- choose sections, variants, CTA path, SEO intent

Input:

- site plan
- site settings
- page goal
- summaries of already-generated pages

Output:

- `PagePlan`

### 4. Page Generator Agent

Purpose:

- generate a structured `PageDocument`

Input:

- page plan
- site settings
- business context
- shared action pool

Output:

- `PageDocument`

### 5. Site Review Agent

Purpose:

- review the whole generated site
- identify duplication, weak messaging, CTA problems, missing contact path, etc.

Input:

- site plan
- site settings
- page summaries/documents

Output:

- `SiteReviewResult`

### 6. Repair Agent

Purpose:

- apply targeted fixes to site/page/section scope

Input:

- review issue
- current page/site state

Output:

- patched structured output

### 7. Editor Assistant Agent

Purpose:

- help users modify site/page/section content after generation

This comes after the first site-build loop is working.

---

## Agent Interaction Model

Agents should not talk to each other freely in open chat.

They should communicate through structured state passed by the orchestrator.

The pattern should be:

1. orchestrator calls agent
2. agent returns typed output
3. deterministic validators run
4. orchestrator decides next node

This keeps the system:

- observable
- testable
- replayable
- safer

---

## Proposed LangGraph Flow

Recommended graph:

1. `site_planning`
2. `shared_settings_generation`
3. `homepage_planning`
4. `homepage_generation`
5. `supporting_pages_planning`
6. `supporting_pages_generation`
7. `site_review`
8. `site_repair`
9. `rendering`
10. `saving`
11. `complete | partial_complete | failed`

### Conditional branches

- if site planner fails twice -> fallback site map
- if page generation fails -> retry page
- if review finds repairable issues -> go to repair node
- if repair succeeds -> review once more
- if one page remains broken -> continue as `partial_complete`

---

## State Shape For LangGraph

Use one explicit state object for the site build run.

Example:

```ts
type SiteBuildGraphState = {
  projectId: string
  workflowRunId: string
  businessContext: Record<string, unknown>

  sitePlan: SitePlan | null
  siteSettingsDraft: SiteSettings | null

  pagePlans: Record<string, PagePlan>
  pageDocuments: Record<string, PageDocument>

  pageStatuses: Record<
    string,
    {
      state: "pending" | "planning" | "generating" | "reviewing" | "repairing" | "complete" | "failed"
      retryCount: number
      issues: string[]
    }
  >

  reviewResult: SiteReviewResult | null
  repairQueue: Array<{
    scope: "site" | "page" | "section"
    targetId: string
    issue: string
  }>

  completedPages: string[]
  failedPages: string[]
  logs: Array<{
    ts: string
    step: string
    type: string
    message: string
  }>
}
```

This state should be serializable and persistable.

---

## Tool Layer

Agents should use tools, but tools should be mostly deterministic application functions.

## Recommended tool categories

### Validation tools

- `validate_page_schema`
- `validate_site_navigation`
- `validate_action_refs`
- `validate_required_contact_path`
- `validate_slug_uniqueness`

### Analysis tools

- `compare_page_summaries`
- `detect_duplicate_copy`
- `detect_missing_cta`
- `detect_empty_sections`

### Fallback tools

- `build_fallback_page_plan`
- `build_fallback_section`
- `apply_safe_theme_defaults`

### Persistence tools

- `save_site_settings`
- `save_page_document`
- `save_review_result`
- `append_workflow_log`

These tools should be wrapped for LangChain/LangGraph use, but the business logic should stay in repo-owned code.

---

## File Structure Recommendation

Recommended structure:

```txt
lib/ai/
  agents/
    site-planner.ts
    shared-settings-agent.ts
    page-planner.ts
    page-generator.ts
    site-review-agent.ts
    repair-agent.ts
    editor-assistant-agent.ts

  graph/
    site-build-graph.ts
    site-build-state.ts
    site-build-nodes.ts
    site-build-transitions.ts

  tools/
    validate-page-schema.ts
    validate-site-navigation.ts
    validate-action-refs.ts
    detect-duplicate-copy.ts
    detect-missing-cta.ts
    fallback-page-plan.ts
    fallback-section.ts
    workflow-log.ts

  prompts/
    site-planner.ts
    shared-settings.ts
    page-planner.ts
    page-generator.ts
    site-reviewer.ts
    repair-agent.ts

  parsers/
    site-plan-parser.ts
    page-plan-parser.ts
    site-review-parser.ts
```

This should sit alongside the current workflow system, not replace everything at once.

---

## How Agents Should Work In Practice

## Site Planner

- one prompt
- one typed output
- deterministic validation
- retry at most 2 times
- fallback to minimal sitemap if still failing

## Shared Settings Agent

- uses site plan + business context
- returns site-wide theme/actions/header/footer defaults
- deterministic sanity check
- retry at most 2 times

## Page Planner

- runs once per page
- references site plan and already-generated page summaries
- must avoid repetitive section plans

## Page Generator

- runs once per page
- produces structured `PageDocument`
- does not own site-level brand/actions
- should reference them but not redefine them

## Reviewer

- runs after all required pages are generated
- mixes deterministic checks + LLM quality review

## Repair Agent

- only touches flagged scope
- never regenerates the whole site unless absolutely necessary
- should prefer section/page fixes over site-wide reset

---

## Retry Boundaries

Use strict retry ceilings.

Recommended:

- site planner: 2 attempts
- shared settings: 2 attempts
- page planner: 2 attempts per page
- page generator: 2 attempts per page
- repair pass: 2 attempts per page/section target
- review loop: max 2 passes total

This is essential for solo-founder operability.

---

## Memory And Context Strategy

Do not treat long agent memory as magic.

For this product, memory should initially be:

- project business context
- inferred site plan
- generated page summaries
- review issues
- user edits

Store these as structured project/workflow artifacts first.

Later, if needed, add:

- retrieval
- durable long-term preferences
- cross-session editor-assistant memory

That later layer can move the system slightly closer to Base44-style persistent intelligence.

---

## What Remains Deterministic

Even in an agentic system, keep these outside agent judgment:

- database writes
- migration rules
- schema enforcement
- route structure
- publish state enforcement
- nav/page consistency rules
- retry counters
- workflow transitions
- permission checks

That is not “going back.”
That is correct system design.

---

## MVP Build Order

Implement in this order:

1. `site-planner`
2. `shared-settings-agent`
3. `page-planner`
4. `page-generator`
5. deterministic validators
6. `site-review-agent`
7. `repair-agent`
8. LangGraph orchestration and persistence polish

Do not start with background autonomy or code/runtime agents.

---

## Future Expansion

After the structured website agent layer is stable:

- add richer tool use
- add memory
- add background optimization agents
- add integration agents
- only later consider Bolt-like code/runtime agents if the product expands beyond structured websites

This is how the system grows safely while still staying clearly agentic.
