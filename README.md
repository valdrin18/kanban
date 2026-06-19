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
- Zustand for small, readable state management.
- Zustand persistence with `localStorage` for a backend-free trial that still keeps changes.
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
- Local persistence through `localStorage`

## AI / Automation Note

The follow-up generator uses a real AI-backed workflow through a secure server-side endpoint. The React app sends only the selected client context to `/api/generate-follow-up`; the API route then calls the OpenAI Responses API with `OPENAI_API_KEY` from the server environment. The API key is never exposed to the browser.

For production, this should be extended with approved prompt templates, human review before sending, audit logging, rate limits, redaction for sensitive data, and compliance safeguards.

## How To Run Locally

```bash
npm install
npm run dev
```

AI generation requires a server-side OpenAI API key. To enable it locally, create a `.env.local` file and add a fresh OpenAI API key:

```bash
OPENAI_API_KEY=your_new_key_here
OPENAI_MODEL=gpt-5.5
```

Do not expose the key with a `VITE_` prefix. Vite serves a local `/api/generate-follow-up` middleware during `npm run dev`, and the included `api/generate-follow-up.ts` route is ready for Vercel-style deployment. On platforms without the API route or key configured, generation will show a clear configuration/API error.

## What I Would Improve With More Time

- Supabase/PostgreSQL backend
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
