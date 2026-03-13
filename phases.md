# Phases Document

## Phase 1: Foundation and Project Setup

**Goal**: Establish the project structure, tooling, and development environment so all subsequent phases build on a clean foundation.

**Scope**:
- Initialize Flask backend with app factory pattern
- Initialize React frontend with Vite + Tailwind CSS
- Set up SQLAlchemy with SQLite
- Create database models (User, Project, Conversation, PagePlan, Page, PageVersion)
- Configure CORS, static file serving, and development proxy
- Set up project directory structure matching design.md

**Dependencies**: None (first phase)

**Parallelizable tasks**:
- Backend setup (Flask, SQLAlchemy, models) can be done in parallel with frontend setup (React, Vite, Tailwind)
- Database model creation is independent of route setup

**Outputs**:
- Running Flask server with database initialization
- Running React dev server with Tailwind configured
- All models defined and tables created
- Project structure matches design.md layout

**Done criteria**:
- `flask run` starts without errors
- `npm run dev` starts the React app
- Database tables are created on first run
- Models can be imported and used in a shell

**Risks**:
- None significant. Standard setup.

**Notes**:
- Use Vite for React (faster than CRA)
- Configure Flask to serve the React build in production mode
- Set up `.env` for configuration (API keys, secret key, database URL)

---

## Phase 2: Authentication and User Flows

**Goal**: Implement complete user registration, login, logout, and session management.

**Scope**:
- Backend: auth routes (register, login, logout, me)
- Backend: auth service (password hashing, session management)
- Backend: Flask-Login integration
- Frontend: Register page with form validation
- Frontend: Login page with form validation
- Frontend: AuthContext for global auth state
- Frontend: Protected route wrapper
- Frontend: Navbar with auth state (login/register or user name/logout)

**Dependencies**: Phase 1 (project structure, User model)

**Parallelizable tasks**:
- Backend auth routes + service can be built alongside frontend auth pages
- Register and Login pages are independent of each other

**Outputs**:
- Users can register with name, email, password
- Users can log in and receive a session
- Protected routes redirect to login if unauthenticated
- Navbar reflects auth state

**Done criteria**:
- Register creates user in database with hashed password
- Login validates credentials and creates session
- `/api/auth/me` returns current user when logged in
- Frontend redirects unauthenticated users to login
- Email uniqueness is enforced

**Risks**:
- Session management across Flask API + React SPA requires proper CORS and cookie configuration

**Notes**:
- Use bcrypt for password hashing
- Use Flask-Login for session management with cookie-based auth
- No JWT for MVP — session-based is simpler for same-origin

---

## Phase 3: Dashboard and Project Model

**Goal**: Implement the dashboard view and project CRUD so users can create and manage landing page projects.

**Scope**:
- Backend: project routes (create, list, get, update)
- Backend: project service (slug generation, validation)
- Frontend: Dashboard page with project list
- Frontend: New Project form page
- Frontend: Empty state, loading state, error state for dashboard
- Frontend: Project cards with status, date, actions

**Dependencies**: Phase 2 (authentication, protected routes)

**Parallelizable tasks**:
- Backend project API can be built alongside frontend Dashboard UI
- Dashboard list view and New Project form are independent

**Outputs**:
- Users can create projects with name, business description, optional fields
- Dashboard shows all user projects with status and actions
- Slug is auto-generated from project name
- Projects are scoped to the authenticated user

**Done criteria**:
- POST `/api/projects` creates a project with auto-slug
- GET `/api/projects` returns only the current user's projects
- Dashboard displays projects or empty state
- New Project form validates required fields
- Clicking a project navigates to the appropriate screen based on status

**Risks**:
- Slug uniqueness edge cases (multiple users, same name)

**Notes**:
- Slug generation: lowercase, hyphenated, append number if duplicate
- Project status enum: draft, building, generated, published

---

## Phase 4: AI Conversation Workflow

**Goal**: Implement the AI Builder screen with conversational intake, requirement gathering, and follow-up question logic.

**Scope**:
- Backend: AI orchestrator with workflow state machine
- Backend: Intake agent — analyzes context, generates questions
- Backend: Conversation model persistence (messages + ai_context)
- Backend: AI builder routes (send message, get conversation state)
- Backend: Prompt modules for intake
- Frontend: AI Builder page with split-panel layout
- Frontend: Chat panel (message list, input, send)
- Frontend: Structured output panel (right side)
- Frontend: AI "thinking" indicator

**Dependencies**: Phase 3 (project model, project creation)

**Parallelizable tasks**:
- Backend orchestrator + intake agent can be built alongside frontend chat UI
- Prompt design is independent of UI work

**Outputs**:
- User starts AI Builder and sees initial AI greeting/question
- User can send messages, AI responds with follow-up questions
- AI accumulates structured context from conversation
- Conversation state is persisted and recoverable on page refresh
- Workflow transitions from intake to next stage when sufficient context gathered

**Done criteria**:
- AI asks relevant follow-up questions based on missing info
- Conversation persists across page refreshes
- AI context accumulates structured data from user answers
- Workflow state transitions correctly from intake to next stage

**Risks**:
- AI response quality depends on prompt engineering
- Response latency may affect UX (mitigate with thinking indicator)

**Notes**:
- Use OpenAI API with JSON mode for structured context extraction
- Start with polling for AI responses; upgrade to SSE if needed
- The orchestrator tracks workflow_state and decides next action

---

## Phase 5: Competitor Analysis Flow

**Goal**: Implement competitor URL intake, page scraping, structural analysis, and fallback to screenshot upload.

**Scope**:
- Backend: Competitor analyzer agent
- Backend: Web scraping service (requests + BeautifulSoup)
- Backend: Competitor analysis prompts
- Backend: Screenshot upload endpoint
- Frontend: Competitor analysis display in structured output panel
- Frontend: Screenshot upload UI (fallback when scraping fails)

**Dependencies**: Phase 4 (AI orchestrator, conversation flow)

**Parallelizable tasks**:
- Scraping service is independent of the AI analysis prompts
- Frontend screenshot upload is independent of backend scraping

**Outputs**:
- System fetches competitor URLs and extracts page structure
- AI analyzes extracted content for section patterns, CTA placement, layout
- Competitor insights stored as structured JSON
- Fallback to screenshot upload with clear messaging
- Results displayed in structured output panel

**Done criteria**:
- Competitor URL is fetched and parsed
- AI extracts meaningful section structure from page content
- Scraping failure shows clear message and screenshot upload option
- Competitor insights are persisted on the project
- Workflow transitions to planning after analysis

**Risks**:
- Many sites block automated scraping (rate limiting, JavaScript-rendered content)
- Content extraction quality varies widely

**Notes**:
- Use requests with a reasonable user agent
- Extract text content, headings structure, link patterns, image count
- Don't try to render JavaScript — extract what's in the HTML
- Screenshot analysis via AI vision if uploaded

---

## Phase 6: Plan Generation and Approval

**Goal**: Implement AI plan generation, plan display, and user approval/modification flow.

**Scope**:
- Backend: Planner agent — generates page plan from context + competitor insights
- Backend: PagePlan model persistence
- Backend: Plan routes (generate, get, approve, modify)
- Backend: Planner prompts
- Frontend: Plan viewer component with section list visualization
- Frontend: Approve and Modify buttons
- Frontend: Plan modification chat interaction

**Dependencies**: Phase 4 (AI orchestrator), Phase 5 (competitor data available)

**Parallelizable tasks**:
- Backend planner agent + prompts alongside frontend plan viewer
- Plan approval API and plan modification API are independent

**Outputs**:
- AI generates a structured page plan with sections, branding, and descriptions
- Plan is displayed visually (ordered section list with descriptions)
- User can approve the plan (triggers generation)
- User can request modifications (AI revises plan)
- Approved plan is persisted

**Done criteria**:
- AI produces a valid plan JSON with sections and branding
- Plan renders correctly in the viewer
- Approve triggers workflow transition to generation
- Modify sends feedback to AI and generates revised plan
- Plan is stored in PagePlan model

**Risks**:
- Plan quality depends on accumulated context quality
- Modification loop could be unbounded (set reasonable limit)

**Notes**:
- Plan JSON schema: sections[] (type, description), branding (colors, font), page_meta (title, description)
- Limit plan modifications to 5 rounds before suggesting approval

---

## Phase 7: Page Generation and Rendering

**Goal**: Generate the full landing page from the approved plan as structured sections JSON, render to HTML, and serve at the page URL.

**Scope**:
- Backend: Generator agent — produces section JSON per section in plan
- Backend: Generator prompts (one per section type)
- Backend: Section JSON schema validation
- Backend: HTML renderer service (Jinja2 templates per section type)
- Backend: Page base template (full HTML document)
- Backend: Page route (`/app/page/<slug>`)
- Backend: Page service (create page, render, serve)
- Section Jinja2 templates: hero, features, testimonials, pricing, FAQ, CTA, contact

**Dependencies**: Phase 6 (approved plan), Phase 1 (Page model)

**Parallelizable tasks**:
- Generator agent can be built alongside HTML renderer
- Individual section templates are independent of each other
- Page route is independent of generation logic

**Outputs**:
- AI generates structured section JSON for each section in the plan
- Sections are validated against schema
- HTML is rendered from sections JSON via Jinja2 templates
- Page is stored (sections_json, global_styles, rendered_html)
- Page is accessible at `/app/page/<slug>`
- Owner sees "Edit Page" floating button

**Done criteria**:
- Generation produces valid sections JSON for all planned sections
- HTML renders correctly as a standalone page
- Page URL returns the rendered HTML
- Page looks like a real landing page (proper styling, layout, responsive)
- "Edit Page" button visible only to page owner

**Risks**:
- AI may produce sections that don't match schema (validation + retry mitigates)
- HTML rendering must be responsive and visually polished

**Notes**:
- Use Tailwind CSS utility classes in rendered HTML for styling
- Include Google Fonts link for typography
- Make pages mobile-responsive
- The rendered HTML should be self-contained (no external JS dependencies)

---

## Phase 8: Page Editor — Core

**Goal**: Implement the visual section-based editor with inline editing, section controls, and the editor toolbar.

**Scope**:
- Frontend: EditorContext for managing sections state
- Frontend: EditorCanvas — renders sections in edit mode
- Frontend: SectionWrapper — wraps each section with controls overlay
- Frontend: SectionControls — move up/down, duplicate, delete buttons
- Frontend: InlineEditor — click-to-edit for text, buttons, images
- Frontend: EditorToolbar — save button, preview toggle, undo
- Frontend: Section view components (edit-mode versions of each section type)
- Frontend: AddSectionMenu — insert new sections between existing ones

**Dependencies**: Phase 7 (generated page with sections JSON)

**Parallelizable tasks**:
- SectionControls is independent of InlineEditor
- Individual section edit components are independent of each other
- EditorToolbar is independent of section editing logic
- AddSectionMenu is independent of inline editing

**Outputs**:
- Editor loads sections JSON and renders editable page
- Users can click text to edit inline
- Users can move sections up/down, duplicate, delete
- Users can add new sections from templates
- Preview mode hides editing controls
- Save button visible and functional (wired in Phase 9)

**Done criteria**:
- All section types render in editor mode
- Text, button, and image elements are inline-editable
- Section controls work (reorder, duplicate, delete)
- Add section inserts a template section at chosen position
- Preview toggle works
- Editor state is managed cleanly in EditorContext

**Risks**:
- Complex state management with many interactive elements
- Inline editing UX must feel natural, not janky

**Notes**:
- Use React state (useReducer) in EditorContext for predictable state updates
- Inline editing: click element → show editable input/textarea → blur or enter saves to state
- Section controls appear on hover over section

---

## Phase 9: Save and Regeneration

**Goal**: Implement safe save behavior with version backups, and section-level AI regeneration.

**Scope**:
- Backend: Save endpoint (PUT `/api/projects/<id>/page`)
- Backend: PageVersion creation on save
- Backend: HTML re-rendering on save
- Backend: Section regeneration endpoint
- Backend: Section updater agent + prompts
- Frontend: Save flow (send sections JSON, handle response)
- Frontend: Section regenerate button and instruction input
- Frontend: Save success/error feedback
- Frontend: Version indicator

**Dependencies**: Phase 8 (editor), Phase 7 (page model, renderer)

**Parallelizable tasks**:
- Save backend + frontend can be built alongside regeneration backend + frontend
- PageVersion logic is independent of regeneration logic

**Outputs**:
- Save persists current editor state, creates version backup, re-renders HTML
- Section regeneration updates one section via AI without touching others
- Version number is displayed and incremented on save
- Error handling for save failures (data preserved in frontend state)

**Done criteria**:
- Save round-trips correctly: edit → save → reload → edits preserved
- PageVersion is created on every save
- Re-rendered HTML matches the saved sections JSON
- Section regeneration produces valid updated section
- Other sections are untouched during regeneration
- Error states are handled gracefully

**Risks**:
- Save failure after version backup but before update (mitigate with transaction)
- Regeneration output schema mismatch (validation + retry)

**Notes**:
- Use database transaction for save: create version + update page atomically
- Regeneration does NOT auto-save; user must explicitly save after reviewing AI changes
- Add confirmation dialog for "Regenerate Entire Page" (destructive action)

---

## Phase 10: Testing, Hardening, and Polish

**Goal**: End-to-end testing of all workflows, edge case handling, UI polish, and production readiness.

**Scope**:
- Test complete user journey: register → create project → AI builder → plan → generate → edit → save
- Test edge cases: refresh mid-conversation, empty states, validation errors
- Test editor reliability: rapid edits, large sections, multiple saves
- Handle all error states with user-friendly messages
- Responsive design verification
- Loading state polish (skeletons, spinners, progress indicators)
- Code cleanup and organization review
- Security review: input sanitization, auth checks on all endpoints

**Dependencies**: All previous phases

**Parallelizable tasks**:
- Frontend polish is independent of backend hardening
- Security review is independent of UX testing
- Error handling improvements can be done per feature area

**Outputs**:
- All workflows function end-to-end without errors
- Edge cases handled gracefully
- Responsive on desktop and tablet
- Error messages are clear and actionable
- No security vulnerabilities in auth or data access
- Code is clean and documented where non-obvious

**Done criteria**:
- Complete the Completion Checklist from instructions.md
- All items pass without issues
- No console errors during normal usage
- Auth protects all user-scoped endpoints
- Generated pages render correctly on different screen sizes

**Risks**:
- Scope creep during polish phase
- Discovering fundamental issues late

**Notes**:
- Use the completion checklist from instructions.md as the test plan
- Fix issues by priority: data loss bugs > functional bugs > UI polish
- Do not add new features in this phase
- Focus on reliability and user trust

---

## Phase Summary

| Phase | Name | Dependencies | Key Deliverable |
|-------|------|-------------|----------------|
| 1 | Foundation & Setup | None | Running project skeleton |
| 2 | Auth & User Flows | Phase 1 | Working registration and login |
| 3 | Dashboard & Projects | Phase 2 | Project CRUD and dashboard |
| 4 | AI Conversation | Phase 3 | Conversational intake workflow |
| 5 | Competitor Analysis | Phase 4 | URL scraping and analysis |
| 6 | Plan Generation | Phase 4, 5 | Plan creation and approval |
| 7 | Page Generation | Phase 6 | Generated pages at URLs |
| 8 | Editor Core | Phase 7 | Visual section editor |
| 9 | Save & Regeneration | Phase 7, 8 | Persistent editing with AI updates |
| 10 | Testing & Hardening | All | Production-ready application |

### Parallelization Opportunities

- **Phase 1**: Backend + frontend setup in parallel
- **Phase 2**: Backend auth + frontend auth pages in parallel
- **Phase 3**: Backend project API + frontend dashboard in parallel
- **Phase 4**: Backend AI orchestrator + frontend chat UI in parallel
- **Phase 5**: Scraping service + screenshot upload + AI prompts in parallel
- **Phase 6**: Backend planner + frontend plan viewer in parallel
- **Phase 7**: Generator agent + HTML templates + page route in parallel
- **Phase 8**: Section controls + inline editor + add section + toolbar in parallel
- **Phase 9**: Save flow + regeneration flow in parallel
- **Phase 10**: Frontend polish + backend hardening + security review in parallel
