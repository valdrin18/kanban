-- Guhr Onboarding CRM - showcase/demo client data
-- Run this after supabase/schema.sql.
-- Re-running this script removes only these demo clients by email and recreates them.

delete from public.clients
where email in (
  'finance@mueller-media.de',
  'anna.schneider@example.de',
  'hello@kayastudio.de',
  'kanzlei@weberpartner.de',
  'praxis@dr-hoffmann.de',
  'office@novak-it.de',
  'office@kreativbau.de',
  'people@berger-services.de',
  'accounting@schmidt-commerce.de'
);

with demo_clients as (
  insert into public.clients (
    name,
    email,
    phone,
    assigned_team_member_id,
    lead_source_id,
    date_added,
    current_stage,
    stage_updated_at,
    status,
    priority,
    notes,
    next_step,
    position
  )
  values
    (
      'Müller Media GmbH',
      'finance@mueller-media.de',
      '+49 30 4881 2030',
      (select id from public.team_members where name = 'Sophie Weber'),
      (select id from public.lead_sources where label = 'Referral from existing client'),
      now() - interval '11 days',
      'documents-requested',
      now() - interval '6 days',
      'waiting-documents',
      'High',
      'Client wants monthly bookkeeping to start before the next VAT pre-registration.',
      'Send reminder for missing Vollmacht and DATEV export.',
      10
    ),
    (
      'Anna Schneider',
      'anna.schneider@example.de',
      '+49 176 4400 1182',
      (select id from public.team_members where name = 'Max Keller'),
      (select id from public.lead_sources where label = 'Website inquiry'),
      now() - interval '3 days',
      'consultation-scheduled',
      now() - interval '1 day',
      'consultation-booked',
      'Normal',
      'Freelance software consultant with mixed German and EU clients.',
      'Prepare questions about income structure and current tax setup.',
      10
    ),
    (
      'Kaya Studio',
      'hello@kayastudio.de',
      '+49 30 9001 7700',
      (select id from public.team_members where name = 'Lisa Braun'),
      (select id from public.lead_sources where label = 'Instagram profile'),
      now() - interval '2 days',
      'new-inquiry',
      now() - interval '2 days',
      'new-lead',
      'Normal',
      'Creator collective with sponsorship and platform revenue.',
      'Qualify mandate type and revenue situation.',
      10
    ),
    (
      'Weber & Partner',
      'kanzlei@weberpartner.de',
      '+49 30 2332 6611',
      (select id from public.team_members where name = 'Karsten Guhr'),
      (select id from public.lead_sources where label = 'Partner recommendation'),
      now() - interval '17 days',
      'contract-sent',
      now() - interval '5 days',
      'awaiting-signature',
      'High',
      'Legal partnership needs clarity around trust account handling and monthly reporting.',
      'Follow up on engagement letter.',
      10
    ),
    (
      'Dr. Lena Hoffmann',
      'praxis@dr-hoffmann.de',
      '+49 30 7110 4920',
      (select id from public.team_members where name = 'Sophie Weber'),
      (select id from public.lead_sources where label = 'Google Search'),
      now() - interval '9 days',
      'documents-review',
      now() - interval '2 days',
      'internal-review',
      'Normal',
      'Practice opening planned for next quarter; investment plan and registration documents arrived.',
      'Review documents and identify open items.',
      10
    ),
    (
      'Novak IT Consulting',
      'office@novak-it.de',
      '+49 157 7300 8801',
      (select id from public.team_members where name = 'Max Keller'),
      (select id from public.lead_sources where label = 'LinkedIn'),
      now() - interval '12 days',
      'documents-requested',
      now() - interval '8 days',
      'missing-documents',
      'High',
      'Client is switching advisors and has open VAT deadlines.',
      'Request Stammdaten and previous advisor details.',
      20
    ),
    (
      'Kreativbau Architekten',
      'office@kreativbau.de',
      '+49 30 6702 5590',
      (select id from public.team_members where name = 'Lisa Braun'),
      (select id from public.lead_sources where label = 'Local business network'),
      now() - interval '25 days',
      'paused',
      now() - interval '13 days',
      'paused',
      'Low',
      'Client paused onboarding during internal partner decision.',
      'Clarify whether client wants to continue onboarding.',
      10
    ),
    (
      'Berger Payroll Services',
      'people@berger-services.de',
      '+49 30 1299 4412',
      (select id from public.team_members where name = 'Sophie Weber'),
      (select id from public.lead_sources where label = 'Tax newsletter'),
      now() - interval '5 days',
      'qualified-fit',
      now() - interval '2 days',
      'qualified',
      'Normal',
      'Growing team with 18 employees and two Werkstudenten.',
      'Request employee count and payroll history.',
      10
    ),
    (
      'Schmidt E-Commerce GmbH',
      'accounting@schmidt-commerce.de',
      '+49 30 8188 4620',
      (select id from public.team_members where name = 'Karsten Guhr'),
      (select id from public.lead_sources where label = 'Existing network'),
      now() - interval '18 days',
      'signed-active',
      now() - interval '4 days',
      'active',
      'Normal',
      'Onboarding completed. Team handover completed with bookkeeping owner.',
      'Hand over to responsible team.',
      10
    )
  returning id, email
),
mandate_seed as (
  select *
  from (
    values
      ('finance@mueller-media.de', 'GmbH', 10),
      ('finance@mueller-media.de', 'Finanzbuchhaltung', 20),
      ('anna.schneider@example.de', 'Freelancer', 10),
      ('anna.schneider@example.de', 'IT-Beratung', 20),
      ('hello@kayastudio.de', 'Influencer / Creator', 10),
      ('kanzlei@weberpartner.de', 'Rechtsanwälte', 10),
      ('praxis@dr-hoffmann.de', 'Heilberufe', 10),
      ('praxis@dr-hoffmann.de', 'Praxisgründung', 20),
      ('office@novak-it.de', 'Steuerberaterwechsel', 10),
      ('office@novak-it.de', 'IT-Beratung', 20),
      ('office@kreativbau.de', 'Architekten', 10),
      ('office@kreativbau.de', 'Jahresabschluss', 20),
      ('people@berger-services.de', 'Lohnbuchhaltung', 10),
      ('accounting@schmidt-commerce.de', 'GmbH', 10),
      ('accounting@schmidt-commerce.de', 'Finanzbuchhaltung', 20),
      ('accounting@schmidt-commerce.de', 'Jahresabschluss', 30)
  ) as seed(email, mandate_name, sort_order)
)
insert into public.client_mandates (client_id, mandate_type_id, sort_order)
select demo_clients.id, mandate_types.id, mandate_seed.sort_order
from mandate_seed
join demo_clients on demo_clients.email = mandate_seed.email
join public.mandate_types on mandate_types.name = mandate_seed.mandate_name;

with demo_clients as (
  select id, email from public.clients
  where email in (
    'finance@mueller-media.de',
    'anna.schneider@example.de',
    'hello@kayastudio.de',
    'kanzlei@weberpartner.de',
    'praxis@dr-hoffmann.de',
    'office@novak-it.de',
    'office@kreativbau.de',
    'people@berger-services.de',
    'accounting@schmidt-commerce.de'
  )
),
checklist_seed as (
  select *
  from (
    values
      ('finance@mueller-media.de', 'Handelsregisterauszug received', true, 10),
      ('finance@mueller-media.de', 'Gesellschaftsvertrag received', true, 20),
      ('finance@mueller-media.de', 'Previous Jahresabschluss received', false, 30),
      ('finance@mueller-media.de', 'Bank statements received', false, 40),
      ('finance@mueller-media.de', 'DATEV export requested', false, 50),
      ('finance@mueller-media.de', 'Vollmacht signed', false, 60),
      ('finance@mueller-media.de', 'Mandatsvertrag signed', false, 70),
      ('anna.schneider@example.de', 'Steuer-ID received', false, 10),
      ('anna.schneider@example.de', 'Basic income overview received', false, 20),
      ('anna.schneider@example.de', 'Invoices / receipts received', false, 30),
      ('anna.schneider@example.de', 'Previous tax assessment received', false, 40),
      ('anna.schneider@example.de', 'Vollmacht signed', false, 50),
      ('anna.schneider@example.de', 'Mandatsvertrag signed', false, 60),
      ('hello@kayastudio.de', 'Platform revenue overview received', false, 10),
      ('hello@kayastudio.de', 'Sponsorship contracts requested', false, 20),
      ('hello@kayastudio.de', 'Expense categories reviewed', false, 30),
      ('hello@kayastudio.de', 'VAT treatment clarified', false, 40),
      ('hello@kayastudio.de', 'Vollmacht signed', false, 50),
      ('hello@kayastudio.de', 'Mandatsvertrag signed', false, 60),
      ('kanzlei@weberpartner.de', 'Professional registration confirmed', true, 10),
      ('kanzlei@weberpartner.de', 'Trust account handling clarified', true, 20),
      ('kanzlei@weberpartner.de', 'Revenue model reviewed', true, 30),
      ('kanzlei@weberpartner.de', 'Previous tax assessment received', true, 40),
      ('kanzlei@weberpartner.de', 'Vollmacht signed', true, 50),
      ('kanzlei@weberpartner.de', 'Mandatsvertrag signed', false, 60),
      ('praxis@dr-hoffmann.de', 'Practice registration details received', true, 10),
      ('praxis@dr-hoffmann.de', 'Revenue split clarified', true, 20),
      ('praxis@dr-hoffmann.de', 'Registration documents received', true, 30),
      ('praxis@dr-hoffmann.de', 'Investment plan received', true, 40),
      ('praxis@dr-hoffmann.de', 'Vollmacht signed', true, 50),
      ('praxis@dr-hoffmann.de', 'Mandatsvertrag signed', false, 60),
      ('office@novak-it.de', 'Vollmacht signed', true, 10),
      ('office@novak-it.de', 'Stammdaten received', false, 20),
      ('office@novak-it.de', 'Previous advisor contacted', false, 30),
      ('office@novak-it.de', 'DATEV export requested', false, 40),
      ('office@novak-it.de', 'Open deadlines reviewed', true, 50),
      ('office@novak-it.de', 'Mandatsvertrag signed', false, 60),
      ('office@kreativbau.de', 'Project revenue overview received', true, 10),
      ('office@kreativbau.de', 'Open project list received', true, 20),
      ('office@kreativbau.de', 'Previous Jahresabschluss received', false, 30),
      ('office@kreativbau.de', 'Bank statements received', false, 40),
      ('office@kreativbau.de', 'Vollmacht signed', false, 50),
      ('office@kreativbau.de', 'Mandatsvertrag signed', false, 60),
      ('people@berger-services.de', 'Employee count received', true, 10),
      ('people@berger-services.de', 'Payroll start date confirmed', false, 20),
      ('people@berger-services.de', 'ELStAM access clarified', false, 30),
      ('people@berger-services.de', 'Social security registrations reviewed', false, 40),
      ('people@berger-services.de', 'Payroll history received', false, 50),
      ('people@berger-services.de', 'Mandatsvertrag signed', false, 60),
      ('accounting@schmidt-commerce.de', 'Handelsregisterauszug received', true, 10),
      ('accounting@schmidt-commerce.de', 'Gesellschaftsvertrag received', true, 20),
      ('accounting@schmidt-commerce.de', 'Previous Jahresabschluss received', true, 30),
      ('accounting@schmidt-commerce.de', 'Bank statements received', true, 40),
      ('accounting@schmidt-commerce.de', 'DATEV export requested', true, 50),
      ('accounting@schmidt-commerce.de', 'Vollmacht signed', true, 60),
      ('accounting@schmidt-commerce.de', 'Mandatsvertrag signed', true, 70),
      ('accounting@schmidt-commerce.de', 'Accounting scope confirmed', true, 80),
      ('accounting@schmidt-commerce.de', 'DATEV Unternehmen online invited', true, 90),
      ('accounting@schmidt-commerce.de', 'Trial balance received', true, 100)
  ) as seed(email, label, completed, sort_order)
)
insert into public.client_checklist_items (client_id, label, completed, sort_order)
select demo_clients.id, checklist_seed.label, checklist_seed.completed, checklist_seed.sort_order
from checklist_seed
join demo_clients on demo_clients.email = checklist_seed.email;

with demo_clients as (
  select id, email from public.clients
  where email in (
    'finance@mueller-media.de',
    'anna.schneider@example.de',
    'hello@kayastudio.de',
    'kanzlei@weberpartner.de',
    'praxis@dr-hoffmann.de',
    'office@novak-it.de',
    'office@kreativbau.de',
    'people@berger-services.de',
    'accounting@schmidt-commerce.de'
  )
),
activity_seed as (
  select *
  from (
    values
      ('finance@mueller-media.de', 'Documents requested', 'Vollmacht, DATEV export and bank statements requested.', 'created', now() - interval '6 days'),
      ('finance@mueller-media.de', 'Inquiry qualified', 'Mandate fit confirmed after founder call.', 'created', now() - interval '11 days'),
      ('anna.schneider@example.de', 'Consultation scheduled', 'Introductory call booked for this week.', 'created', now() - interval '1 day'),
      ('anna.schneider@example.de', 'New inquiry received', 'Lead came in through the website contact form.', 'created', now() - interval '3 days'),
      ('hello@kayastudio.de', 'New inquiry received', 'Team requested support for creator revenue and VAT topics.', 'created', now() - interval '2 days'),
      ('kanzlei@weberpartner.de', 'Mandatsvertrag sent', 'Engagement letter sent to managing partner for signature.', 'created', now() - interval '5 days'),
      ('kanzlei@weberpartner.de', 'Internal review completed', 'Open questions around trust accounts clarified.', 'created', now() - interval '8 days'),
      ('praxis@dr-hoffmann.de', 'Documents moved to review', 'Initial package received through secure upload.', 'created', now() - interval '2 days'),
      ('praxis@dr-hoffmann.de', 'Onboarding documents requested', 'Requested founding timeline and practice documents.', 'created', now() - interval '7 days'),
      ('office@novak-it.de', 'Documents requested', 'Missing Stammdaten and previous advisor contact details.', 'created', now() - interval '8 days'),
      ('office@novak-it.de', 'Mandate fit confirmed', 'Advisor switch accepted after deadline check.', 'created', now() - interval '12 days'),
      ('office@kreativbau.de', 'Onboarding paused', 'Client asked to pause until partners approve the advisory budget.', 'created', now() - interval '13 days'),
      ('office@kreativbau.de', 'Initial consultation completed', 'Potential Jahresabschluss mandate discussed.', 'created', now() - interval '25 days'),
      ('people@berger-services.de', 'Mandate fit confirmed', 'Payroll scope appears suitable for Guhr onboarding.', 'created', now() - interval '2 days'),
      ('people@berger-services.de', 'Inquiry received', 'Newsletter reply asking about payroll support.', 'created', now() - interval '5 days'),
      ('accounting@schmidt-commerce.de', 'Signed & active', 'Mandatsvertrag signed and handover completed.', 'created', now() - interval '4 days'),
      ('accounting@schmidt-commerce.de', 'Document review completed', 'Initial bookkeeping package approved.', 'created', now() - interval '7 days')
  ) as seed(email, title, detail, type, created_at)
)
insert into public.client_activity (client_id, title, detail, type, created_at)
select demo_clients.id, activity_seed.title, activity_seed.detail, activity_seed.type, activity_seed.created_at
from activity_seed
join demo_clients on demo_clients.email = activity_seed.email;
