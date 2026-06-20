# Guhr Onboarding CRM - Trial Project

Kanban-style client onboarding cockpit for **Guhr Steuerberatungsgesellschaft mbH**, built for the AI Automation Engineer trial project.

This is not a generic Trello clone. It is designed around the real onboarding flow of a modern German tax advisory firm: first inquiry, consultation, mandate fit, Vollmacht, Stammdaten, document review, Mandatsvertrag, team handover, and paused cases.

## Live Product Idea

Guhr Onboarding CRM is an internal CRM board for managing new tax advisory clients from first contact to active mandate.

The product focuses on:

- Clear onboarding stages specific to tax advisory work
- Compact client cards for non-technical staff
- Detailed mandate information in a side drawer
- Tax-specific checklists by mandate type
- Real database persistence through Supabase
- AI-assisted follow-up email generation through OpenAI
- English/German interface toggle
- Responsive mobile layout with swipeable Kanban columns

## Tech Stack

- **React + TypeScript** for a typed, maintainable frontend
- **Vite** for fast local development and simple production builds
- **Tailwind CSS** for a custom, minimal Guhr-inspired interface
- **@dnd-kit** for accessible drag-and-drop interactions
- **Zustand** for lightweight client-side state orchestration
- **Supabase** for the production database, relational data, RLS policies, and persistence
- **OpenAI Responses API** for AI-generated follow-up drafts
- **Lucide React** for clean interface icons
- **Vercel Edge API route** for keeping the OpenAI API key server-side

## Why This Approach

The task asked for a simple Kanban CRM, but the implementation treats the board as a real business workflow instead of a generic card board.

The columns and card details reflect tax advisory onboarding:

- New Inquiry
- Initial Consultation Scheduled
- Qualified / Mandate Fit
- Vollmacht & Documents Requested
- Documents Received / Review
- Mandatsvertrag Sent
- Signed & Active
- On Hold / Paused

The checklist templates are mandate-specific. For example, a GmbH card can require Handelsregisterauszug, Gesellschaftsvertrag, previous Jahresabschluss, bank statements, DATEV export, Vollmacht, and Mandatsvertrag. A Steuerberaterwechsel card focuses more on Stammdaten, previous advisor contact, DATEV export, open deadlines, and signed documents.

## Main Features

- Drag-and-drop Kanban board with smooth card movement
- Full-card dragging, not only a tiny handle
- Mobile swipe layout with one board column per view
- Add new client directly into any column
- Full client detail drawer
- Editable client fields
- Editable notes and next steps
- Editable, addable, removable checklist items
- Activity timeline for moves and checklist changes
- Search and filters by text, mandate type, team member, and status
- Dashboard metrics for new inquiries, waiting documents, overdue follow-ups, and signed this month
- Supabase-backed persistence
- AI follow-up generator
- English/German interface toggle
- Responsive layout for desktop and mobile

## AI Feature

The follow-up generator is connected to OpenAI through a server-side API route:

- Frontend builds a structured payload from the selected client card.
- Payload includes client name, mandate type, current stage, priority, status, notes, next step, missing checklist items, completed checklist items, and selected output language.
- The API route calls OpenAI with a constrained system prompt.
- The model returns a concise follow-up email draft.
- The response is shown in the detail drawer and can be copied.

The OpenAI key is never exposed in the browser. It is read from the server environment as `OPENAI_API_KEY`.

The prompt is intentionally conservative:

- Do not invent documents, facts, deadlines, legal advice, or tax advice.
- Mention only missing checklist items provided by the app.
- Return only the email draft.
- Support German or English depending on the language toggle.

## Supabase Backend

The app is connected to a real Supabase database, not local dummy state. This makes it a production-ready foundation for a hosted internal tool.

The schema includes:

- `board_columns`
- `status_tags`
- `team_members`
- `mandate_types`
- `lead_sources`
- `checklist_templates`
- `clients`
- `client_mandates`
- `client_checklist_items`
- `client_activity`

The database stores all operational board data:

- Client cards
- Current stage
- Card position
- Assigned team member
- Lead source
- Mandate type
- Notes and next step
- Checklist state
- Activity timeline

Because the trial requirement has no login, the Supabase RLS policies are configured for direct page access with anonymous read/write permissions. For real client data in production, the next step would be Supabase Auth, role-based permissions, stricter RLS policies, and audit logs per user.

## Project Structure

```txt
api/
  generate-follow-up.ts        # Edge API route for AI follow-up generation
  openAiFollowUpCore.ts        # OpenAI request construction and response parsing

supabase/
  schema.sql                   # Database schema, lookup data, RLS policies
  demo-data.sql                # Optional showcase client data

src/
  components/
    board/                     # Kanban board and columns
    cards/                     # Client card UI
    layout/                    # Header, metrics, filters
    modals/                    # Add client and detail drawers
    ui/                        # Small reusable UI primitives
  data/
    board.ts                   # Board defaults and checklist helpers
  hooks/
    useFilteredClients.ts      # Search/filter logic
    useBodyScrollLock.ts       # Drawer scroll lock
  lib/
    boardRepository.ts         # Supabase read/write adapter
    i18n.ts                    # English/German UI translations
    supabase.ts                # Supabase client setup
    utils.ts                   # Classname utility
  store/
    useBoardStore.ts           # Zustand board state and actions
    useLanguageStore.ts        # Language preference state
  types/
    index.ts                   # Shared TypeScript domain types
  utils/
    aiFollowUp.ts              # Frontend AI payload builder
    dates.ts                   # Date formatting utilities
    recommendations.ts         # Follow-up recommendation logic
```

## Architecture Notes

The frontend keeps the UI responsive with Zustand, but Supabase remains the source of truth.

Typical data flow:

1. `App.tsx` loads board data through `useBoardStore`.
2. `useBoardStore` calls `loadBoardData()` in `boardRepository.ts`.
3. `boardRepository.ts` queries Supabase tables and maps relational rows into typed `ClientCard` objects.
4. UI components render cards, columns, filters, metrics, drawers, and checklists.
5. User actions update the store optimistically where useful.
6. Supabase mutations persist moves, edits, checklist updates, and activity entries.
7. The board reloads after write operations where relational data needs to be refreshed.

The AI flow is separate from persistence. Generated follow-up drafts are intentionally not stored. They are derived from the current card state and generated on demand.

## Local Setup

Install dependencies:

```bash
npm install
```

Create environment variables:

```bash
cp .env.example .env
```

Fill in:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.5
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Database Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Paste and run:

```txt
supabase/schema.sql
```

This creates the database schema, lookup data, checklist templates, triggers, indexes, grants, and RLS policies.

Optional showcase data:

```txt
supabase/demo-data.sql
```

Run this only if you want pre-filled realistic sample clients for a demo.

## Deployment

The project is ready for deployment on Vercel.

Recommended Vercel environment variables:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.5
```

The AI route lives in:

```txt
api/generate-follow-up.ts
```

On Vercel this runs as an Edge function and keeps the OpenAI key server-side.

For Netlify, the frontend can be deployed as a static Vite app, but the AI route should be adapted to a Netlify Function or `VITE_AI_FOLLOWUP_ENDPOINT` should point to another compatible server endpoint.

## Workflow

I approached the project in product-first order:

1. Model the actual tax advisory onboarding workflow.
2. Build the Kanban surface and client cards.
3. Add realistic detail views, checklists, and activity history.
4. Polish the visual language to match a calm, premium Guhr-style internal tool.
5. Replace local demo state with a real Supabase schema and repository layer.
6. Add OpenAI-powered follow-up generation with a server-side API route.
7. Add responsive/mobile behavior and English/German UI support.

AI coding assistance was used as a pair-programming aid for speed, iteration, code review, and UI refinement. Product decisions, workflow modeling, architecture, database structure, and final implementation choices were kept aligned with the trial brief and Guhr's business context.

## What I Would Improve Next

With more time, I would add:

- User authentication with Supabase Auth
- Role-based permissions for partners, staff, and admins
- Full audit logs for every card and document action
- Document upload per client
- AI document parsing for Vollmacht, Stammdaten, tax assessments, bank statements, payroll documents, and DATEV exports
- AI completeness checks against mandate-specific checklists
- AI-generated templates for reminders, missing document requests, consultation preparation, and handover notes
- Configurable columns and custom onboarding workflows
- Column-specific automations and rule-based actions
- Outlook calendar integration for consultation scheduling
- Microsoft Teams integration for internal handover or reminders
- Email integration for sending approved follow-up drafts
- DATEV/document workflow integrations
- Reminder automation for overdue follow-ups
- More granular mobile drag-and-drop testing across devices
- Production-grade automated tests

## Time Log

Initially it took around 4-5 hours for a working demo product with static data, but then furthermore added certain features and made it production ready connected to database, mobile responsive and deployed to vercel. Overall I can wrap it around 7-8 hours of work.

## Final Note

This project is intended to show how a focused internal product could support Guhr's onboarding workflow: lightweight enough for staff to enjoy using, specific enough to fit tax advisory work, and structured enough to grow into a production platform with real data, AI automation, document processing, and business integrations.
