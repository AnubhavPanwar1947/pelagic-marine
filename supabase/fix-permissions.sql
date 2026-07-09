-- Run once if the contact form shows "permission denied for table enquiries"
-- Supabase → SQL Editor → paste → Run

grant usage on schema public to anon, authenticated;
grant insert on public.enquiries to anon, authenticated;

drop policy if exists "Anyone can submit enquiry" on public.enquiries;

create policy "Anyone can submit enquiry"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (true);

-- Do NOT grant SELECT to anon — the app inserts without reading rows back.
