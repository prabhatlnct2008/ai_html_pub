# Claude Build Prompt: Multi-Page Site Architecture + Site-Aware Editor Shell

## Purpose

Use this prompt as the exact instruction set to give Claude for the next major feature:

`multi-page site architecture + site-aware editor shell`

This is the highest-leverage feature because it changes the product shell early and determines how later features like forms, assets, SEO, and advanced editing fit into the system.

---

## Copy-Paste Prompt For Claude

```md
You are working inside this repo as the implementation agent.

Your task is to design and prepare the feature:

`multi-page site architecture + site-aware editor shell`

Before making implementation changes, you must create a planning document and wait for review.

Read these documents first:

1. `features/base44_style_website_builder_feature_roadmap.md`
2. `features/v2_full_fledged_landing_page_builder_spec.md`
3. `features/v2_full_fledged_landing_page_builder_plan.md`
4. the current relevant editor, workflow, schema, and builder files

## Primary Goal

Evolve the product from a single-page landing-page editor into a site-aware website builder with:

- one site containing multiple pages
- shared global regions like header/footer/navigation
- a site-aware editor shell
- clear distinction between site-level, page-level, section-level, and element-level editing

The feature should be designed so that later additions like forms, assets, theme controls, SEO, publish controls, and AI editing fit naturally without redesigning the shell.

## Hard Requirements

Before implementation, create a planning doc named:

`features/planning_phase_multi_page_site_architecture.md`

This file must include:

1. purpose and scope
2. current-state analysis
3. proposed data model changes
4. route and UI architecture changes
5. editor information architecture
6. workflow implications
7. migration strategy from existing single-page projects
8. API changes
9. persistence changes
10. state management changes
11. phased implementation sequence
12. risk list
13. acceptance criteria
14. out-of-scope items

Do not start implementation immediately after writing the planning doc.

After writing the planning doc:

1. summarize the proposed plan
2. explicitly ask for review/approval
3. stop and wait

Do not start coding until the plan is reviewed.

## Functional Testing Deliverables

As part of the planning work, also create a functional test checklist file named:

`features/functional_testing_multi_page_site_architecture.csv`

Use the same style as the existing functional test files in `features/`.

This test checklist must be screen-oriented and easy for a human to run manually.

It must cover at least:

### Site Shell

- editor loads in site-aware mode
- left rail shows site pages
- current page selection works
- top bar shows site/page context
- right panel changes based on selected scope

### Page Management

- create page
- rename page
- duplicate page
- delete page
- reorder page
- set homepage
- hide page from nav

### Shared Regions

- header editing
- footer editing
- global navigation editing
- site-wide CTA editing

### Page Editing

- switching pages updates canvas
- per-page SEO settings
- per-page slug editing
- page-level publish status

### Section Editing

- add section on a specific page
- reorder section
- duplicate section
- hide/show section
- variant switch

### Selection Model

- site selected
- page selected
- section selected
- nested element selected
- right inspector reflects current selection type

### Preview And Device Modes

- desktop
- tablet
- mobile
- switching preview across different pages

### Backward Compatibility

- old single-page projects still open
- migration creates a default homepage if needed
- published pages continue rendering

### Persistence

- save changes
- refresh and retain changes
- page additions persist
- nav changes persist

### Error And Edge Cases

- empty site
- many pages
- long page names
- duplicate slugs
- delete homepage handling

## Design Direction

Design the editor shell around these scopes:

- Site
- Pages
- Page
- Section
- Element
- Theme
- Assets
- Forms
- SEO
- Publish

Recommended shell:

- left rail: site map, pages, major project entities
- center: current page canvas
- right panel: contextual inspector
- top bar: preview/device/AI actions/save/publish

Do not keep the system conceptually locked to a single vertical section stack.

## Architecture Direction

Prefer:

- structured data model
- deterministic rendering
- staged orchestration
- minimal overengineering

Avoid:

- autonomous multi-agent swarm
- arbitrary freeform code generation
- heavy redesigns that do not align to the existing product direction

## Important Constraints

- Preserve existing product patterns where they are still valid.
- Do not regress current generation and editor flows unnecessarily.
- Think carefully about migration from current `Project -> Page` assumptions.
- The solution should support later features like forms, shared assets, SEO, and AI editing without major shell redesign.

## Output Format

Your first response in this task should:

1. confirm you read the relevant docs/code
2. create `features/planning_phase_multi_page_site_architecture.md`
3. create `features/functional_testing_multi_page_site_architecture.csv`
4. summarize the plan
5. explicitly request review before implementation

Do not implement code until the planning document is reviewed.
```

---


---

## Expected Review Standard For The Planning Doc


---

---
