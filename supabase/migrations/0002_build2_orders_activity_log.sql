-- Build 2: Orders + activity_log
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query -> paste -> Run).

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references people(id) on delete cascade,
  product_name text not null,
  amount_cents integer not null,
  currency text not null default 'AUD',
  status text not null default 'pending' check (status in (
    'pending', 'paid', 'refunded', 'cancelled'
  )),
  created_at timestamptz not null default now()
);

create index if not exists orders_person_id_idx on orders(person_id);

create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts(id) on delete cascade,
  person_id uuid not null references people(id) on delete cascade,
  from_status text not null,
  to_status text not null,
  actor text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists activity_log_contact_id_idx on activity_log(contact_id);
create index if not exists activity_log_person_id_idx on activity_log(person_id);

-- Row Level Security is on with no policies: only the service role key
-- (used server-side only) can read or write. The anon key gets nothing.
alter table orders enable row level security;
alter table activity_log enable row level security;
