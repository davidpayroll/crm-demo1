# Product plan · Australian Payroll Advisory (APA)

## What we're actually building and why

In one sentence: Right now, inquiries into APA come in through a form,
phone calls, referrals, and social — and each one lands in a different
tool with no shared view of where it stands, so leads go cold simply
because no one place shows them all. This CRM gives David one place
where every inquiry into APA's payroll consulting and advisory work —
remediations, compliance reviews, system setups, general questions —
is captured the moment it arrives and tracked until it's won or lost,
so nothing depends on remembering which inbox or spreadsheet a lead
landed in.

Who it's for: David, running APA's payroll consulting and advisory
practice, and the operations/finance leaders who reach out needing a
payroll remediation, a compliance review, a system setup, or general
guidance.

What we are deliberately NOT building: no affiliates, no subscriptions,
no cohorts, no analytics dashboards, no integrations beyond what's named
here. If it isn't load-bearing for capturing and working a lead, it's out.

## The brief (drives every /goal command)

You are my engineering partner for building my CRM today. The stack is
already installed and wired (Next.js on Vercel, Supabase, Resend, domain).
Do not reinstall or reprovision anything. Build the app with two surfaces:
a public marketing site that captures leads, and an /admin CRM.
The /admin section is open and unprotected at first; it gets locked
down with email-and-password Supabase Auth later in the build. Do
not add any auth, login page, or route protection until I explicitly
ask for it.

The CRM has exactly four parts:

- People: a contact directory, one row per person, deduplicated by
  email. Columns: id, email (unique), name, phone, company, role,
  source_site, ok_to_contact, attributes (jsonb), created_at,
  updated_at. The custom attributes I named go inside attributes.
  The keys are my attribute names and the values match the types I
  specified.

- Contacts: an inquiry pipeline. Each inquiry links to a person and
  moves through stages new_lead, contacted, discovery_call,
  proposal, won, lost. Columns: id, person_id, type, subject,
  message, source, status, metadata (jsonb), created_at. The type
  field is constrained to exactly the inquiry types I gave in Q4
  (lowercased).

- activity_log: every status change on a Contacts row writes one row
  here. Columns: id, contact_id, person_id, from_status, to_status,
  actor, note, created_at.

- Orders: what people bought. Columns: id, person_id, product_name,
  amount_cents, currency, status (pending, paid, refunded,
  cancelled), created_at.

- Newsletter: people who opted in to email, tracked by
  people.ok_to_contact = true. No separate table.

Conventions:
- Upsert people by email; never duplicate a person.
- Access Supabase server-side with the service key; never expose
  secrets to the client; keys live in environment variables only.
- Keep it simple: no affiliates, no subscriptions, no cohorts.
- Work one step at a time and wait for my approval before each step.

My business: Australian Payroll Advisory (APA) — payroll consulting and advisory services
My inquiry types (contacts.type enum): payroll_remediations, general_question, compliance_review_audit, system_setup_implementation
My design system: Academic — serious, structured, editorial, trustworthy
My brand colors: Primary #485F88 (navy blue), #6EC9C0 (teal), #A0ADC0 (blue-grey); Secondary #333132 (near-black), #29394D (dark navy), #467D79 (deep teal), #808897 (slate grey). Fonts: Montserrat (headings), Open Sans (body).
My custom attributes (people.attributes jsonb keys): industrial_instrument_in_use (short text — e.g. "Clerks Award", "Retail EA"), business_size (pick-from-list — 1-20, 21-100, 101-500, 500+), payroll_software_in_use (short text — e.g. Xero, MYOB, ADP)
My domain: to be added later — placeholder used in .env.local until confirmed

## BUILD 1 (small) — Prove the loop

Goal: A stranger can submit an inquiry on my live site and I can see
that lead inside /admin, on the same day, without anyone touching the
database by hand. This closes the exact gap I named in Q1 — leads
scattered across tools with no shared view. It is the smallest thing
that proves the whole system works end to end. Nothing else matters
until this is real.

Scope: the People and Contacts tables with my custom attributes wired
into the jsonb column; a working contact form on the live marketing
site that writes a People row (upserted by email) and a linked Contacts
row; one admin login with a single verified account; one admin page
that lists incoming leads newest first.

Definition of Done (every box must be true):
- The contact form is live on my real domain, not localhost.
- Submitting it creates exactly one People row and one linked Contacts
  row, deduplicated by email on repeat submits.
- My chosen custom attributes (industrial instrument in use, business
  size, payroll software in use) are saved correctly inside attributes.
- A new Contacts row lands in status new_lead.
- I can log in to /admin with my one seeded account.
- The admin leads page shows the submission within seconds, newest first.
- I personally run the full flow once: submit as a visitor, log in, see it.

Success Criteria (how we know it's good, not just done):
- From a cold start, I can go submit to visible in under 60 seconds.
- Two submissions from the same email produce one person, not two.
- I can read the lead's name, type, message, and my custom attributes
  on the admin page without opening Supabase.
- No lead can land and go unseen, which is the failure mode I named in Q1.

## BUILD 2 (all) — Make it the system I run the business from

Goal: Turn the proven loop into the place I actually manage relationships
and money. After this, I work leads, record what people bought, and keep
my newsletter list entirely from /admin behind my login, and every new
lead gets an automatic confirmation email. This is what makes my Q2
ninety-day win achievable: zero leads slip through, I always know where
each lead stands, and more inquiries convert to paying engagements.

Scope: the rest of the /admin back end behind my login: the full People
directory, all inquiries with working pipeline stages, the Orders list,
and the Newsletter list (ok_to_contact = true). Plus Resend wired so a
confirmation email fires on form submit. Every Contacts status change
writes an activity_log row.

Definition of Done (every box must be true):
- All four parts (People, Contacts, Orders, Newsletter) are visible and
  usable in /admin, and all of /admin sits behind my login.
- I can move a Contacts row through new_lead to contacted to
  discovery_call to proposal to won or lost from the interface.
- Each status change writes one activity_log row with from_status,
  to_status, and actor.
- The People directory is searchable and shows my custom attributes.
- I can add an Orders row against a person and see it on their record.
- The Newsletter list shows everyone with ok_to_contact = true.
- Resend is connected, the sending domain is verified, and a real
  confirmation email arrives after a form submit.

Success Criteria (how we know it's good, not just done):
- I can run a lead from first inquiry to won without leaving /admin or
  touching the database.
- A person's full history (their inquiries, status changes, and orders)
  is visible in one place.
- A test submission produces a confirmation email in the inbox, not spam,
  with my domain as the sender.
- Nothing in /admin is reachable without logging in.
- At my real inquiry volume from Q2 (under 5 a week), this keeps up
  without me dropping to the database by hand.
