# Base44-Style Website Builder Feature Roadmap

## Purpose

This document defines the feature set, architecture direction, and phased roadmap for evolving this product from a landing-page generator into a broader AI website builder closer in spirit to products like Base44, Bolt, Emergent, and similar AI-first builders.

The goal is not to copy those products blindly.

The goal is to identify:

- which capabilities actually matter
- which capabilities are missing today
- which features will make this product feel significantly more powerful
- how to build them in a cheaper and faster way
- which parts should be deferred because they are expensive or premature

This document should serve as the working backlog for future implementation planning.

---

## Product Goal

Build an AI-first website builder for SMBs, agencies, creators, and operators that can:

- generate landing pages
- generate full multi-page marketing websites
- create and manage forms
- generate and manage images
- support strong visual editing after generation
- publish clean production-ready pages
- iterate quickly through AI-assisted edits

The target experience is:

- faster than hiring a freelancer for first draft
- more structured and reliable than freeform AI code generation
- cheaper to run than a fully autonomous coding-agent platform
- good enough for real business websites, not only demos

---

## Strategic Position

This product should be positioned as:

`AI website builder with structured generation + strong editing + reliable publishing`

It should not initially try to be:

- a general-purpose app builder
- a full coding IDE in the browser
- a multi-agent swarm product
- a freeform React/Next code generator

That broader direction can come later if justified.

The cheapest and fastest path is to become excellent at structured website generation first.

---

## What Products Like Base44 / Bolt / Emergent Usually Feel Like

Users perceive those products as powerful because they combine several things:

1. fast initial generation
2. visible AI momentum
3. broad scope beyond one landing page
4. stronger editing after generation
5. repeatable visual quality
6. quick regeneration and iteration
7. built-in assets and forms
8. publishable results
9. some degree of agentic behavior
10. reduced need for manual setup

The feeling of capability comes from the full system, not from "many agents" alone.

---

## Current Product Shape

Today the codebase is strongest at:

- single-project workflow orchestration
- landing-page planning and section generation
- theme generation
- AI image generation
- section-level document rendering
- basic editor capabilities

Today the codebase is weakest at:

- multi-page site architecture
- form system
- site-wide navigation and shared layout
- advanced editing model
- worker-based generation infrastructure
- asset/storage architecture for scale
- publish/deploy architecture
- operational scalability

---

## Core Product Principles

To keep the product cheaper and faster, the roadmap should follow these principles:

1. Structured data before raw code.
2. Generate site documents, not arbitrary apps.
3. Use staged orchestration before true multi-agent autonomy.
4. Prefer deterministic renderers over AI-generated HTML where possible.
5. Use one strong review/repair pass before introducing many agents.
6. Centralize site-wide theme, navigation, and reusable actions.
7. Push heavy work to background workers.
8. Use cloud storage and managed infrastructure early enough to avoid later rewrites.
9. Keep user edits first-class; AI is an accelerator, not the only interface.
10. Avoid expensive execution sandboxes until the website-builder core is proven.

---

## Feature Inventory Needed To Feel Similar To Base44 / Bolt / Emergent

This section lists the major feature categories that materially increase product capability.

## 1. AI Website Generation

The builder should support:

- landing pages
- multi-page brochure sites
- service businesses
- local businesses
- personal brands
- agencies
- SaaS marketing sites
- event or workshop pages
- lead-generation funnels

Required generation outputs:

- homepage
- about page
- services page
- contact page
- pricing page
- FAQ page
- thank-you page
- legal pages

Advanced generation outputs:

- campaign pages
- location pages
- industry-specific pages
- comparison pages
- waitlist pages
- webinar pages

## 2. Site Planning

The AI should generate:

- site map
- page goals
- section sequence per page
- site-wide navigation
- footer structure
- CTA strategy
- internal link strategy
- suggested forms
- image slots and asset plan
- SEO intent per page

This planning layer is critical because broad products feel intelligent when they understand the whole site, not only one page.

## 3. Theme And Brand System

Must support:

- color palette generation
- typography pairing
- spacing scale
- radius/shadow system
- button variants
- card/input variants
- icon style direction
- site-wide component styling
- theme variants per project

Advanced version:

- multiple suggested themes per project
- one-click global theme restyle
- section-level visual variants constrained by site theme
- theme locking so regenerations do not break visual consistency

## 4. Forms

Must support:

- contact forms
- lead capture forms
- quote request forms
- newsletter forms
- booking inquiry forms
- waitlist forms

Core features:

- typed field schema
- required/optional fields
- validation rules
- inline error states
- success state
- spam protection
- submission storage
- email notification
- webhook action

Advanced version:

- multi-step forms
- conditional fields
- hidden metadata fields
- source/campaign tagging
- file upload fields
- custom redirect on submit
- CRM integration

## 5. Asset And Image System

Must support:

- AI-generated images
- uploads
- replacements
- alt text
- per-asset metadata
- reusable asset library per project
- asset slot binding to sections

Advanced version:

- logo handling
- favicon generation
- OG image generation
- image cropping/focal point
- multiple image variants per slot
- brand-safe image prompt generation
- image regeneration with art direction controls

## 6. Advanced Editing Experience

To feel competitive, the editor needs to go far beyond simple section editing.

Must support:

- add section
- remove section
- duplicate section
- reorder section
- hide/show section
- switch section variant
- inline text editing
- item list editing
- button editing
- action editing
- image replacement
- background/style editing
- mobile/tablet/desktop preview

Advanced version:

- element-level editing inside sections
- drag-and-drop block movement
- insert block inside section
- duplicate cards/items
- adjust alignment/layout controls
- section padding and spacing controls
- typography controls
- color controls with theme-safe constraints
- responsive visibility controls
- animation/reveal presets
- undo/redo
- change history
- per-page structure editor
- page settings panel
- site-wide settings panel
- reusable section templates
- save section as reusable pattern

## 7. AI Editing Capabilities

The product should not only generate pages once. It must support iterative AI-assisted editing.

Core AI editing:

- regenerate section
- rewrite headline
- rewrite body copy
- rewrite CTA
- shorten text
- change tone
- make copy more premium / friendly / urgent / local
- add or remove sections
- suggest stronger social proof
- rewrite for a target audience

Advanced AI editing:

- "make this page feel more modern"
- "add a pricing section"
- "turn this into a local service page"
- "create 3 variants of this hero"
- "convert this contact form into a quote request form"
- "create an About page from the homepage content"
- "replace weak copy across the whole site"
- "make all CTAs consistent"
- "improve SEO for plumber in Austin"

The advanced version needs structured diff-based updates, not full-page regeneration every time.

## 8. Page And Site Management

Must support:

- multiple pages per site
- create page
- duplicate page
- rename page
- reorder nav
- set homepage
- draft/published status
- slug editing
- SEO fields
- social preview metadata

Advanced version:

- folders or page groups
- utility pages
- hidden pages not in nav
- localized page variants
- scheduled publish
- page version history
- rollback

## 9. Publishing And Hosting

Must support:

- publish site
- preview before publish
- public URL
- custom domain
- SSL
- asset delivery
- page caching

Advanced version:

- staged preview URLs
- branch previews
- rollback publish
- CDN invalidation
- webhooks on publish
- team approval before publish

## 10. Reusable Action System

Every product in this category benefits from reusable actions.

Actions should support:

- URL
- scroll target
- phone call
- email
- WhatsApp
- form open
- file download
- calendar/book call link

Advanced version:

- analytics labels
- event tracking metadata
- action reuse across site
- action validation

## 11. SEO System

Must support:

- title
- meta description
- social share metadata
- heading structure sanity
- image alt text
- basic schema markup

Advanced version:

- keyword targeting by page
- internal linking suggestions
- local business schema
- FAQ schema
- service schema
- SEO score and repair suggestions

## 12. Collaboration And Workflow

Later-stage parity features:

- multiple users per workspace
- comments
- approvals
- edit history
- activity log
- role permissions

This is important eventually, but not required for the first major product expansion.

## 13. Templates And Starting Points

Must support:

- industry-specific starting kits
- page-type presets
- section presets
- AI + template hybrid generation

Advanced version:

- agency reusable kits
- saved brand kits
- saved site blueprints

## 14. Analytics And Conversion Features

Useful features once the builder core is stable:

- form conversion analytics
- CTA click analytics
- traffic tracking hooks
- heatmap/integration support
- lead-source attribution

These should come after the core editor and publish flows.

---

## Advanced Editing Capability Spec

This section defines the more advanced editor layer that would make the product feel meaningfully stronger than a basic section editor.

## A. Site-Level Editing

Users should be able to edit:

- site name
- logo
- favicon
- theme
- header nav
- footer links
- contact details
- social links
- site-wide CTA label and destination
- default SEO settings

## B. Page-Level Editing

Users should be able to edit:

- page title
- slug
- page purpose
- page SEO
- visibility in nav
- page-level layout settings
- assigned template or variant

## C. Section-Level Editing

Users should be able to:

- add section from library
- regenerate section
- duplicate section
- reorder section
- change variant
- toggle visibility
- edit style controls
- swap media

## D. Element-Level Editing

Users should be able to directly edit:

- headings
- paragraphs
- bullet items
- cards
- FAQ items
- pricing plans
- testimonials
- stats
- badges
- buttons
- form fields
- trust items

This is where the current product needs significant expansion to feel premium.

## E. Layout And Responsive Controls

Users should be able to control:

- section spacing
- container width
- columns
- alignment
- stacking order on mobile
- hide on mobile/tablet/desktop
- image ratio
- button grouping

## F. Theme-Safe Styling Controls

Users should be able to make visual changes without breaking design consistency.

Recommended controls:

- choose from theme tokens, not arbitrary hex by default
- typography presets
- surface/background presets
- emphasis levels
- section mood variants
- density presets

This gives flexibility without letting users destroy the design system.

## G. AI-In-The-Editor

Users should be able to select a page, section, or element and ask AI to:

- rewrite
- shorten
- expand
- simplify
- localize
- make more persuasive
- make more premium
- tailor to audience
- generate alternatives
- fix consistency

---

## Recommended Architecture Direction

To keep the platform cheaper and faster, the recommended architecture is:

## 1. Canonical Structured Site Model

The canonical source of truth should be a structured site document, not raw generated HTML.

Recommended top-level entities:

- `Site`
- `Page`
- `PageDocument`
- `Section`
- `Action`
- `Asset`
- `Form`
- `FormSubmission`
- `Theme`
- `PublishTarget`

Generated HTML should be a render artifact, not the primary editable source.

## 2. Staged AI Orchestration, Not Agent Swarm

Recommended generation pipeline:

1. intake and inference
2. site planning
3. theme generation
4. asset planning
5. page planning
6. section generation
7. form generation
8. image prompt generation
9. image generation
10. review and repair
11. render and save

This is cheaper and easier to maintain than autonomous multi-agent loops.

## 3. Review / Repair Pass

Before final render, run a deterministic and AI-assisted validation pass that checks:

- empty fields
- broken actions
- duplicate or weak headings
- missing contact points
- missing legal/footer basics
- invalid form structures
- poor section order
- style inconsistencies

One high-quality repair layer is usually more valuable than adding several extra agents.

## 4. Worker-Based Execution

Long-running generation should move to background workers.

Needed capabilities:

- durable jobs
- retries
- cancellation
- backoff
- concurrency control
- job progress streaming

## 5. Cloud Asset Storage

Use object storage for uploads and generated images.

Do not rely on local `public/uploads` for a serious multi-user product.

## 6. Multi-Tenant Production Data Layer

Move to Postgres and design for multi-tenant concurrency.

SQLite is appropriate for local development, not for large-scale production.

---

## Cost And Speed Strategy

If the product should be cheaper and faster, decisions must be made deliberately.

## What Keeps It Cheap

- structured generation over raw code generation
- reuse a consistent schema and renderer
- smaller prompts with focused tasks
- staged generation instead of one huge prompt
- targeted regeneration instead of full-site rebuilds
- one reviewer/repair pass instead of many debating agents
- deterministic rendering
- managed cloud infra instead of custom orchestration too early
- template hybrids where useful

## What Keeps It Fast

- minimal kickoff inputs
- background workers
- streaming progress updates
- page-by-page generation
- section-level regeneration
- reuse of previously generated assets and actions
- caching of reusable prompt components
- fast preview render pipeline

## What Makes It Expensive Too Early

- arbitrary code execution per user
- full browser IDE model
- many-agent orchestration without strong need
- generating entire apps instead of websites
- unrestricted custom component systems
- deep third-party integration matrix in v1

---

## Build Priorities

The roadmap should be split into phases that maximize capability quickly without dragging the system into platform complexity too early.

## Phase 1: From Landing Page To Multi-Page Website Builder

Primary goal:

Turn the current product into a strong AI multi-page business website builder.

Deliver:

- `Site` model and multi-page relationships
- page types beyond landing page
- shared header/footer/navigation
- site-wide theme system
- page planning and generation per page
- better editor support for multiple pages
- draft and published page/site states
- basic SEO fields
- stronger asset management

Must-have outcomes:

- user can generate a whole small business website
- user can edit multiple pages
- user can publish a coherent site

## Phase 2: Forms + Better Editing + Better AI Revision

Primary goal:

Make the output much more useful for real business use cases.

Deliver:

- typed forms
- submissions storage
- email notifications
- webhook support
- page-level and element-level editing
- stronger style controls
- AI rewrite tools inside editor
- history / undo foundations
- improved section library and reusable patterns

Must-have outcomes:

- user can collect leads
- user can refine content deeply without restarting generation
- product feels significantly more serious than a simple AI page generator

## Phase 3: Reliability, Scale, And Cheaper Operations

Primary goal:

Make the platform production-safe and cost-aware.

Deliver:

- Postgres migration
- background queue and workers
- object storage for assets
- rate limiting and abuse protection
- job concurrency controls
- observability and token/cost tracking
- prompt/system caching where valid
- improved publish pipeline

Must-have outcomes:

- stable multi-user generation
- predictable ops
- lower cost per successful site

## Phase 4: Premium Capabilities That Increase Product Defensibility

Primary goal:

Add higher-leverage features that make the product feel closer to top AI builders.

Deliver:

- review/repair generation pass
- reusable kits and templates
- stronger AI editing commands
- full page duplication and transformation flows
- theme restyling
- image art-direction controls
- conversion and SEO improvement suggestions
- collaboration primitives

Must-have outcomes:

- better quality
- stronger repeat usage
- more "agentic" feel without turning into chaos

---

## Suggested Feature Backlog

This is the implementation backlog in recommended order.

## Tier 1: Highest Leverage

- multi-page site model
- shared navigation and footer
- page planner
- page generator
- site settings
- stronger editor page management
- Postgres migration
- worker/job system
- cloud asset storage

## Tier 2: Core Product Depth

- forms engine
- form submissions
- email notifications
- webhook actions
- advanced element editing
- richer style controls
- AI in-editor rewrite tools
- SEO controls
- publish improvements

## Tier 3: Premium Experience

- review/repair pass
- reusable patterns
- one-click restyling
- advanced image controls
- page transformation commands
- industry starter kits
- analytics hooks

## Tier 4: Later Expansion

- collaboration
- approvals
- comments
- localization
- scheduled publish
- advanced integrations
- code export

---

## What To Explicitly Avoid Right Now

To keep execution disciplined, avoid these until the earlier phases are working well:

- full freeform code-generation IDE
- autonomous multi-agent swarm
- per-user arbitrary code sandbox
- plugin ecosystem
- very broad CMS capabilities
- advanced app/database builders

These can be valid later, but they are not the fastest route to a strong website-builder business.

---

## Design-Driving Features

Not all features affect product design equally.

Some can be added later with limited UI disruption.
Some force an early change in navigation, editor layout, panel structure, and mental model.

Those design-driving features should be decided early so the product shell does not need major redesigns later.

## The Most Important Early Design Decision

The feature that should drive design earliest is:

`multi-page site architecture with a site-aware editor shell`

This matters more than forms, AI image generation, or advanced AI commands because it changes the entire product shape.

If the UI is designed around:

- one page
- one vertical section stack
- one section inspector

then later additions like multiple pages, shared header/footer, navigation management, page settings, forms, SEO, and publish workflows will all feel bolted on.

If the UI is designed early around:

- one site
- many pages
- shared global settings
- page structure plus section structure

then later features fit naturally.

## Why Multi-Page Changes Design So Early

It forces decisions about:

- left navigation structure
- page switching
- site-level settings vs page-level settings
- shared header/footer editing
- page creation flows
- SEO surface placement
- publish experience
- preview structure
- where forms live
- how AI generation progress is shown per page or per site

This is not just a data-model change. It is the core UX model.

## Recommended Early Product Shell

The product shell should evolve toward a three-level editing model:

1. site level
2. page level
3. section / element level

Recommended editor layout:

- left rail for site map and page list
- center canvas for current page preview/editing
- right inspector for selected site/page/section/element settings
- top bar for mode, preview, device switcher, publish state, and AI actions

This shell can support almost every major feature in the roadmap without needing a redesign.

## Features That Strongly Influence Design Early

These are the features that should influence UI structure now, even if their implementation comes later.

### 1. Multi-Page Site Architecture

Design impact:

- requires site map / page list in UI
- requires current page context in editor
- requires shared and per-page settings surfaces
- requires broader publish and preview flows

Decision:

- must shape the shell immediately

### 2. Shared Header / Footer / Navigation

Design impact:

- introduces global editable regions
- requires distinction between site-wide elements and page-specific content
- affects preview and editing affordances

Decision:

- should be considered with multi-page design from the start

### 3. Advanced Editor Model

Design impact:

- affects whether the right panel is section-only or multi-scope
- affects whether the center canvas supports direct selection of nested elements
- affects whether the left panel contains structure, layers, or only add-section controls

Decision:

- should influence shell design early, even if advanced controls ship gradually

### 4. Forms Subsystem

Design impact:

- introduces special editing states for fields, validation, submission behavior, and success states
- requires a settings model broader than plain text/media editing

Decision:

- should influence inspector design early
- does not need to define the whole shell by itself

### 5. Theme / Site Design System

Design impact:

- requires global style controls
- requires a clear separation between theme tokens and one-off section overrides
- affects how the right panel is organized

Decision:

- should be represented in the shell from the beginning

### 6. AI In-Editor Commands

Design impact:

- affects top bar actions, quick actions, context menus, and selected-element workflows

Decision:

- should influence interaction patterns early
- does not need to drive the full layout before multi-page/site structure

## Features That Can Come Later Without Breaking The Shell

These matter, but they do not need to define the earliest UI architecture:

- better image generation controls
- analytics integrations
- advanced SEO scoring
- collaboration comments
- scheduled publishing
- localization
- conversion analytics
- template marketplace

These can fit into a strong site-aware editor shell later.

## Recommended Design-First Implementation Order

If the goal is to avoid redesign churn, the design work should be driven in this order:

1. site-aware editor shell
2. multi-page page list and routing inside editor
3. global header/footer/navigation editing model
4. right-panel information architecture for site/page/section/element scopes
5. theme/settings surface
6. forms editing surface
7. AI editing actions and contextual menus

This means design should start from the editor shell, not from adding more section types.

## Proposed UI Information Architecture

Recommended top-level editing scopes:

- `Site`
- `Pages`
- `Page`
- `Section`
- `Element`
- `Theme`
- `Forms`
- `Assets`
- `SEO`
- `Publish`

Recommended left rail:

- site overview
- pages
- assets
- forms
- theme
- publish

Recommended canvas modes:

- edit
- preview
- mobile
- tablet
- desktop

Recommended right panel tabs depending on selection:

- content
- style
- layout
- actions
- advanced

## The First Feature To Detail Next

The first feature that should be broken into a deeper implementation spec is:

`multi-page site architecture + site-aware editor shell`

Reason:

- it has the largest effect on product design
- it reshapes both data model and UX
- it determines how forms, assets, SEO, and theme settings fit later
- it reduces the risk of rebuilding the editor shell twice

After that, the next detailed specs should be:

1. shared header/footer/navigation model
2. theme and site settings model
3. forms subsystem
4. advanced element-level editor
5. AI in-editor revision tools

---

## Success Criteria

The product should be considered meaningfully evolved when a user can:

1. enter minimal business info
2. receive a full multi-page site draft
3. get AI-generated imagery and structured forms
4. edit pages deeply without breaking design consistency
5. publish the site cleanly
6. regenerate or refine specific parts quickly
7. do all of this with a system that feels fast and dependable

If those outcomes are achieved, the product will already be much closer to the class of products being referenced, while still staying on a cheaper and more pragmatic architecture path.

---

## Recommendation

The best next implementation direction is:

1. multi-page site architecture
2. forms subsystem
3. worker-based generation
4. cloud assets
5. advanced editor
6. review/repair pass

That sequence is the shortest path from the current codebase to a significantly more capable AI website builder.
