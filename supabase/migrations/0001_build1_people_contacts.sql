-- Build 1: People + Contacts
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query -> paste -> Run).

create extension if not exists pgcrypto;

create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  phone text,
  company text,
  role text,
  source_site text,
  ok_to_contact boolean not null default false,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references people(id) on delete cascade,
  type text not null check (type in (
    'payroll_remediations',
    'general_question',
    'compliance_review_audit',
    'system_setup_implementation'
  )),
  subject text,
  message text,
  source text,
  status text not null default 'new_lead' check (status in (
    'new_lead', 'contacted', 'discovery_call', 'proposal', 'won', 'lost'
  )),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists contacts_person_id_idx on contacts(person_id);
create index if not exists contacts_status_idx on contacts(status);
create index if not exists contacts_created_at_idx on contacts(created_at desc);

-- Row Level Security is on with no policies: only the service role key
-- (used server-side only) can read or write. The anon key gets nothing.
alter table people enable row level security;
alter table contacts enable row level security;
