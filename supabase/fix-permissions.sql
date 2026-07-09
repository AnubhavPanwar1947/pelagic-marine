-- Run in Supabase → SQL Editor → New query → Run
-- Fixes: permission denied for table enquiries (GRANT INSERT ... TO service_role)

grant usage on schema public to anon, authenticated, service_role;
grant insert on public.enquiries to anon, authenticated, service_role;

-- Optional: let service_role read rows in the dashboard / admin tools
grant select on public.enquiries to service_role;

drop policy if exists "Anyone can submit enquiry" on public.enquiries;

create policy "Anyone can submit enquiry"
  on public.enquiries
  for insert
  to anon, authenticated, service_role
  with check (true);
