# Tailwind HTML Generator Code Explaination

This file explains what happens when you run the Tailwind CLI generator:

```bash
python3.11 sandbox/unit_cli_html_generator/generate_html_tailwind.py \
  --name "..." \
  --description "..." \
  --output sandbox/unit_cli_html_generator/output/example.html
```

It focuses on:

- which modules get called
- what each module does
- what files are written
- where RAG is used

## 1. Main Entry Point

The command starts in:

- `sandbox/unit_cli_html_generator/generate_html_tailwind.py`

Main function:

- `main()`

This file is the Tailwind-specific CLI wrapper. It does two things:

1. Reuses most of the planning / prompting / validation logic from `generate_html.py`
2. Uses its own Tailwind renderer instead of the Bootstrap-like renderer in `generate_html.py`

So the actual flow is:

- CLI parsing happens in `generate_html_tailwind.py`
- most AI phases and validators live in `generate_html.py`
- final HTML rendering for Tailwind happens back in `generate_html_tailwind.py`

## 2. Modules Involved

### `generate_html_tailwind.py`

Purpose:

- Tailwind CLI entrypoint
- Tailwind HTML renderer
- final output writing

Important functions:

- `main()`: orchestrates the full run
- `render_page(...)`: builds final full HTML document
- `render_section(...)`: renders each page section into Tailwind HTML
- `build_navigation(...)`: decides nav links for final HTML

### `generate_html.py`

Purpose:

- shared generator core used by both HTML renderers
- prompt text
- OpenAI call helpers
- validation / normalization
- section rewriting and review logic

Important functions:

- `load_env_var(...)`: loads `OPENAI_API_KEY`
- `phase_chat_json(...)`: wrapper around one LLM phase with retry + validation + prompt logging
- `get_variant_guidance(...)`: loads Tailwind section guidance from Tailwind RAG
- `get_business_guidance(...)`: loads business guidance from business playbook RAG
- `review_and_improve_design_brief(...)`: reviews and optionally rewrites the design brief
- `write_sections_with_keywords(...)`: rewrites each section with keyword targets and Tailwind RAG guidance
- `review_and_regenerate_sections(...)`: checks each section and rewrites weak ones
- `ensure_defaults(...)`: fills any missing schema fields before rendering

### `rag_tailwind.py`

Purpose:

- stores and retrieves section-variant implementation guidance

Used during generation through:

- `format_guidance_for_prompt(...)`

This helps when writing section content for a specific section type and variant like:

- `hero / background-image`
- `services / image-cards`
- `testimonials / single-highlight`

### `rag_business_playbooks.py`

Purpose:

- stores and retrieves business-type guidance

Used during generation through:

- `format_business_guidance_for_prompt(...)`

This gives higher-level business context such as:

- buyer behavior
- architecture suggestions
- trust needs
- homepage direction

## 3. Full Runtime Flow

When you run the Tailwind command, `generate_html_tailwind.py` does the following:

### Step 0: Parse CLI args and prepare output path

In `generate_html_tailwind.py`:

- parses `--name`
- parses `--description`
- parses optional `--location`
- parses optional `--audience`
- parses `--output`
- parses `--rag-dir`
- parses `--business-rag-dir`

Then it:

- loads `OPENAI_API_KEY`
- creates the output folder if needed
- initializes `prompt_log = []`

At this point no HTML is written yet.

### Step 1: Infer business context

Called from:

- `core.phase_chat_json(...)`

Uses from `generate_html.py`:

- `INFER_CONTEXT_SYSTEM`
- `infer_context_user_prompt(...)`
- `validate_inferred_context(...)`

This creates a normalized `business_context` object containing things like:

- business name
- business type
- target audience
- primary CTA
- tone
- page type
- main offer
- location
- differentiators
- trust drivers
- likely objections
- visual style hints

Output variable:

- `business_context`

### Step 2: Plan the site

Called from:

- `core.phase_chat_json(...)`

Uses:

- `SITE_PLANNER_SYSTEM`
- `site_planner_user_prompt(...)`
- `validate_site_plan(...)`

Before this phase, the code may fetch business-playbook RAG guidance using:

- `core.get_business_guidance(...)`

This phase creates:

- `site_plan`

This includes:

- overall site goal
- pages
- homepage flag
- suggested sections for pages

Important note:

- this is a site-level plan, not yet the final homepage content

### Step 2.5: Build keyword strategy

Called from:

- `core.phase_chat_json(...)`

Uses:

- `KEYWORD_STRATEGY_SYSTEM`
- `keyword_strategy_user_prompt(...)`
- `validate_keyword_strategy(...)`

This creates:

- `keyword_strategy`

This is used later to make section content more specific and commercially relevant.

### Step 3: Generate shared settings

Called from:

- `core.phase_chat_json(...)`

Uses:

- `SHARED_SETTINGS_SYSTEM`
- `shared_settings_user_prompt(...)`
- `validate_shared_settings(...)`

This creates:

- `shared_settings`

Typical fields:

- brand colors
- fonts
- actions / CTA definitions
- navigation
- footer structure
- `themeVariant`
- `designMode`

This object is one of the biggest inputs into the final visual style.

### Step 3.5: Generate homepage design brief

Called from:

- `core.phase_chat_json(...)`

Uses:

- `DESIGN_PLANNER_SYSTEM`
- `design_planner_user_prompt(...)`
- `validate_design_brief(...)`

This creates:

- `design_brief`

Then the code immediately reviews it using:

- `review_and_improve_design_brief(...)`

That function:

1. runs a review phase
2. if the review fails, runs a rewrite phase
3. returns the improved design brief

This is meant to make the design direction more concrete before page planning.

### Step 4: Plan the homepage

The code finds the homepage from `site_plan` and then runs:

- `core.phase_chat_json(...)`

Uses:

- `PAGE_PLANNER_SYSTEM`
- `page_planner_user_prompt(...)`
- `validate_page_plan(...)`

This creates:

- `page_plan`

This is the page-level section sequence, for example:

- hero
- trust-bar
- services
- testimonials
- faq
- footer

Then it runs:

- `core.enforce_design_on_page_plan(...)`

This may adjust the plan based on the design brief.

### Step 4.5: Assign section keywords

Called from:

- `core.phase_chat_json(...)`

Uses:

- `SECTION_KEYWORD_SYSTEM`
- `section_keyword_user_prompt(...)`
- `validate_section_keyword_plan(...)`

This creates:

- `section_keyword_plan`

That maps each section type to keyword targets.

### Step 5: Generate the homepage document

Called from:

- `core.phase_chat_json(...)`

Uses:

- `PAGE_GENERATOR_SYSTEM`
- `page_generator_user_prompt(...)`
- `validate_page_document(...)`

This creates the first full page document:

- `page_doc`

At this point `page_doc` contains all sections and their schema-safe content.

But this is not the final version yet.

## 4. Post-Generation Rewrite and Review

After initial `page_doc` generation, the code does two more passes from `generate_html.py`.

### Pass A: Rewrite each section with keyword targets

Function:

- `write_sections_with_keywords(...)`

What it does:

1. looks up keyword targets for each section
2. retrieves Tailwind variant RAG guidance with `get_variant_guidance(...)`
3. rewrites each section using:
   - business context
   - shared settings
   - design brief
   - section keyword targets
   - Tailwind section RAG guidance
   - business RAG guidance

This is where section-specific writing becomes more detailed and more variant-aware.

### Pass B: Review and regenerate weak sections

Function:

- `review_and_regenerate_sections(...)`

What it does:

1. reviews each section using `SECTION_REVIEW_SYSTEM`
2. checks whether the section has enough substance
3. rewrites the section if:
   - the review fails
   - or the section is too thin

This is effectively a quality gate before rendering.

### Pass C: Fill defaults

Function:

- `ensure_defaults(...)`

What it does:

- makes sure required section fields exist
- normalizes content structure
- fills missing style defaults
- ensures IDs, order, and schema-safe content are present

This protects the renderer from incomplete section data.

## 5. Tailwind Rendering

After all AI and validation phases are done, `generate_html_tailwind.py` renders the final HTML.

### `render_page(...)`

This function builds:

- full HTML document
- `<head>`
- Tailwind CDN setup
- color config
- body
- sticky header
- main content

It also uses:

- `build_navigation(...)`
- `get_nav_cta(...)`

### `render_section(...)`

This is the most important rendering function.

It reads each section object and produces Tailwind HTML for section types like:

- hero
- trust-bar
- features
- benefits
- services
- testimonials
- results
- pricing
- faq
- cta-band
- contact
- gallery
- service-area
- about-team
- footer

This is where visual sameness or visual variation usually comes from, because the renderer decides:

- which layout is used
- which Tailwind classes are used
- how variants are visually interpreted

### `designMode` and `themeVariant`

The Tailwind renderer now reads:

- `shared_settings["themeVariant"]`
- `shared_settings["designMode"]`

Those influence page-level styling such as:

- body background
- nav style
- hero frame
- card treatment
- footer treatment
- radius and surface feel

## 6. Files Written During the Run

For an output like:

- `sandbox/unit_cli_html_generator/output/example.html`

The code writes 3 files:

### 1. Final HTML file

Written by:

- `inputs.output.write_text(html, encoding="utf-8")`

Example:

- `example.html`

Contains:

- final standalone Tailwind HTML

### 2. Trace file

Written by:

- `trace_path.write_text(...)`

Example:

- `example.trace.json`

Contains:

- model name
- renderer type
- `business_context`
- `site_plan`
- `keyword_strategy`
- `shared_settings`
- `design_brief`
- `page_plan`
- `section_keyword_plan`
- rag directory paths
- final `page_document`

This is the best file to inspect when you want to understand what the pipeline decided.

### 3. Prompt log file

Written by:

- `prompt_log_path.write_text(...)`

Example:

- `example.prompts.json`

Contains one entry per LLM phase, usually including:

- phase name
- attempt number
- system prompt
- user prompt
- validated response JSON
- validation error if any

This is the best file to inspect when you want to understand why the model made a decision.

## 7. Optional RAG Build Files

These are not called during a normal Tailwind generation run, but they support it.

### Tailwind guide build path

Files:

- `build_tailwind_rag.py`
- `rag_tailwind.py`
- `section_variant_registry.md`
- `tailwind_variant_guide.md`

Purpose:

- build the ChromaDB index used for Tailwind section guidance

Persist dir:

- usually `sandbox/unit_cli_html_generator/chroma_db`

### Business playbook build path

Files:

- `build_business_playbook_rag.py`
- `rag_business_playbooks.py`
- `business_playbook_guide.md`

Purpose:

- build the ChromaDB index used for business-level guidance

Persist dir:

- usually `sandbox/unit_cli_html_generator/chroma_business_playbooks`

## 8. Mental Model: What Decides What

If you want to debug output quality, this is the practical split:

### Business framing

Mostly decided by:

- `infer_context`
- business playbook RAG

### Page structure

Mostly decided by:

- `site_plan`
- `page_plan`
- `enforce_design_on_page_plan(...)`

### Visual direction

Mostly decided by:

- `shared_settings`
- `design_brief`
- Tailwind renderer in `generate_html_tailwind.py`

### Section copy quality

Mostly decided by:

- `page_document`
- `write_sections_with_keywords(...)`
- `review_and_regenerate_sections(...)`

### Final look in the browser

Mostly decided by:

- `render_page(...)`
- `render_section(...)`

That last part is important: prompts can differ, but if the renderer maps everything into the same layouts, the sites will still look similar.

## 9. Quick Debug Checklist

When a generated site looks wrong, inspect files in this order:

1. `example.trace.json`
   Check:
   - `shared_settings`
   - `design_brief`
   - `page_plan`
   - `page_document`

2. `example.prompts.json`
   Check:
   - whether the model was asked the right thing
   - whether it returned something generic

3. `generate_html_tailwind.py`
   Check:
   - whether `render_section(...)` is visually collapsing different variants into the same HTML pattern

## 10. Short Summary

When you run the Tailwind generator:

1. CLI input is parsed in `generate_html_tailwind.py`
2. Planning and validation phases run through shared core logic in `generate_html.py`
3. Optional RAG guidance is pulled from:
   - `rag_tailwind.py`
   - `rag_business_playbooks.py`
4. A structured `page_doc` is generated, rewritten, reviewed, and normalized
5. Tailwind HTML is rendered in `generate_html_tailwind.py`
6. Three files are written:
   - `.html`
   - `.trace.json`
   - `.prompts.json`

If you want to understand why one particular output looks the way it does, the fastest path is:

- open the `.trace.json`
- then open the matching `.prompts.json`
- then compare those decisions against `render_section(...)` in `generate_html_tailwind.py`
