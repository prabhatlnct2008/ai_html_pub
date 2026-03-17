# Planning: Multi-Page Site Architecture + Site-Aware Editor Shell

## 1. Purpose and Scope

### Purpose

Evolve the product from a single-page landing-page editor into a site-aware website builder that supports:

- one site containing multiple pages
- shared global regions (header, footer, navigation)
- a site-aware editor shell with site/page/section/element scoping
- a data model and UI architecture that naturally accommodates later features (forms, SEO, assets, AI editing, publish controls)

### Scope

**In scope:**

- Site data model (Site entity, multi-page relationships)
- Page management (create, rename, duplicate, delete, reorder, homepage designation)
- Shared regions (header, footer, site-wide navigation)
- Site-aware editor shell (left rail page list, center canvas, right inspector)
- Selection model (site > page > section > element)
- Route and URL architecture changes
- Migration strategy for existing single-page projects
- Preview modes across pages
- Persistence and save flow for multi-page state

**Out of scope for this phase:**

- Forms subsystem
- Advanced element-level editing beyond current capabilities
- AI in-editor rewrite tools
- Worker-based background generation
- Cloud asset storage migration
- Postgres migration
- Custom domains
- Analytics
- Collaboration/multi-user

---

## 2. Current-State Analysis

### Data Model

The current system is built around a strict **one project = one page** assumption:

- `Project` has a 1:1 relation to `Page` (enforced by `@unique` on `Page.projectId`)
- `Page` stores `documentJson` (canonical V2 PageDocument), `sectionsJson` (legacy), `globalStyles`, `renderedHtml`
- `PageDocument` contains: `meta`, `brand`, `assets[]`, `actions[]`, `sections[]`
- There is no `Site` entity — the project IS the site
- There is no concept of shared header/footer — footer is a section type within the single page
- Navigation does not exist as a first-class concept

### Routing

```
/projects/[id]/builder    → AI workflow for single page
/projects/[id]/editor     → Edit THE page (singular)
/p/[slug]                 → Published page (one slug = one project = one page)
/api/projects/[id]/page   → GET/PUT for THE single page
```

### Editor

- Editor loads `project.page` (singular) via `/api/projects/[id]/page`
- EditorContext holds: `sections[]`, `actions[]`, `assets[]`, `meta`, `brand`, `globalStyles`
- Left sidebar: section list for the single page
- Right sidebar: 5 tabs (Section, Actions, Assets, Theme, Page)
- No page selector, no site-level settings, no shared region editing

### Workflow

- WorkflowRun is 1:1 with Project
- Generates a single page through: intake → strategy → theme → assets → plan → generation → assembly → render → save
- No concept of generating multiple pages per workflow run

### Published Pages

- `/p/[slug]` resolves to a single project by slug
- Renders `page.renderedHtml` directly
- No multi-page URL structure

---

## 3. Proposed Data Model Changes

### New Entity: Site (logical, not a separate DB table initially)

Rather than introducing a separate `Site` table immediately, elevate the existing `Project` to serve as the site container. This avoids a large migration while enabling multi-page support.

**Project additions:**

```prisma
model Project {
  // ... existing fields ...
  siteSettings    String    @default("{}")   // SiteSettings JSON
  // pages relation changes from 1:1 to 1:N
  pages           Page[]                      // was: page Page?
}
```

**SiteSettings JSON shape:**

```ts
type SiteSettings = {
  siteName: string
  logoAssetId?: string
  faviconAssetId?: string
  brand: BrandSettings              // single canonical source of brand (colors, fonts, tone)
  actions: Action[]                 // site-wide reusable actions, shared across all pages
  navigation: NavigationConfig
  header: HeaderConfig
  footer: FooterConfig
  socialLinks: SocialLink[]
  contactInfo: {
    email?: string
    phone?: string
    address?: string
  }
}

type NavigationConfig = {
  items: NavItem[]
  ctaButton?: {
    text: string
    actionId: string
  }
}

type NavItem = {
  label: string
  pageId: string
  visible: boolean
  order: number
}

type HeaderConfig = {
  variant: "simple" | "centered" | "with-cta" | "transparent"
  sticky: boolean
}

type FooterConfig = {
  variant: "simple" | "multi-column" | "legal-heavy"
  columns: FooterColumn[]
  copyrightText?: string
  legalLinks: { text: string; href: string }[]
}
```

### Page Model Changes

```prisma
model Page {
  id           String        @id @default(uuid())
  projectId    String                          // REMOVE @unique to allow 1:N
  slug         String        @default("")      // per-page slug (e.g., "about", "services")
  title        String        @default("")      // display title
  pageType     String        @default("custom") // homepage, about, services, contact, etc.
  isHomepage   Boolean       @default(false)
  showInNav    Boolean       @default(true)
  navOrder     Int           @default(0)
  sectionsJson String        @default("[]")
  globalStyles String        @default("{}")
  documentJson String        @default("{}")
  renderedHtml String        @default("")
  themeVariant String        @default("")
  version      Int           @default(1)
  status       String        @default("draft") // draft | published
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  project      Project       @relation(fields: [projectId], references: [id], onDelete: Cascade)
  versions     PageVersion[]

  @@unique([projectId, slug])                  // unique slug within a project
}
```

**Key changes:**

- Remove `@unique` from `projectId` (allow multiple pages per project)
- Add `slug` per page (unique within project)
- Add `title`, `pageType`, `isHomepage`, `showInNav`, `navOrder`
- Add per-page `status`
- Compound unique on `[projectId, slug]`

### PageDocument Changes

The existing `PageDocument` structure remains largely intact per page. What changes:

- `meta.slug` becomes per-page (already exists)
- `meta.publishStatus` becomes per-page `status`
- `brand` is removed from per-page `PageDocument`; the single canonical source is `Project.siteSettings.brand` (see section 3a below)
- `actions` are site-scoped: stored in `Project.siteSettings.actions[]`, shared across all pages, referenced by `actionId` from any page's buttons (see section 3b below)
- Footer section type is **removed** from page sections during migration (not kept for backward compat); the extracted content moves to `siteSettings.footer` which is the sole footer source of truth (see section 7)
- Header/nav become site-level shared regions rendered by the shell

### 3a. Brand: Single Source of Truth

**Decision:** Brand lives exclusively in `Project.siteSettings.brand`.

- `PageDocument.brand` is dropped. Pages do not carry their own brand.
- The editor loads brand from `siteSettings` and passes it to the canvas renderer.
- The published page renderer reads brand from the project's `siteSettings`.
- During migration, the existing `PageDocument.brand` is copied into `siteSettings.brand`, then removed from the page document.

This avoids sync bugs where brand in `siteSettings` and `PageDocument.brand` drift apart.

### 3b. Actions: Site-Scoped

**Decision:** Actions are site-scoped from day one.

- `Project.siteSettings.actions[]` is the single actions array.
- `PageDocument.actions` is dropped. Pages reference actions by `actionId` only.
- The editor loads actions from `siteSettings` and makes them available to all pages.
- Buttons on any page reference `actionId` into the shared pool.
- The Actions panel in the left rail operates on the site-level actions array.
- During migration, actions from the existing `PageDocument.actions` are copied into `siteSettings.actions`, then removed from the page document.

This prevents the ambiguity of per-page vs site-wide action pools and avoids the "which copy is canonical?" problem.

---

## 4. Route and UI Architecture Changes

### New Route Structure

```
/projects/[id]/editor                    → Site editor shell (default: loads homepage)
/projects/[id]/editor?page=[pageId]      → Site editor with specific page selected

/p/[projectSlug]                         → Published homepage
/p/[projectSlug]/[pageSlug]              → Published sub-page (about, services, etc.)
```

**API routes:**

```
GET    /api/projects/[id]/site           → Site settings + page list
PUT    /api/projects/[id]/site           → Update site settings

GET    /api/projects/[id]/pages          → List all pages (id, title, slug, order, isHomepage)
POST   /api/projects/[id]/pages          → Create new page
GET    /api/projects/[id]/pages/[pageId] → Get full page document
PUT    /api/projects/[id]/pages/[pageId] → Save page document
DELETE /api/projects/[id]/pages/[pageId] → Delete page

POST   /api/projects/[id]/pages/[pageId]/duplicate  → Duplicate page
PUT    /api/projects/[id]/pages/reorder              → Reorder pages
```

**Backward-compatible routes (keep working):**

```
GET/PUT /api/projects/[id]/page          → Legacy: operate on homepage (first page)
/p/[slug]                                → Legacy: still resolves to project homepage
```

### Published URL Resolution

1. `/p/my-business` → Find project with slug `my-business` → render its homepage
2. `/p/my-business/about` → Find project → find page with slug `about` → render
3. `/p/my-business/services` → Find project → find page with slug `services` → render

The published page renderer wraps each page with the shared header/nav and footer from site settings.

---

## 5. Editor Information Architecture

### Site-Aware Editor Shell

```
┌─────────────────────────────────────────────────────────────────┐
│  TOP BAR                                                        │
│  [Site: My Business]  │  Edit / Preview  │  Desktop Tablet Mobile│
│                       │                  │  Save  │  Publish     │
├──────────┬──────────────────────────────────┬───────────────────┤
│ LEFT RAIL│       CENTER CANVAS              │  RIGHT PANEL      │
│          │                                  │                   │
│ PAGES    │  ┌─ SHARED HEADER ──────────┐   │  Contextual       │
│ ──────── │  │ Logo  Nav  CTA Button    │   │  Inspector        │
│ ● Home   │  └─────────────────────────┘   │                   │
│   About  │                                  │  Changes based on │
│   Services│  ┌─ PAGE SECTIONS ─────────┐   │  what is selected:│
│   Contact│  │ Hero                     │   │                   │
│   Pricing│  │ Features                 │   │  Site → site      │
│          │  │ Testimonials             │   │    settings       │
│ ──────── │  │ CTA Band                 │   │  Page → page      │
│ + Add    │  │ Contact                  │   │    settings       │
│          │  └─────────────────────────┘   │  Section → section │
│ SITE     │                                  │    inspector      │
│ ──────── │  ┌─ SHARED FOOTER ──────────┐   │  Element → element│
│ Settings │  │ Cols  Links  Copyright   │   │    inspector      │
│ Theme    │  └─────────────────────────┘   │                   │
│ Assets   │                                  │                   │
│ Actions  │                                  │                   │
└──────────┴──────────────────────────────────┴───────────────────┘
```

### Left Rail Sections

**Pages Section:**
- List of all pages with icons indicating type
- Active page highlighted
- Click to switch page on canvas
- Drag to reorder (or up/down buttons)
- Hover actions: rename, duplicate, delete, hide from nav
- "+" button to add new page (with type picker: About, Services, Contact, Pricing, FAQ, Custom)
- Homepage badge on the homepage
- Right-click / three-dot menu for page actions

**Site Section:**
- Settings (site name, contact info, social links)
- Theme (brand colors, fonts, tone — moved from per-page to site level)
- Assets (shared asset library)
- Actions (reusable CTAs shared across site)

### Right Panel — Contextual Inspector

The right panel changes based on what is currently selected:

| Selection | Right Panel Shows |
|-----------|-------------------|
| Nothing selected | Site overview / quick actions |
| Page selected (from left rail) | Page settings: title, slug, SEO, type, show in nav, publish status |
| Shared header | Header settings: variant, sticky, logo, nav items, CTA button |
| Shared footer | Footer settings: variant, columns, links, copyright |
| Section on canvas | Section inspector: variant, style, content fields, items, buttons |
| Element in section | Element inspector: text, image, button, item-specific fields |

### Center Canvas

- Renders the currently selected page
- Shared header always visible at top (editable when clicked)
- Page sections in the middle
- Shared footer always visible at bottom (editable when clicked)
- Section hover/select controls remain as-is
- "Add Section" buttons between sections
- Preview mode hides all editing chrome

---

## 6. Workflow Implications

### Current Workflow (Single Page)

```
intake → strategy → theme → assets → image_prompts → images → plan → review → generation → assembly → render → save
```

### Extended Workflow (Multi-Page Site)

Phase 1 approach: **Generate homepage first, add pages later.**

The initial generation workflow stays largely the same — it generates the homepage. Multi-page generation is a later enhancement.

**What changes now:**

1. After workflow completes, the generated page is stored as the homepage (`isHomepage: true`)
2. Site settings are initialized with default header/footer/nav based on the generated content
3. The footer section is extracted from the generated page and moved to site-level `FooterConfig`
4. Navigation is auto-generated from the page list

**Later enhancement (not in this phase):**

- Workflow generates a site plan (multiple pages)
- Pages are generated one by one or in parallel
- Each page goes through section generation independently
- Shared actions and assets are managed at site level

### What This Phase Delivers

- User can manually add pages after initial generation
- Each new page starts blank (or from a template)
- User can duplicate homepage and modify for new pages
- AI generation of additional pages is deferred to a later phase

---

## 7. Migration Strategy

### Existing Projects (Single-Page → Site)

When an existing project is opened in the new editor:

1. **Lazy migration on first load:**
   - If `project.siteSettings` is empty/default (`"{}"` or missing `brand`), run migration
   - The existing single `Page` record becomes the homepage (`isHomepage: true`, `slug: ""`)
   - **Footer extraction:** Find the footer section in the page's `documentJson.sections`, extract its content into `siteSettings.footer`, then **remove the footer section from the page's sections array**. The page document is re-saved without the footer section. This prevents duplicate footer rendering.
   - **Brand extraction:** Copy `documentJson.brand` into `siteSettings.brand`, then remove `brand` from the page document.
   - **Actions extraction:** Copy `documentJson.actions` into `siteSettings.actions`, then remove `actions` from the page document. Section buttons keep their `actionId` references — those now resolve against `siteSettings.actions`.
   - Generate default `siteSettings.navigation` from the homepage (one nav item: "Home")
   - Generate default `siteSettings.header` (simple variant, sticky: true)
   - Set `siteSettings.siteName` from project name

2. **What is preserved vs changed:**
   - The existing `Page` record is preserved (same ID, same projectId)
   - `documentJson` is updated in-place: footer section removed, brand removed, actions removed
   - `renderedHtml` is re-generated for the page body only (without footer)
   - Legacy `/api/projects/[id]/page` route continues working (operates on homepage)
   - Published `/p/[slug]` continues working (render-on-read now composes header + body + footer)

3. **Database migration:**
   - Remove `@unique` constraint from `Page.projectId`
   - Add new columns to `Page`: `slug`, `title`, `pageType`, `isHomepage`, `showInNav`, `navOrder`, `status`
   - Add `siteSettings` column to `Project`
   - Run `prisma db push` or create migration

### Data Integrity

- Existing page content (sections minus footer) is preserved
- Footer, brand, and actions are moved — not duplicated — to site settings
- After migration, exactly one footer renders (from `siteSettings.footer`), zero footer sections exist in page documents
- After migration, exactly one brand exists (`siteSettings.brand`), zero brand objects in page documents
- If migration fails partway, the next load re-runs it (idempotent: check for `siteSettings.brand` presence)

---

## 8. API Changes

### New Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/projects/[id]/site` | Get site settings + page list summary |
| PUT | `/api/projects/[id]/site` | Update site settings (header, footer, nav, contact) |
| GET | `/api/projects/[id]/pages` | List all pages (id, title, slug, type, order, isHomepage, status) |
| POST | `/api/projects/[id]/pages` | Create new page (title, pageType, slug) |
| GET | `/api/projects/[id]/pages/[pageId]` | Get full page document |
| PUT | `/api/projects/[id]/pages/[pageId]` | Save page document + render |
| DELETE | `/api/projects/[id]/pages/[pageId]` | Delete page (prevent deleting last/homepage) |
| POST | `/api/projects/[id]/pages/[pageId]/duplicate` | Duplicate page |
| PUT | `/api/projects/[id]/pages/reorder` | Reorder pages (accepts ordered array of pageIds) |

### Modified Endpoints

| Method | Path | Change |
|--------|------|--------|
| GET/PUT | `/api/projects/[id]/page` | Backward compat: operates on homepage. Internally redirects to pages/[homepageId] |
| GET | `/api/projects/[id]` | Include `siteSettings` and page count in response |

### Published Page Resolution

| Path | Resolution |
|------|------------|
| `/p/[slug]` | Find project by slug → render homepage with header/footer |
| `/p/[slug]/[pageSlug]` | Find project by slug → find page by pageSlug → render with header/footer |

### Draft Page Access Model

**Decision:** Draft pages on public URLs return 404 to anonymous visitors. Authenticated owners see a preview with a "Draft" banner.

**How it works:**

1. Public route handler (`/p/[slug]` or `/p/[slug]/[pageSlug]`) checks `page.status`.
2. If `status === "published"` → render normally for everyone.
3. If `status === "draft"`:
   a. Check if the current request has a valid auth session.
   b. If authenticated AND the session user owns the project → render the page with a visible "Draft — only you can see this" banner at the top.
   c. If not authenticated or not the owner → return 404 (page not found).
4. This matches the existing behavior in the current `/p/[slug]` route, which already checks `project.status` and `project.userId`.

**Why not a separate preview URL:** A separate `/preview/[slug]` route adds complexity. The simpler model is: public URLs work for published pages, and the same URLs show a draft banner for the owner. This is how most website builders work (Squarespace, Wix, etc.).

---

## 9. Persistence Changes

### Save Flow (Per-Page)

1. Editor sends PUT to `/api/projects/[id]/pages/[pageId]` with page document
2. Server builds `PageDocument`, renders HTML
3. Creates `PageVersion` snapshot
4. Updates `Page` record
5. Returns version number

### Save Flow (Site Settings)

1. Editor sends PUT to `/api/projects/[id]/site` with updated site settings
2. Server validates and persists `siteSettings` JSON on Project
3. Returns updated settings
4. **No eager re-render of page HTML.** See render strategy below.

### Render Strategy: Render-on-Read for Published Pages

**Decision:** Published pages are rendered on read (at request time), not stored as pre-rendered HTML that must be eagerly invalidated.

**Rationale:** Eager re-rendering every page's `renderedHtml` when site settings change (header, footer, nav, brand) is fragile — it creates a fan-out problem where saving one field must rewrite N pages, any of which could fail. It also means `renderedHtml` is stale until the next re-render completes, causing drift.

**How it works:**

1. Each `Page` stores its own `renderedHtml` for the **page body sections only** (not header/footer).
2. The published page route (`/p/[slug]` and `/p/[slug]/[pageSlug]`) assembles the full page at request time:
   - Read `siteSettings` from Project (header, footer, nav, brand, actions)
   - Read `renderedHtml` from the specific Page (body sections only)
   - Compose: `renderHeader(siteSettings) + page.renderedHtml + renderFooter(siteSettings)`
3. Header and footer are rendered from `siteSettings` on every request — always fresh.
4. Page body `renderedHtml` is re-rendered only when that specific page is saved.

**Performance note:** Header/footer rendering is deterministic and fast (no AI calls). The cost of rendering them per-request is negligible. If performance becomes an issue later, a cache layer can be added, but eager fan-out re-rendering is avoided from the start.

**This means:**
- Editing the header/footer/nav/brand in the editor and saving site settings takes effect immediately on all published pages — no need to "republish" each page.
- Page body content is still pre-rendered and stored, so the expensive part (section rendering) is not repeated on every request.

### Render Pipeline

```
// Published page route handler (render-on-read)
serveSitePage(project, page) {
  const siteSettings = JSON.parse(project.siteSettings)
  return [
    renderHeader(siteSettings.header, siteSettings.navigation, siteSettings.siteName, siteSettings.brand),
    page.renderedHtml,   // pre-rendered page body sections
    renderFooter(siteSettings.footer, siteSettings.brand),
  ].join("")
}

// Editor save (per-page) — only re-renders page body
savePage(pageId, pageDocument) {
  const bodyHtml = renderPageSections(pageDocument.sections, siteSettings.actions, assets)
  await updatePage(pageId, { renderedHtml: bodyHtml, ... })
}
```

---

## 10. State Management Changes

### EditorContext Expansion

The `EditorContext` currently holds state for one page. It needs to expand to hold site-level state.

**New state shape:**

```ts
type EditorState = {
  // Site-level (shared, persisted to Project.siteSettings)
  projectId: string
  siteSettings: SiteSettings        // contains brand, actions, header, footer, nav, contact, social
  pages: PageSummary[]              // { id, title, slug, pageType, isHomepage, showInNav, navOrder }
  assets: Asset[]                   // site-wide asset library (persisted to Asset table)

  // Convenience accessors (derived from siteSettings, not duplicated)
  // brand → siteSettings.brand
  // actions → siteSettings.actions

  // Page-level (changes when switching pages, persisted to Page record)
  currentPageId: string
  sections: Section[]               // page body sections (no footer, no header)
  pageMeta: PageMeta                // title, slug, seoDescription, pageType, status
  pageStyles: Record<string, unknown>

  // Editor state (not persisted)
  selectedSectionId: string | null
  selectionScope: "site" | "page" | "header" | "footer" | "section" | "element"
  isDirty: boolean
  isPageDirty: boolean
  isSiteDirty: boolean
  previewMode: boolean
  previewWidth: "desktop" | "tablet" | "mobile"
  activeLeftPanel: "pages" | "site"
  activeRightPanel: string          // contextual based on selection
}
```

**New reducer actions needed:**

```
// Page management
ADD_PAGE
DELETE_PAGE
DUPLICATE_PAGE
RENAME_PAGE
REORDER_PAGES
SET_HOMEPAGE
TOGGLE_PAGE_NAV_VISIBILITY
SWITCH_PAGE                         // loads different page into editor

// Site settings
UPDATE_SITE_SETTINGS
UPDATE_HEADER
UPDATE_FOOTER
UPDATE_NAVIGATION
UPDATE_SITE_CONTACT

// Selection
SET_SELECTION_SCOPE
SELECT_HEADER
SELECT_FOOTER

// Brand (promoted to site level)
UPDATE_BRAND                        // existing, now site-scoped
```

### Page Switching Flow

1. User clicks different page in left rail
2. If current page is dirty, prompt to save or discard
3. Dispatch `SWITCH_PAGE` action
4. Fetch page document from `/api/projects/[id]/pages/[newPageId]`
5. Replace `sections`, `pageMeta`, `pageStyles` in state
6. Reset `selectedSectionId`
7. Canvas re-renders with new page content

---

## 11. Phased Implementation Sequence

### Phase 1: Data Model + Migration (Foundation)

1. Update Prisma schema (remove unique constraint, add new Page fields, add siteSettings to Project)
2. Run migration
3. Create lazy migration logic for existing projects
4. Create `/api/projects/[id]/site` endpoints
5. Create `/api/projects/[id]/pages` CRUD endpoints
6. Update legacy `/api/projects/[id]/page` to proxy to homepage
7. Write migration tests

### Phase 2: Editor Shell Restructure

1. Restructure left rail: add Pages section above Sections
2. Add page list component with click-to-switch, add, rename, delete, reorder
3. Move Theme and Assets to site-level section in left rail
4. Update EditorContext with site-level state and page switching
5. Add selection scope tracking
6. Update right panel to be scope-aware

### Phase 3: Shared Regions

1. Implement shared header rendering on canvas (above page sections)
2. Implement shared footer rendering on canvas (below page sections)
3. Add header inspector (variant, sticky, logo, nav items, CTA)
4. Add footer inspector (variant, columns, links, copyright)
5. Update published page renderer to wrap with header/footer

### Phase 4: Page Management UX

1. Add page creation flow (type picker, title, slug)
2. Add page duplication
3. Add page deletion (with guards for homepage/last page)
4. Add page reorder (drag or buttons)
5. Add homepage designation toggle
6. Add "show in nav" toggle
7. Add per-page slug editing
8. Add per-page SEO fields
9. Add per-page publish status

### Phase 5: Published Multi-Page Sites

1. Update `/p/[slug]` to render with shared header/footer
2. Add `/p/[slug]/[pageSlug]` route
3. Generate navigation links from site settings
4. Handle draft vs published per-page
5. Generate sitemap-like page listing

### Phase 6: Integration + Polish

1. Update workflow completion to initialize site settings
2. Extract footer from generated page into site-level footer
3. Auto-generate navigation from page list
4. Verify preview modes work across pages
5. Verify save/refresh persistence
6. Backward compatibility testing

---

## 12. Risk List

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing projects during migration | High | Lazy idempotent migration on first load; legacy API routes preserved; migration tested explicitly |
| Editor performance with many pages loaded | Medium | Only load current page's document; page list is lightweight summary |
| Complexity of shared header/footer rendering | Medium | Start with simple variants; don't over-engineer initial header/footer |
| Footer section duplication (page-level vs site-level) | **Resolved** | Migration removes footer from page sections and moves to siteSettings.footer. No duplication. |
| Brand/actions ownership ambiguity | **Resolved** | Brand and actions are exclusively site-scoped in `siteSettings`. Removed from per-page `PageDocument`. |
| Stale published pages after site settings change | **Resolved** | Render-on-read: header/footer rendered per-request from live `siteSettings`; no eager re-render needed. |
| Draft page visibility on public URLs | **Resolved** | 404 for anonymous visitors; owner sees draft banner via auth check. Same model as existing `/p/[slug]`. |
| Published page URL changes breaking existing links | High | Keep `/p/[slug]` working as-is; only add `/p/[slug]/[pageSlug]` for new pages |
| Dirty state tracking across page switches | Medium | Save-or-discard prompt before switching pages |
| Render-on-read performance at scale | Low | Header/footer are deterministic HTML templates (no AI); negligible cost. Cache layer can be added later if needed. |
| Workflow does not generate multi-page sites | Low (deferred) | Manual page creation is sufficient for this phase |
| AI generation of additional pages | Low (deferred) | Out of scope; can be added as a "Generate About Page" action later |

---

## 13. Acceptance Criteria

### Must-Pass Criteria

1. Existing single-page projects open in the new editor without errors
2. Existing published pages continue rendering at their current URLs
3. Editor shows a page list in the left rail
4. User can switch between pages and see the canvas update
5. User can create a new page with a title, type, and slug
6. User can rename, duplicate, and delete pages
7. User can set a page as the homepage
8. User can toggle "show in nav" for each page
9. User can reorder pages
10. Shared header renders at top of canvas with logo and navigation
11. Shared footer renders at bottom of canvas
12. Header and footer are editable via the right panel inspector
13. Right panel changes based on selection scope (site vs page vs section)
14. Preview mode shows the full page with header and footer
15. Desktop/tablet/mobile preview works when viewing any page
16. Save persists both page changes and site setting changes
17. Refresh after save retains all changes
18. Published site serves homepage at `/p/[slug]`
19. Published site serves sub-pages at `/p/[slug]/[pageSlug]`
20. Navigation links on published pages work correctly
21. New projects created after this change get proper site settings initialized

### Should-Pass Criteria

1. Per-page SEO fields (title, description) are editable
2. Per-page publish status (draft/published) works
3. Deleting the homepage is prevented (or auto-reassigns)
4. Duplicate slugs within a project are prevented
5. Empty site state is handled gracefully

---

## 14. Out-of-Scope Items

- AI generation of multiple pages in one workflow run
- AI-powered page creation ("Create an About page from homepage content")
- Forms subsystem
- Advanced element-level editing enhancements
- AI in-editor rewrite tools
- Drag-and-drop page reordering
- Page folders or grouping
- Localized page variants
- Scheduled publishing
- Page version history / rollback UI
- Worker-based generation
- Cloud asset storage
- Postgres migration
- Custom domains
- Analytics
- Collaboration / multi-user

These are all valid future features but are explicitly excluded from this phase to keep scope manageable.
