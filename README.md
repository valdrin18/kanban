# Guhr Onboarding CRM - Trial Project

Guhr Onboarding CRM is a Kanban-style onboarding cockpit designed specifically for a modern digital tax advisory firm. It focuses on the client onboarding process at Guhr Steuerberatungsgesellschaft mbH, from first inquiry through Vollmacht, document review, Mandatsvertrag, and team handover.

## Why This Approach

This project was approached as a real business workflow, not as a generic Trello clone. The board stages, client data, checklist items, recommended next actions, and follow-up generator are tailored to German tax advisory onboarding. The product surface is intentionally calm and lightweight so non-technical staff can scan mandates, understand blockers, and keep onboarding moving without visual noise.

Tax-specific workflow concepts include:

- Vollmacht and Stammdaten collection
- DATEV export and document completeness checks
- Mandatsvertrag tracking
- Mandate-type-specific onboarding checklists
- Internal review and handover to the responsible team

## Tech Stack

- React + TypeScript for a maintainable, typed UI foundation.
- Vite for fast local development and straightforward deployment to Vercel or Netlify.
- Tailwind CSS for a polished custom interface without heavy styling overhead.
- Clean local UI components inspired by shadcn/ui structure.
- `@dnd-kit` for smooth, accessible drag-and-drop behavior.
- Zustand for small, readable UI state management.
- Supabase/PostgreSQL for persistent clients, checklist items, activity, workflow columns, and lookup data.
- Lucide React for refined, consistent interface icons.

## Features

- Drag-and-drop Kanban board
- Tax-specific onboarding phases
- Compact client cards with contact, mandate, owner, status, stage age, overdue indicator, and next step
- Client detail drawer
- Add client card directly into any stage
- Search and filters by text, mandate type, team member, and status
- Dashboard metrics
- Tax-specific interactive checklists
- Follow-up message generator
- Recommended next actions by stage
- Activity timeline
- Supabase persistence for all client onboarding data

## Database

The Supabase schema is included in:

```bash
supabase/schema.sql
```

Paste that file into the Supabase SQL editor for a fresh project. It creates:

- `board_columns` for the onboarding stages
- `status_tags` for status labels and tones
- `team_members` for assignable Guhr staff
- `mandate_types` and `lead_sources` lookup tables
- `checklist_templates` for mandate-specific starter checklist items
- `clients` for client cards
- `client_mandates` for client-to-mandate relationships
- `client_checklist_items` for editable checklist state
- `client_activity` for the timeline

No demo client records are inserted. The initial board is empty, with only workflow and lookup options seeded.

For a showcase dataset, run this after the schema:

```bash
supabase/demo-data.sql
```

The demo script creates realistic German tax advisory onboarding clients across the board and can be re-run safely; it removes only those demo clients by email before recreating them.

Because this trial has no login, the SQL uses public anonymous RLS policies so the frontend can read and mutate data with the Supabase anon key. That is suitable for a controlled job-trial/demo project. A production version should add authentication, role-based access, and stricter RLS policies.

## AI / Automation Note

The follow-up generator uses a real AI-backed workflow through a secure server-side endpoint. The React app sends only the selected client context to `/api/generate-follow-up`; the API route then calls the OpenAI Responses API with `OPENAI_API_KEY` from the server environment. The API key is never exposed to the browser.

For production, this should be extended with approved prompt templates, human review before sending, audit logging, rate limits, redaction for sensitive data, and compliance safeguards.

## How To Run Locally

```bash
npm install
npm run dev
```

Create a `.env.local` file with your Supabase project values:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

AI generation requires a server-side OpenAI API key. To enable it locally, create a `.env.local` file and add a fresh OpenAI API key:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_new_key_here
OPENAI_MODEL=gpt-5.5
```

Do not expose the key with a `VITE_` prefix. Vite serves a local `/api/generate-follow-up` middleware during `npm run dev`, and the included `api/generate-follow-up.ts` route is ready for Vercel-style deployment. On platforms without the API route or key configured, generation will show a clear configuration/API error.

## What I Would Improve With More Time

- User authentication
- Role-based permissions
- Audit logs
- Real email integration
- Document upload
- DATEV/document workflow integrations
- AI-assisted document completeness checks
- Calendar/reminder automation
- Production-grade testing

## Honest Time Log

Planning and workflow analysis: __ hours  
UI implementation: __ hours  
Drag-and-drop and state: __ hours  
Detail view and checklist: __ hours  
Polish and README: __ hours  
Total: __ hours
