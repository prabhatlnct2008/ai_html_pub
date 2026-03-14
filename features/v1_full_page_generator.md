Yes. At this point, you should move from "chat generates sections" to a more intentional content-and-layout system. You do not need a huge multi-agent system yet, but you do need stronger orchestration than you have now.

My view:
* Don't build a fancy agent swarm first.
* Do build a structured workflow engine with specialized generation stages.
* Treat "full-fledged landing page" as a document system with schema, assets, variants, and rendering rules, not just chat output.

What To Build

A real v1 full-fledged landing page generator should have these product capabilities:

1. Page types
   * local business
   * service business
   * SaaS/startup
   * coach/personal brand
   * product sales page

2. Theme variants
   * clean/professional
   * bold/high-conversion
   * premium/luxury
   * playful/friendly

3. Rich section library
   * hero
   * logo strip / trust bar
   * benefits
   * features grid
   * problem/solution
   * how it works
   * services
   * testimonials
   * results / case studies
   * pricing / packages
   * FAQ
   * CTA band
   * contact
   * service area / map
   * footer

4. Media support
   * hero image
   * section images
   * icon/image cards
   * gallery
   * background image support
   * uploaded user images
   * AI/placeholder image slots if user has not uploaded assets

5. Editing system
   * add section from library
   * choose section variant
   * reorder sections
   * duplicate/delete sections
   * edit every text field
   * replace/upload images
   * global styling controls
   * preview desktop/mobile
   * save versions

6. Publish quality
   * SEO metadata
   * footer/legal/contact consistency
   * accessible headings/buttons/alt text
   * responsive layout
   * consistent CTA strategy

What "Full-Fledged Output" Means

The generated page should be publishable with minor edits only.

For example, for a dog training business, default generated structure should look like:

1. Hero with headline, subheadline, CTA buttons, supporting dog image
2. Trust strip with "happy owners trained", service areas, WhatsApp/contact badge
3. Services section
4. Why choose us / differentiators
5. Training approach / how it works
6. Results or transformation section
7. Testimonials
8. FAQ
9. Final CTA
10. Contact/service area
11. Footer

If the generator cannot produce that whole experience, including visuals and footer, it is still incomplete.

Recommended Architecture

You should move to a schema-driven architecture.

Core concept:
* Generate a PageDocument
* Render from PageDocument
* Edit PageDocument
* Save versioned PageDocument

Suggested canonical model:

```
type PageDocument = {
  meta: {
    title: string
    description: string
    pageType: string
    themeVariant: string
  }
  brand: {
    tone: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontHeading: string
    fontBody: string
    logoUrl?: string
  }
  assets: {
    images: Asset[]
    icons: Asset[]
  }
  sections: Section[]
}

type Asset = {
  id: string
  kind: "image" | "icon" | "video"
  source: "upload" | "stock" | "ai" | "placeholder"
  url: string
  alt?: string
}

type Section = {
  id: string
  type: string
  variant: string
  visible: boolean
  content: Record<string, unknown>
  style: Record<string, unknown>
  assets?: {
    imageIds?: string[]
    backgroundImageId?: string
    iconIds?: string[]
  }
}
```

This is the right center of gravity. Not raw HTML. Not free-form AI JSON every time.

Generation Pipeline

Claude should build the generator as a pipeline, not one giant prompt.

Recommended stages:

1. Intake extraction
2. Business profile normalization
3. Page strategy generation
4. Section plan generation
5. Theme selection
6. Asset plan generation
7. Section content generation
8. Final document assembly
9. HTML render
10. Editor handoff

This is agentic enough for now.

Do You Need Agentic Architecture Now?

Yes, but only in a controlled way.

You do not need:
* autonomous long-running multi-agent debate
* many independent agents talking to each other
* planner/critic/researcher swarm complexity

You do need:
* staged orchestration
* specialized generators per phase
* deterministic transitions
* persisted workflow state
* retryable steps
* structured outputs at every stage

So the answer is:
* Yes to orchestration
* No to overcomplicated multi-agent architecture

Think of it as a workflow engine with specialist modules, not an "AI society".

Good v1 Architecture

Use one orchestrator with specialist services:

```
lib/
  workflow/
    engine.ts
    runner.ts
    transitions.ts
    types.ts
  ai/
    intake.ts
    strategist.ts
    theme-generator.ts
    asset-planner.ts
    section-generator.ts
    section-regenerator.ts
    seo-generator.ts
  page/
    schema.ts
    section-library.ts
    renderer.ts
    validators.ts
  assets/
    upload.ts
    placeholders.ts
    normalizer.ts
```

Responsibilities:
* intake.ts: extract structured business profile
* strategist.ts: choose page type, funnel intent, section sequence
* theme-generator.ts: choose design system
* asset-planner.ts: define where images/icons are needed
* section-generator.ts: generate section content by section type
* renderer.ts: convert schema to publishable HTML
Section System

Claude should implement a real section library.

Each section type should have:
* schema
* variants
* editor controls
* render function
* default fallback content
* asset slots

Example:

```
type HeroSection = {
  type: "hero"
  variant: "split-image" | "centered" | "full-bleed"
  content: {
    eyebrow?: string
    heading: string
    subheading: string
    primaryCtaText: string
    primaryCtaHref: string
    secondaryCtaText?: string
    secondaryCtaHref?: string
    trustPoints?: string[]
  }
  assets: {
    heroImageId?: string
    backgroundImageId?: string
  }
}
```

That is how you make "add section" work properly.

Image Strategy

Right now image support is the biggest product gap. Claude should add:

1. Asset model in DB
2. Upload endpoint
3. Section asset references
4. Placeholder image support
5. Hero/image-capable section variants

For v1, even this is enough:
* user upload image
* store local path or hosted URL
* map to Asset
* render in hero/features/testimonials/gallery

If no image is uploaded:
* use placeholder illustrations/photos
* mark them clearly editable

DB Changes You Should Ask For

Add something like:
* Asset
* WorkflowRun stays
* PageDocument or enhance Page to store canonical structured JSON
* PageVersion should snapshot the full document, not just partial fields

Suggested additions:

```
model Asset {
  id        String   @id @default(uuid())
  projectId String
  kind      String
  source    String
  url       String
  altText   String?
  createdAt DateTime @default(now())
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

Rendering Strategy

Do not let the AI output final raw HTML as the source of truth. Use:
* structured page document
* component renderer / template renderer
* predictable variants

AI should generate content and structure. Code should generate layout HTML.

That is how you get:
* stable editing
* image handling
* section insertion
* consistent responsiveness
* safer rendering

Workflow States I'd Recommend

```
intake
strategy_generation
theme_generation
asset_planning
plan_review
content_generation
document_assembly
rendering
complete
failed
```

Optional later:
* image_generation
* seo_generation
* publish_preflight

What Claude Should Implement First

Phase 1:
* canonical PageDocument schema
* richer section library
* footer section
* hero image support
* asset model + uploads
* add-section UI with variants
* section renderer cleanup

Phase 2:
* theme variants
* better section planning
* testimonial/results/pricing blocks
* service-area/contact/footer completeness

Phase 3:
* AI image placeholders / stock integration
* better mobile preview
* undo/redo
* publish settings
* analytics / forms

What To Tell Claude

Paste this:

```
Refactor the landing page generator into a schema-driven document system so it can generate full-fledged publishable landing pages, not just basic text sections.

Goals:
1. Introduce a canonical PageDocument schema as the source of truth instead of relying on free-form generated HTML.
2. Support full landing page generation with:
   - hero
   - trust/social proof strip
   - features/benefits
   - problem/solution
   - how it works
   - testimonials
   - pricing or offer section
   - FAQ
   - final CTA
   - contact
   - footer
3. Add a section library with section schemas, renderers, variants, and editor support.
4. Add asset support:
   - project-level Asset model
   - image upload
   - hero images
   - section image slots
   - placeholder images when no user images exist
5. Keep the workflow orchestrated in stages:
   - intake
   - strategy generation
   - theme generation
   - asset planning
   - plan review
   - content generation
   - document assembly
   - rendering
   - complete
6. Do not implement a complex multi-agent swarm. Use a single orchestrator with specialized generation modules.
7. Ensure the editor supports:
   - add section
   - choose section variant
   - reorder
   - duplicate/delete
   - edit text
   - replace/upload images
   - global theme controls
8. Make the generated output publishable by default with footer, imagery support, CTA hierarchy, and responsive layout.
9. Preserve SQLite compatibility locally.
10. Use structured output validation at each generation stage.

Implementation direction:
- Add page/schema.ts for PageDocument and section types
- Add section-library definitions for each supported section
- Add asset model and upload flow
- Refactor renderer to render from structured section variants
- Generate content per section type instead of one monolithic page generation prompt
```

My Recommendation

Yes, orchestrate now. But orchestrate a document-generation workflow, not an agent swarm.

That is the right architectural step for this repo.
