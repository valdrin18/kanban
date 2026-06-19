-- Guhr Onboarding CRM - Supabase schema
-- Paste this into the Supabase SQL editor for a fresh project.
-- It intentionally seeds lookup/workflow data only. No client cards are inserted.

create extension if not exists pgcrypto;

create table if not exists public.status_tags (
  id text primary key,
  label text not null,
  tone text not null check (tone in ('neutral', 'gold', 'green', 'orange', 'red', 'gray')),
  sort_order integer not null unique
);

create table if not exists public.board_columns (
  id text primary key,
  title text not null,
  description text not null,
  default_status text not null references public.status_tags(id),
  sort_order integer not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.mandate_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.lead_sources (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  sort_order integer not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.checklist_templates (
  id uuid primary key default gen_random_uuid(),
  mandate_type_id uuid not null references public.mandate_types(id) on delete cascade,
  label text not null,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  unique (mandate_type_id, label)
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  assigned_team_member_id uuid not null references public.team_members(id),
  lead_source_id uuid not null references public.lead_sources(id),
  date_added timestamptz not null default now(),
  current_stage text not null references public.board_columns(id),
  stage_updated_at timestamptz not null default now(),
  status text not null references public.status_tags(id),
  priority text not null default 'Normal' check (priority in ('Low', 'Normal', 'High')),
  notes text not null default '',
  next_step text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_mandates (
  client_id uuid not null references public.clients(id) on delete cascade,
  mandate_type_id uuid not null references public.mandate_types(id),
  sort_order integer not null default 0,
  primary key (client_id, mandate_type_id)
);

create table if not exists public.client_checklist_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  label text not null,
  completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_activity (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  detail text,
  type text not null check (type in ('created', 'moved', 'checklist')),
  created_at timestamptz not null default now()
);

create index if not exists clients_stage_position_idx
  on public.clients (current_stage, position);

create index if not exists client_mandates_client_id_idx
  on public.client_mandates (client_id, sort_order);

create index if not exists client_checklist_items_client_id_idx
  on public.client_checklist_items (client_id, sort_order);

create index if not exists client_activity_client_id_idx
  on public.client_activity (client_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_clients_updated_at on public.clients;
create trigger set_clients_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists set_client_checklist_items_updated_at on public.client_checklist_items;
create trigger set_client_checklist_items_updated_at
before update on public.client_checklist_items
for each row execute function public.set_updated_at();

insert into public.status_tags (id, label, tone, sort_order) values
  ('new-lead', 'New lead', 'gold', 10),
  ('consultation-booked', 'Consultation booked', 'neutral', 20),
  ('qualified', 'Qualified', 'green', 30),
  ('waiting-documents', 'Waiting documents', 'orange', 40),
  ('missing-documents', 'Missing documents', 'red', 50),
  ('internal-review', 'Internal review', 'neutral', 60),
  ('awaiting-signature', 'Awaiting signature', 'orange', 70),
  ('active', 'Active', 'green', 80),
  ('paused', 'Paused', 'gray', 90)
on conflict (id) do update set
  label = excluded.label,
  tone = excluded.tone,
  sort_order = excluded.sort_order;

insert into public.board_columns (id, title, description, default_status, sort_order) values
  ('new-inquiry', 'New Inquiry', 'First contact received, not yet qualified.', 'new-lead', 10),
  ('consultation-scheduled', 'Initial Consultation Scheduled', 'Meeting booked, awaiting first call.', 'consultation-booked', 20),
  ('qualified-fit', 'Qualified / Mandate Fit', 'Mandate type confirmed and client appears to be a good fit.', 'qualified', 30),
  ('documents-requested', 'Vollmacht & Documents Requested', 'Power of attorney, master data, and tax documents requested.', 'waiting-documents', 40),
  ('documents-review', 'Documents Received / Review', 'Documents are in and internal review is in progress.', 'internal-review', 50),
  ('contract-sent', 'Mandatsvertrag Sent', 'Engagement letter or contract has been sent.', 'awaiting-signature', 60),
  ('signed-active', 'Signed & Active', 'Client fully onboarded and handed over to the team.', 'active', 70),
  ('paused', 'On Hold / Paused', 'Onboarding stalled, delayed, or paused.', 'paused', 80)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  default_status = excluded.default_status,
  sort_order = excluded.sort_order;

insert into public.team_members (name, sort_order) values
  ('Karsten Guhr', 10),
  ('Sophie Weber', 20),
  ('Max Keller', 30),
  ('Lisa Braun', 40)
on conflict (name) do update set
  sort_order = excluded.sort_order,
  active = true;

insert into public.mandate_types (name, sort_order) values
  ('Einkommensteuer', 10),
  ('GmbH', 20),
  ('Freelancer', 30),
  ('Steuerberaterwechsel', 40),
  ('Finanzbuchhaltung', 50),
  ('Lohnbuchhaltung', 60),
  ('Jahresabschluss', 70),
  ('Heilberufe', 80),
  ('Rechtsanwälte', 90),
  ('Architekten', 100),
  ('IT-Beratung', 110),
  ('Influencer / Creator', 120),
  ('Praxisgründung', 130)
on conflict (name) do update set
  sort_order = excluded.sort_order,
  active = true;

insert into public.lead_sources (label, sort_order) values
  ('Website inquiry', 10),
  ('Google Search', 20),
  ('LinkedIn', 30),
  ('Referral from existing client', 40),
  ('Partner recommendation', 50),
  ('Instagram profile', 60),
  ('Local business network', 70),
  ('Tax newsletter', 80),
  ('Existing network', 90),
  ('Manual entry', 100)
on conflict (label) do update set
  sort_order = excluded.sort_order,
  active = true;

insert into public.checklist_templates (mandate_type_id, label, sort_order)
select mt.id, template.label, template.sort_order
from public.mandate_types mt
join (
  values
    ('GmbH', 'Handelsregisterauszug received', 10),
    ('GmbH', 'Gesellschaftsvertrag received', 20),
    ('GmbH', 'Previous Jahresabschluss received', 30),
    ('GmbH', 'Bank statements received', 40),
    ('GmbH', 'DATEV export requested', 50),
    ('GmbH', 'Vollmacht signed', 60),
    ('GmbH', 'Mandatsvertrag signed', 70),
    ('Freelancer', 'Steuer-ID received', 10),
    ('Freelancer', 'Basic income overview received', 20),
    ('Freelancer', 'Invoices / receipts received', 30),
    ('Freelancer', 'Previous tax assessment received', 40),
    ('Freelancer', 'Vollmacht signed', 50),
    ('Freelancer', 'Mandatsvertrag signed', 60),
    ('Steuerberaterwechsel', 'Vollmacht signed', 10),
    ('Steuerberaterwechsel', 'Stammdaten received', 20),
    ('Steuerberaterwechsel', 'Previous advisor contacted', 30),
    ('Steuerberaterwechsel', 'DATEV export requested', 40),
    ('Steuerberaterwechsel', 'Open deadlines reviewed', 50),
    ('Steuerberaterwechsel', 'Mandatsvertrag signed', 60),
    ('Finanzbuchhaltung', 'Accounting scope confirmed', 10),
    ('Finanzbuchhaltung', 'Bank access clarified', 20),
    ('Finanzbuchhaltung', 'Document upload process explained', 30),
    ('Finanzbuchhaltung', 'DATEV Unternehmen online invited', 40),
    ('Finanzbuchhaltung', 'Vollmacht signed', 50),
    ('Finanzbuchhaltung', 'Mandatsvertrag signed', 60),
    ('Lohnbuchhaltung', 'Employee count received', 10),
    ('Lohnbuchhaltung', 'Payroll start date confirmed', 20),
    ('Lohnbuchhaltung', 'ELStAM access clarified', 30),
    ('Lohnbuchhaltung', 'Social security registrations reviewed', 40),
    ('Lohnbuchhaltung', 'Payroll history received', 50),
    ('Lohnbuchhaltung', 'Mandatsvertrag signed', 60),
    ('Jahresabschluss', 'Trial balance received', 10),
    ('Jahresabschluss', 'Previous Jahresabschluss received', 20),
    ('Jahresabschluss', 'Open items list received', 30),
    ('Jahresabschluss', 'Bank statements received', 40),
    ('Jahresabschluss', 'Fixed asset schedule received', 50),
    ('Jahresabschluss', 'Mandatsvertrag signed', 60),
    ('Heilberufe', 'Practice registration details received', 10),
    ('Heilberufe', 'Revenue split clarified', 20),
    ('Heilberufe', 'Insurance documents received', 30),
    ('Heilberufe', 'Bank statements received', 40),
    ('Heilberufe', 'Vollmacht signed', 50),
    ('Heilberufe', 'Mandatsvertrag signed', 60),
    ('Rechtsanwälte', 'Professional registration confirmed', 10),
    ('Rechtsanwälte', 'Trust account handling clarified', 20),
    ('Rechtsanwälte', 'Revenue model reviewed', 30),
    ('Rechtsanwälte', 'Previous tax assessment received', 40),
    ('Rechtsanwälte', 'Vollmacht signed', 50),
    ('Rechtsanwälte', 'Mandatsvertrag signed', 60),
    ('Architekten', 'Project revenue overview received', 10),
    ('Architekten', 'Open project list received', 20),
    ('Architekten', 'Previous Jahresabschluss received', 30),
    ('Architekten', 'Bank statements received', 40),
    ('Architekten', 'Vollmacht signed', 50),
    ('Architekten', 'Mandatsvertrag signed', 60),
    ('IT-Beratung', 'Service scope confirmed', 10),
    ('IT-Beratung', 'Revenue structure reviewed', 20),
    ('IT-Beratung', 'Invoices / receipts received', 30),
    ('IT-Beratung', 'VAT setup clarified', 40),
    ('IT-Beratung', 'Vollmacht signed', 50),
    ('IT-Beratung', 'Mandatsvertrag signed', 60),
    ('Influencer / Creator', 'Platform revenue overview received', 10),
    ('Influencer / Creator', 'Sponsorship contracts requested', 20),
    ('Influencer / Creator', 'Expense categories reviewed', 30),
    ('Influencer / Creator', 'VAT treatment clarified', 40),
    ('Influencer / Creator', 'Vollmacht signed', 50),
    ('Influencer / Creator', 'Mandatsvertrag signed', 60),
    ('Praxisgründung', 'Founding timeline confirmed', 10),
    ('Praxisgründung', 'Registration documents received', 20),
    ('Praxisgründung', 'Bank account setup clarified', 30),
    ('Praxisgründung', 'Investment plan received', 40),
    ('Praxisgründung', 'Vollmacht signed', 50),
    ('Praxisgründung', 'Mandatsvertrag signed', 60)
) as template(mandate_name, label, sort_order)
  on mt.name = template.mandate_name
on conflict (mandate_type_id, label) do update set
  sort_order = excluded.sort_order;

grant usage on schema public to anon, authenticated;
grant select on public.status_tags to anon, authenticated;
grant select on public.board_columns to anon, authenticated;
grant select on public.team_members to anon, authenticated;
grant select on public.mandate_types to anon, authenticated;
grant select on public.lead_sources to anon, authenticated;
grant select on public.checklist_templates to anon, authenticated;
grant select, insert, update, delete on public.clients to anon, authenticated;
grant select, insert, update, delete on public.client_mandates to anon, authenticated;
grant select, insert, update, delete on public.client_checklist_items to anon, authenticated;
grant select, insert, update, delete on public.client_activity to anon, authenticated;

alter table public.status_tags enable row level security;
alter table public.board_columns enable row level security;
alter table public.team_members enable row level security;
alter table public.mandate_types enable row level security;
alter table public.lead_sources enable row level security;
alter table public.checklist_templates enable row level security;
alter table public.clients enable row level security;
alter table public.client_mandates enable row level security;
alter table public.client_checklist_items enable row level security;
alter table public.client_activity enable row level security;

drop policy if exists "Public read status tags" on public.status_tags;
create policy "Public read status tags" on public.status_tags
for select to anon, authenticated using (true);

drop policy if exists "Public read board columns" on public.board_columns;
create policy "Public read board columns" on public.board_columns
for select to anon, authenticated using (true);

drop policy if exists "Public read team members" on public.team_members;
create policy "Public read team members" on public.team_members
for select to anon, authenticated using (active = true);

drop policy if exists "Public read mandate types" on public.mandate_types;
create policy "Public read mandate types" on public.mandate_types
for select to anon, authenticated using (active = true);

drop policy if exists "Public read lead sources" on public.lead_sources;
create policy "Public read lead sources" on public.lead_sources
for select to anon, authenticated using (active = true);

drop policy if exists "Public read checklist templates" on public.checklist_templates;
create policy "Public read checklist templates" on public.checklist_templates
for select to anon, authenticated using (true);

drop policy if exists "Public read clients" on public.clients;
create policy "Public read clients" on public.clients
for select to anon, authenticated using (true);

drop policy if exists "Public insert clients" on public.clients;
create policy "Public insert clients" on public.clients
for insert to anon, authenticated with check (true);

drop policy if exists "Public update clients" on public.clients;
create policy "Public update clients" on public.clients
for update to anon, authenticated using (true) with check (true);

drop policy if exists "Public delete clients" on public.clients;
create policy "Public delete clients" on public.clients
for delete to anon, authenticated using (true);

drop policy if exists "Public read client mandates" on public.client_mandates;
create policy "Public read client mandates" on public.client_mandates
for select to anon, authenticated using (true);

drop policy if exists "Public insert client mandates" on public.client_mandates;
create policy "Public insert client mandates" on public.client_mandates
for insert to anon, authenticated with check (true);

drop policy if exists "Public update client mandates" on public.client_mandates;
create policy "Public update client mandates" on public.client_mandates
for update to anon, authenticated using (true) with check (true);

drop policy if exists "Public delete client mandates" on public.client_mandates;
create policy "Public delete client mandates" on public.client_mandates
for delete to anon, authenticated using (true);

drop policy if exists "Public read checklist items" on public.client_checklist_items;
create policy "Public read checklist items" on public.client_checklist_items
for select to anon, authenticated using (true);

drop policy if exists "Public insert checklist items" on public.client_checklist_items;
create policy "Public insert checklist items" on public.client_checklist_items
for insert to anon, authenticated with check (true);

drop policy if exists "Public update checklist items" on public.client_checklist_items;
create policy "Public update checklist items" on public.client_checklist_items
for update to anon, authenticated using (true) with check (true);

drop policy if exists "Public delete checklist items" on public.client_checklist_items;
create policy "Public delete checklist items" on public.client_checklist_items
for delete to anon, authenticated using (true);

drop policy if exists "Public read activity" on public.client_activity;
create policy "Public read activity" on public.client_activity
for select to anon, authenticated using (true);

drop policy if exists "Public insert activity" on public.client_activity;
create policy "Public insert activity" on public.client_activity
for insert to anon, authenticated with check (true);

drop policy if exists "Public delete activity" on public.client_activity;
create policy "Public delete activity" on public.client_activity
for delete to anon, authenticated using (true);
