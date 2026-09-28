-- Contact form submissions. Visitors (anon) submit; admin (authenticated) reads.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_created_at on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='contact_messages' and policyname='Anyone can submit a contact message') then
    create policy "Anyone can submit a contact message" on public.contact_messages
      for insert to anon, authenticated with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='contact_messages' and policyname='Admin can read contact messages') then
    create policy "Admin can read contact messages" on public.contact_messages
      for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='contact_messages' and policyname='Admin can update contact messages') then
    create policy "Admin can update contact messages" on public.contact_messages
      for update to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='contact_messages' and policyname='Admin can delete contact messages') then
    create policy "Admin can delete contact messages" on public.contact_messages
      for delete to authenticated using (true);
  end if;
end $$;

grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
