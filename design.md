# Architectural Design Document

## 1. Application Architecture

The application follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│                 Frontend (React)                 │
│  ┌──────────┬──────────┬──────────┬───────────┐ │
│  │Dashboard │AI Chat   │Plan View │Page Editor│ │
│  └──────────┴──────────┴──────────┴───────────┘ │
├─────────────────────────────────────────────────┤
│              Backend API (Flask)                  │
│  ┌──────────┬──────────┬──────────┬───────────┐ │
│  │Auth      │Project   │AI Orch.  │Page       │ │
│  │Routes    │Routes    │Routes    │Routes     │ │
│  └──────────┴──────────┴──────────┴───────────┘ │
├─────────────────────────────────────────────────┤
│              Service Layer                       │
│  ┌──────────┬──────────┬──────────┬───────────┐ │
│  │Auth      │Project   │AI        │Page       │ │
│  │Service   │Service   │Orchestr. │Service    │ │
│  └──────────┴──────────┴──────────┴───────────┘ │
├─────────────────────────────────────────────────┤
│              AI Layer                            │
│  ┌──────────┬──────────┬──────────┬───────────┐ │
│  │Intake    │Competitor│Planner   │Generator  │ │
│  │Agent     │Analyzer  │          │           │ │
│  └──────────┴──────────┴──────────┴───────────┘ │
├─────────────────────────────────────────────────┤
│         Persistence (SQLite + SQLAlchemy)        │
└─────────────────────────────────────────────────┘
```

### Layers

- **Frontend**: React SPA with Tailwind CSS. Handles all UI rendering, user interaction, editor behavior.
- **API Routes**: Thin Flask route handlers. Validate input, call services, return responses. No business logic.
- **Service Layer**: Business logic lives here. Auth, project management, page operations, AI orchestration coordination.
- **AI Layer**: Self-contained AI orchestration with clear responsibilities per workflow stage. Prompts are centralized and versioned.
- **Persistence**: SQLite via SQLAlchemy ORM. Clean models, explicit relationships.

---

## 2. AI Architecture

The AI system is a **custom lightweight orchestration layer** — not LangGraph, not CrewAI. Rationale:

- No heavy framework dependency for an MVP
- Full control over state transitions and debugging
- The workflow is sequential with clear stages, not a complex branching graph
- Simpler to maintain and extend

### Workflow State Machine

```
INTAKE → COMPETITOR_ANALYSIS → PLANNING → PLAN_APPROVAL → GENERATION → COMPLETE
```

Each stage has:
- **Entry conditions**: what data must exist
- **Actions**: what the AI does
- **Exit conditions**: what data must be produced
- **User interaction points**: where we wait for user input

### AI Responsibilities by Stage

**Intake Agent**
- Receives initial business info from project creation form
- Analyzes what is missing (target audience, CTA, tone, etc.)
- Generates follow-up questions
- Continues asking until sufficient context is gathered
- Stores structured `business_context` JSON

**Competitor Analyzer**
- Receives competitor URLs
- Fetches and parses page content (BeautifulSoup / requests)
- Extracts structural patterns: section types, layout approach, CTA placement
- Falls back to asking for screenshots if scraping fails
- Stores `competitor_insights` JSON

**Planner**
- Takes business_context + competitor_insights
- Generates a structured page plan: ordered sections with descriptions
- Includes color/font/branding suggestions
- Returns plan as structured JSON for display and approval

**Generator**
- Takes approved plan + full context
- Generates each section as structured JSON (not raw HTML)
- Each section has type, content properties, and style config
- HTML is rendered from these section definitions server-side

**Section Updater**
- Handles targeted regeneration of individual sections
- Receives section type + context + user instructions
- Returns updated section JSON, leaving other sections untouched

### Prompt Management

All prompts live in `backend/ai/prompts/` as structured Python modules:
- `intake_prompts.py`
- `competitor_prompts.py`
- `planner_prompts.py`
- `generator_prompts.py`
- `section_update_prompts.py`

Each prompt module exports functions that take context and return formatted prompts. Prompts are never inline strings scattered across the codebase.

---

## 3. Editor Architecture

**Decision: Custom React section-based editor backed by structured JSON.**

Rejected alternatives:
- **GrapesJS**: Adds significant complexity, learning curve, and coupling. Hard to control save/regeneration behavior.
- **Pure raw HTML editing**: Fragile. No clean way to do section-level operations. Regeneration risks destroying everything.
- **contentEditable on raw HTML**: Unstable, browser inconsistencies, hard to persist cleanly.

### How the Editor Works

The editor operates on the **sections JSON array**, not on raw HTML.

```
User sees: Rendered page with edit overlays
User edits: Modifies section config in React state
System stores: Updated sections JSON → re-renders HTML
```

### Edit Model

When editor mode is active:
1. Each section renders with an overlay showing section controls (move up/down, duplicate, delete)
2. Clicking an element (heading, paragraph, button, image) opens inline editing
3. Inline editing modifies the corresponding property in the section's config object
4. All edits are tracked in React component state until Save is clicked

### Editable Properties by Element Type

| Element | Editable Properties |
|---------|-------------------|
| Text (h1-h6, p) | content, fontSize, fontFamily, alignment, color |
| Button | text, link, backgroundColor, textColor, size |
| Image | src (upload/replace), alt, size |
| Card | title, description, image, link |
| Section | order (move), duplicate, delete |

### Section Controls

Each section wrapper shows:
- Move Up / Move Down arrows
- Duplicate button
- Delete button
- Section type label

### Add Section

A "+" button between sections and at the bottom allows adding new sections from templates:
- Hero, Features, Testimonials, Pricing, FAQ, CTA, Contact

Adding a section inserts a new section JSON block with default content that the user can then edit.

---

## 4. Source of Truth and Data Strategy

**The structured sections JSON is the source of truth. Rendered HTML is a derived artifact.**

### Data Model

```
User
  id              INTEGER PRIMARY KEY
  name            TEXT NOT NULL
  email           TEXT UNIQUE NOT NULL
  password_hash   TEXT NOT NULL
  created_at      DATETIME

Project
  id              INTEGER PRIMARY KEY
  user_id         INTEGER FK → User
  name            TEXT NOT NULL
  slug            TEXT UNIQUE NOT NULL
  status          TEXT (draft | building | generated | published)
  business_context JSON  (structured business info gathered by AI)
  competitor_data  JSON  (extracted competitor insights)
  created_at      DATETIME
  updated_at      DATETIME

Conversation
  id              INTEGER PRIMARY KEY
  project_id      INTEGER FK → Project
  messages        JSON  (array of {role, content, timestamp})
  workflow_state   TEXT  (intake | competitor_analysis | planning | generation | complete)
  ai_context      JSON  (accumulated structured context for AI decisions)
  created_at      DATETIME
  updated_at      DATETIME

PagePlan
  id              INTEGER PRIMARY KEY
  project_id      INTEGER FK → Project
  plan_data       JSON  (sections list with descriptions, branding suggestions)
  status          TEXT  (proposed | approved | modified)
  version         INTEGER DEFAULT 1
  created_at      DATETIME

Page
  id              INTEGER PRIMARY KEY
  project_id      INTEGER FK → Project
  sections_json   JSON  (array of section objects — SOURCE OF TRUTH)
  global_styles   JSON  (primary_color, font_family, etc.)
  rendered_html   TEXT  (cached full HTML output)
  version         INTEGER DEFAULT 1
  created_at      DATETIME
  updated_at      DATETIME

PageVersion
  id              INTEGER PRIMARY KEY
  page_id         INTEGER FK → Page
  sections_json   JSON
  global_styles   JSON
  version_number  INTEGER
  created_at      DATETIME
```

### Section JSON Structure

```json
{
  "id": "uuid-string",
  "type": "hero",
  "order": 0,
  "content": {
    "heading": "Transform Your Business",
    "subheading": "AI-powered solutions for modern teams",
    "cta_text": "Get Started",
    "cta_link": "#contact",
    "background_image": "/static/uploads/hero-bg.jpg"
  },
  "style": {
    "background_color": "#1a1a2e",
    "text_color": "#ffffff",
    "padding": "80px 0"
  }
}
```

Supported section types and their content schemas:
- **hero**: heading, subheading, cta_text, cta_link, background_image
- **features**: heading, subheading, items[] (title, description, icon)
- **testimonials**: heading, items[] (quote, author, role, avatar)
- **pricing**: heading, subheading, plans[] (name, price, period, features[], cta_text, highlighted)
- **faq**: heading, items[] (question, answer)
- **cta**: heading, subheading, button_text, button_link
- **contact**: heading, subheading, fields[] (name, email, message), button_text

---

## 5. Save and Regeneration Strategy

### Save Flow

1. User clicks Save in editor
2. Frontend sends current `sections_json` + `global_styles` to `PUT /api/projects/<id>/page`
3. Backend creates a new `PageVersion` record with the previous state (rollback safety)
4. Backend updates `Page.sections_json` and `Page.global_styles`
5. Backend re-renders HTML from sections JSON using the HTML renderer
6. Backend updates `Page.rendered_html` and increments `Page.version`
7. Returns success with new version number

**Key principle**: Save stores the structured JSON. HTML is always re-derived. User edits live in the JSON and are never lost by re-rendering.

### Regeneration Strategy

Regeneration is **section-level by default**, not full-page.

**User-initiated section regeneration**:
1. User selects a section in editor and clicks "Regenerate with AI"
2. Frontend sends section ID + optional user instructions
3. Backend calls the Section Updater AI with the section's current state + project context
4. AI returns new section JSON for just that section
5. Backend replaces that section in the array, preserves all others
6. Frontend updates the UI

**Full page regeneration** (rare, explicit action):
1. User explicitly requests "Regenerate Entire Page" from settings
2. System warns that all manual edits will be lost
3. Creates a PageVersion backup
4. Re-runs generation from the approved plan
5. Replaces all sections

**Critical rule**: Regeneration never happens silently. User must explicitly trigger it. Save never triggers regeneration.

---

## 6. URL and Rendering Strategy

Generated pages are served at `/app/page/<slug>`.

### Rendering approach: Server-rendered from cached HTML

1. When a page is generated or saved, the backend renders sections JSON → full HTML using Jinja2 templates
2. The rendered HTML is stored in `Page.rendered_html`
3. When `/app/page/<slug>` is requested:
   - Backend looks up the Page by slug
   - Returns the cached `rendered_html` as a complete standalone HTML page
   - No React needed for viewing — it's a static HTML page with inline CSS
4. The "Edit Page" button (shown only to the page owner) links back to the React editor

### HTML Rendering Engine

A server-side renderer (`backend/services/html_renderer.py`) that:
- Takes sections JSON + global styles
- Has a Jinja2 template per section type
- Composes a full HTML page with proper head, styles, sections, and footer
- Outputs self-contained HTML (inline styles, no external dependencies beyond fonts)

---

## 7. Risk Areas

### High Risk

1. **Editor reliability**: Inline editing must feel responsive and not lose data. Mitigated by: React state management, explicit save action, no auto-save that could corrupt.

2. **Regeneration destroying edits**: The most dangerous failure mode. Mitigated by: section-level regeneration, explicit user consent, PageVersion backups.

3. **AI output consistency**: AI-generated section JSON must match expected schemas. Mitigated by: strict schema validation after every AI response, fallback to error display rather than silent corruption.

4. **Prompt stability**: Prompts must produce reliable structured output. Mitigated by: JSON mode / structured output, validation, centralized prompt management.

### Medium Risk

5. **Competitor scraping reliability**: Many sites block scrapers. Mitigated by: graceful fallback to screenshot upload, clear user messaging.

6. **Conversation state management**: Multi-step AI conversations must persist cleanly. Mitigated by: explicit workflow_state field, JSON messages array, clear state transitions.

7. **Section schema evolution**: Adding new section types later must not break existing pages. Mitigated by: each section type is self-contained, renderer handles unknown types gracefully.

### Low Risk

8. **Auth/session management**: Standard problem, well-understood. Flask-Login or JWT.
9. **Slug uniqueness**: Standard unique constraint with fallback to appending numbers.

---

## 8. Technology Decisions

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | React + Tailwind CSS | Modular UI, good editor support, fast styling |
| Backend | Flask + SQLAlchemy | Simple, proven, good Python AI integration |
| Database | SQLite | Sufficient for MVP, easy setup, migrate to Postgres later |
| AI | OpenAI API (GPT-4) | Best structured output quality, JSON mode support |
| Orchestration | Custom state machine | Full control, no framework overhead |
| HTML Rendering | Jinja2 templates | Server-side, fast, reliable |
| Auth | Flask-Login + bcrypt | Simple session-based auth |

### Project Structure

```
ai_html_pub/
├── backend/
│   ├── app.py                    # Flask app factory
│   ├── config.py                 # Configuration
│   ├── models/                   # SQLAlchemy models
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── conversation.py
│   │   ├── page_plan.py
│   │   └── page.py
│   ├── routes/                   # API route handlers
│   │   ├── auth.py
│   │   ├── projects.py
│   │   ├── ai_builder.py
│   │   └── pages.py
│   ├── services/                 # Business logic
│   │   ├── auth_service.py
│   │   ├── project_service.py
│   │   ├── page_service.py
│   │   └── html_renderer.py
│   ├── ai/                       # AI orchestration
│   │   ├── orchestrator.py       # Main workflow controller
│   │   ├── intake.py             # Intake agent
│   │   ├── competitor.py         # Competitor analyzer
│   │   ├── planner.py            # Plan generator
│   │   ├── generator.py          # Page generator
│   │   ├── section_updater.py    # Section regenerator
│   │   └── prompts/              # Centralized prompts
│   │       ├── intake_prompts.py
│   │       ├── competitor_prompts.py
│   │       ├── planner_prompts.py
│   │       ├── generator_prompts.py
│   │       └── section_update_prompts.py
│   ├── templates/                # Jinja2 section templates for HTML rendering
│   │   ├── page_base.html
│   │   ├── sections/
│   │   │   ├── hero.html
│   │   │   ├── features.html
│   │   │   ├── testimonials.html
│   │   │   ├── pricing.html
│   │   │   ├── faq.html
│   │   │   ├── cta.html
│   │   │   └── contact.html
│   └── migrations/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/                # Route-level components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NewProject.jsx
│   │   │   ├── AIBuilder.jsx
│   │   │   └── PageEditor.jsx
│   │   ├── components/           # Reusable components
│   │   │   ├── editor/
│   │   │   │   ├── EditorCanvas.jsx
│   │   │   │   ├── SectionWrapper.jsx
│   │   │   │   ├── SectionControls.jsx
│   │   │   │   ├── InlineEditor.jsx
│   │   │   │   ├── AddSectionMenu.jsx
│   │   │   │   └── EditorToolbar.jsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatPanel.jsx
│   │   │   │   └── MessageBubble.jsx
│   │   │   ├── plan/
│   │   │   │   └── PlanViewer.jsx
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       ├── LoadingSpinner.jsx
│   │   │       └── ErrorBanner.jsx
│   │   ├── services/             # API client
│   │   │   └── api.js
│   │   ├── context/              # React context for state
│   │   │   ├── AuthContext.jsx
│   │   │   └── EditorContext.jsx
│   │   └── utils/
│   └── tailwind.config.js
├── design.md
├── planning.md
├── phases.md
├── application_flow.md
├── PM_recommendations.md
└── instructions.md
```

---

## 9. Key Design Answers

**What is the source of truth for a page?**
The `sections_json` field in the Page model. It is a JSON array of typed section objects with content and style properties.

**What exactly is stored when a page is generated?**
The sections JSON array, global styles JSON, and a rendered HTML cache. Plus a PageVersion snapshot.

**What exactly is edited in the live editor?**
The sections JSON in React state. Each edit modifies a property in the section's content or style config. The actual DOM is React-rendered from this JSON, not directly manipulated.

**What happens when the user saves?**
The current sections JSON is sent to the backend, a version backup is created, the JSON is persisted, HTML is re-rendered from it, and the page is updated.

**Is regeneration full-page, section-level, or conditional?**
Section-level by default. Full-page only on explicit user request with warning.

**How are placeholder values tracked?**
Placeholders are normal content values marked with a `placeholder: true` flag in the section content. The editor highlights them visually so users know to replace them.

**How is AI conversation state stored?**
In the Conversation model as a JSON messages array with a workflow_state field tracking the current stage.

**How does the system remain predictable after multiple edits?**
Edits only modify the sections JSON. Save only persists what's in the JSON. Regeneration only happens when explicitly requested. Versions provide rollback.

**How do we avoid destroying manual edits during AI-assisted updates?**
Section-level regeneration only touches the requested section. Full-page regeneration requires explicit consent and creates a backup first.

**Which orchestration model is simplest while still robust?**
Custom Python state machine with clear stage transitions, no external framework dependency.
