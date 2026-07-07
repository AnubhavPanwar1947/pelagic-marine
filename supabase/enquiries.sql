-- Run once in Supabase → SQL Editor → New query → Run

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  vessel_name text,
  port text,
  survey_type text,
  message text,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table public.enquiries enable row level security;

create policy "Anyone can submit enquiry"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);

-- Required so the public (anon) contact form can insert rows
grant usage on schema public to anon, authenticated;
grant insert on public.enquiries to anon, authenticated;
