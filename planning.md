# Planning Document

## 1. Product Understanding

This is an AI-assisted landing page generator for non-technical users. Users describe their business, optionally provide competitor websites, and the AI guides them through a conversational workflow to understand requirements, propose a page structure, and generate a complete landing page. Users can then visually edit the generated page through a section-based editor and publish it at a unique URL.

The product is not a one-shot HTML generator. It is a guided, multi-step workflow product with:
- Intelligent intake and requirement gathering
- Competitor analysis for inspiration
- Structured plan generation and approval
- Full landing page generation from approved plans
- A visual editor that gives users confidence to modify AI output
- Safe persistence that never silently destroys user work

The target user has zero knowledge of HTML/CSS/web development.

---

## 2. Goals (Current Version)

1. Working user registration and login with session management
2. Dashboard for viewing and managing landing page projects
3. AI-driven conversational workflow that intelligently gathers requirements
4. Competitor URL intake and structural analysis
5. AI-generated page plan with user approval/modification flow
6. Full landing page generation from approved plans as structured section JSON
7. Server-rendered page at unique URL (`/app/page/<slug>`)
8. Visual section-based editor with inline editing, section controls, and add/remove/reorder
9. Safe save behavior that preserves edits and creates version backups
10. Section-level AI regeneration without destroying other edits

---

## 3. Core Workflows

### 3.1 Register and Login
1. User visits product landing page
2. Clicks Register → fills name, email, password
3. System validates email uniqueness, creates account
4. User is redirected to login (or auto-logged in)
5. Login: email + password → session created → redirect to dashboard

### 3.2 Create Project
1. From dashboard, user clicks "Create New Page"
2. Fills project form: name, business description, competitor URL (optional), target audience, primary CTA, secondary CTA
3. Clicks "Start AI Builder" → project created with status `draft` → redirected to AI Builder screen

### 3.3 AI Conversation (Intake)
1. AI receives the initial project data
2. AI analyzes what information is sufficient and what is missing
3. AI asks follow-up questions one or a few at a time
4. User answers in the chat interface
5. AI continues until it has sufficient context
6. AI transitions to competitor analysis (if URLs provided) or directly to planning

### 3.4 Competitor Analysis
1. If competitor URLs were provided, AI fetches and analyzes pages
2. Extracts section structure, CTA patterns, layout approach
3. If scraping fails, asks user to upload screenshots
4. Stores competitor insights as structured data
5. Shows summary of extracted patterns in the structured output panel
6. Transitions to planning

### 3.5 Plan Generation and Approval
1. AI generates a page plan: ordered sections, descriptions, branding suggestions
2. Plan is displayed in the right panel of the AI Builder screen
3. User can approve or request modifications
4. If modifications requested, AI revises the plan
5. Once approved, plan is stored and system transitions to generation

### 3.6 Page Generation
1. System generates each section as structured JSON based on the approved plan
2. Sections are stored in the Page model
3. HTML is rendered server-side from sections JSON
4. Page becomes accessible at `/app/page/<slug>`
5. Project status updated to `generated`
6. User is shown the generated page with an "Edit Page" button

### 3.7 Visual Editing
1. Owner clicks "Edit Page" → editor mode activates
2. Section overlays appear with move/duplicate/delete controls
3. Clicking text/buttons/images opens inline editing
4. User modifies content, styles, and section order
5. Changes are tracked in React state (sections JSON)
6. User can toggle between Editor Mode and Preview Mode

### 3.8 Save
1. User clicks Save button
2. Frontend sends current sections JSON to backend
3. Backend creates a PageVersion backup of the previous state
4. Backend updates sections JSON, re-renders HTML, increments version
5. Page reloads with saved state

### 3.9 Section Regeneration
1. In editor mode, user selects a section and clicks "Regenerate with AI"
2. Optionally provides instructions ("make it more professional", "add pricing tiers")
3. Backend calls Section Updater AI with section context + instructions
4. AI returns new section JSON for just that section
5. Section is updated, all others preserved
6. User can undo or save

### 3.10 Revisit Old Project
1. From dashboard, user sees list of all projects with status, date, actions
2. Click "Edit" → opens editor for generated pages
3. Click "View" → opens the published page
4. If project is still in draft/building state, clicking it resumes the AI Builder conversation

---

## 4. Screens and States

### 4.1 Product Landing Page (`/`)
- **Purpose**: Marketing page explaining the product
- **Required inputs**: None
- **Actions**: Register, Login
- **Transitions**: → Register, → Login
- **States**: Static, no dynamic states

### 4.2 Registration Screen (`/register`)
- **Purpose**: Create new user account
- **Required inputs**: Name, email, password
- **Actions**: Submit registration
- **Transitions**: Success → Login or Dashboard; Error → show validation errors
- **Loading state**: Submit button disabled with spinner during API call
- **Failure states**: Email taken, validation errors, server error

### 4.3 Login Screen (`/login`)
- **Purpose**: Authenticate existing user
- **Required inputs**: Email, password
- **Actions**: Submit login, navigate to Register, Forgot password (future)
- **Transitions**: Success → Dashboard; Error → show error message
- **Loading state**: Submit button disabled during auth
- **Failure states**: Invalid credentials, server error

### 4.4 Dashboard (`/dashboard`)
- **Purpose**: Central hub for managing projects
- **Required inputs**: Authenticated session
- **Actions**: Create New Page, Edit project, View published page
- **Transitions**: → New Project, → AI Builder (for drafts), → Editor (for generated), → Published page
- **Loading state**: Skeleton cards while loading projects
- **Empty state**: "No projects yet" with prominent Create button
- **Failure states**: API error fetching projects

### 4.5 New Project Screen (`/projects/new`)
- **Purpose**: Collect initial project information
- **Required inputs**: Project name, business description
- **Optional inputs**: Competitor URL, target audience, primary CTA, secondary CTA
- **Actions**: Start AI Builder
- **Transitions**: Success → AI Builder screen
- **Loading state**: Button disabled during project creation
- **Failure states**: Validation errors, slug conflict, server error

### 4.6 AI Builder Screen (`/projects/:id/builder`)
- **Purpose**: Conversational AI workflow for requirement gathering, analysis, and planning
- **Layout**: Left panel = chat, Right panel = structured output (plan, competitor analysis)
- **Required inputs**: Project ID, authenticated user
- **Actions**: Send message, upload screenshot, approve plan, modify plan
- **Transitions**: Plan approved → Page generation → Editor or Page view
- **Loading state**: AI "thinking" indicator, generation progress bar
- **Empty state**: Initial greeting from AI with first question
- **Failure states**: AI error (retry), scraping failure (fallback to screenshot)

### 4.7 Page Editor (`/projects/:id/editor`)
- **Purpose**: Visual editing of generated landing page
- **Required inputs**: Project with generated page
- **Actions**: Inline edit, section controls, add section, regenerate section, save, preview toggle
- **Transitions**: Save → reload with saved state; Preview → view-only mode
- **Loading state**: Save spinner, regeneration spinner per section
- **Failure states**: Save error (retry with data preserved in state), regeneration error

### 4.8 Published Page (`/app/page/<slug>`)
- **Purpose**: Public-facing generated landing page
- **Required inputs**: Valid slug
- **Actions**: View only (owner sees "Edit Page" button)
- **Transitions**: Edit → Editor
- **Loading state**: Standard page load
- **Empty state**: N/A (404 if slug not found)
- **Failure states**: 404 page not found

---

## 5. System Design Approach

### Architecture Style
Monolithic Flask backend serving both the API and rendered pages. React SPA for the application UI. Clean separation between route handlers, service logic, and AI orchestration.

### Communication
- Frontend ↔ Backend: REST API with JSON payloads
- AI conversation: Polling or server-sent events for AI responses (start with polling for simplicity)
- Page rendering: Server-side HTML generation, served directly by Flask

### State Management
- **Server-side**: SQLite database via SQLAlchemy. Sessions via Flask-Login.
- **Client-side**: React Context for auth state and editor state. Local component state for forms.

### Key Architectural Principles
1. Sections JSON is the single source of truth for page content
2. HTML is always derived, never the primary record
3. AI orchestration has clear stage boundaries
4. The editor operates on structured data, not raw DOM
5. Save is always explicit, never auto-triggered
6. Regeneration is always user-initiated with clear scope

---

## 6. Data Strategy

### What gets stored and when

| Event | Data Stored |
|-------|-------------|
| Registration | User record (name, email, password_hash) |
| Project creation | Project record (name, slug, business_context from form) |
| AI conversation | Conversation messages array, workflow_state, accumulated ai_context |
| Competitor analysis | competitor_data JSON on Project |
| Plan generation | PagePlan record (plan_data JSON, status) |
| Plan approval | PagePlan status → approved |
| Page generation | Page record (sections_json, global_styles, rendered_html) |
| User save | PageVersion backup, updated sections_json, re-rendered HTML |
| Section regeneration | Updated section in sections_json (only after user saves) |

### Conversation Context Accumulation

The AI conversation stores two things:
1. `messages`: Full chat history for display
2. `ai_context`: Structured JSON that accumulates discovered facts (business type, audience, tone, CTAs, etc.)

The `ai_context` is what gets passed to the planner and generator — not the raw chat messages. This decouples the AI generation quality from conversation format.

---

## 7. Live Editing Strategy

### Approach: Section-based JSON editing via React components

**Why not raw HTML editing?**
- Cannot reliably identify section boundaries
- No clean way to move/duplicate/delete sections
- Regeneration would require re-parsing arbitrary HTML
- Version diffs would be meaningless

**Why not a full block editor framework (GrapesJS)?**
- Heavy dependency for what we need
- Difficult to integrate with our AI generation pipeline
- Opinionated about storage format
- Harder to customize section-level operations

**Chosen approach: Custom React section editor**

Each section type has:
1. A **view component** that renders the section visually
2. An **edit component** that adds inline editing capabilities
3. A **section config schema** that defines editable properties

The editor renders the page as a vertical stack of section components. Each section component reads from the sections JSON array in React state and renders accordingly. In edit mode, overlays and click handlers enable inline editing.

### Edit Flow Detail

1. User enters edit mode → `EditorContext` loads `sections_json` into state
2. Each `SectionWrapper` component renders its section with edit overlays
3. Clicking an element triggers `InlineEditor` for that property
4. `InlineEditor` updates the corresponding path in the sections state
5. Section controls (move/delete/duplicate) modify the sections array in state
6. Nothing is persisted until Save is clicked
7. Save sends the entire sections array to the backend

### Tradeoffs accepted

- Slightly less flexible than raw HTML editing (users can't add arbitrary HTML)
- But much more reliable, predictable, and maintainable
- Section types are finite and well-defined
- New section types can be added by creating a new component + template

---

## 8. AI Workflow Strategy

### Missing Information Detection

The intake agent receives the initial business context and runs it through a checklist of required fields:
- Business type/product/service
- Target audience
- Primary CTA action
- Tone/voice
- Key differentiators
- Testimonial/social proof material
- Contact information

For each missing field, the AI generates a natural question. Questions are asked in batches of 1-3 to keep the conversation natural.

### Question Asking

Questions are conversational, not form-like. The AI adapts based on what's already known. For example, if the user already mentioned their audience in the business description, the AI won't ask again.

The conversation continues until the AI determines it has enough context. The threshold is: at minimum, business type, audience, and primary CTA must be known. Other fields can use intelligent defaults.

### Placeholder Generation (Fast Draft Mode)

When the user wants to skip questions:
- AI fills missing fields with reasonable defaults
- Generated content is marked with `placeholder: true`
- Placeholders are visually distinct in the editor (highlighted border)
- Users can replace placeholders during editing

### Plan Generation

The planner takes accumulated `ai_context` + `competitor_insights` and produces:
```json
{
  "sections": [
    {"type": "hero", "description": "Bold headline with CTA"},
    {"type": "features", "description": "3 key benefits with icons"},
    ...
  ],
  "branding": {
    "primary_color": "#2563eb",
    "secondary_color": "#1e40af",
    "font_family": "Inter",
    "tone": "professional"
  },
  "page_meta": {
    "title": "...",
    "description": "..."
  }
}
```

### HTML/Section Generation

The generator takes the approved plan and produces structured section JSON. Each section is generated individually with full context of what other sections exist (to avoid repetition).

The AI is instructed to output valid JSON matching the section schema. Output is validated before storage. Invalid sections trigger a retry (up to 2 attempts) before falling back to a template with placeholder content.

### Regeneration After Edits

Section-level only. The section updater receives:
- The current section JSON
- The overall page context (other section summaries)
- User instructions (optional)

It returns an updated section JSON that replaces just that section.

---

## 9. Risks and Complexity Areas

### Critical Risks

1. **AI output schema compliance**: AI must produce valid JSON matching section schemas. Mitigation: validation layer, retry logic, fallback templates.

2. **Editor state management**: Complex state with undo potential. Mitigation: immutable state updates, clear data flow, save-only persistence.

3. **Save data loss**: Any bug in save flow could lose user work. Mitigation: PageVersion backups, optimistic UI with rollback.

### Significant Risks

4. **Competitor scraping**: Many sites block automated access. Mitigation: graceful degradation, screenshot upload fallback, clear user messaging.

5. **Conversation state recovery**: If user leaves mid-conversation and returns. Mitigation: full conversation state persisted, workflow_state tracks exact position.

6. **HTML rendering consistency**: Rendered HTML must faithfully represent sections JSON. Mitigation: section templates are simple Jinja2, tested per type.

### Moderate Risks

7. **Section type evolution**: Adding new types must not break existing pages. Mitigation: each type is independent, renderer skips unknown types gracefully.

8. **Performance with many sections**: Large pages could be slow in the editor. Mitigation: unlikely for landing pages (typically 5-10 sections).

9. **Image management**: User image uploads need storage. Mitigation: local filesystem for MVP, clear upload API.

---

## 10. Build Recommendation

### For the current version, the most implementation-safe approach is:

1. **Flask + React monorepo** with the backend serving both the API and the React SPA build.

2. **SQLite** for simplicity. All models via SQLAlchemy for future migration readiness.

3. **Custom AI orchestration** as a Python state machine. No LangGraph or CrewAI — they add complexity without proportional benefit for this workflow shape.

4. **Section-based JSON as source of truth** with server-side HTML rendering via Jinja2 templates per section type.

5. **Custom React section editor** — not GrapesJS, not contentEditable on raw HTML. Structured editing of typed section components.

6. **OpenAI API with JSON mode** for all AI generation steps. Centralized prompt modules.

7. **Explicit save with version backups**. No auto-save, no silent regeneration.

8. **Build phase by phase** starting with foundation, then auth, then dashboard, then AI workflow, then generation, then editor — each phase producing a working increment.

This approach minimizes framework risk, keeps the codebase understandable, and builds the most complex parts (editor, AI orchestration, save/regeneration) on solid foundations.
