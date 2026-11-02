-- Abstract: bulut senkronu tablosu.
-- Supabase paneli > SQL Editor'e yapıştırıp bir kez çalıştır.

create table if not exists public.user_data (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  liked      jsonb not null default '[]'::jsonb,
  folders    jsonb not null default '{}'::jsonb,
  history    jsonb not null default '[]'::jsonb,
  streak     jsonb not null default '{}'::jsonb,
  settings   jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

-- Her kullanıcı yalnızca kendi satırını görebilir / yazabilir.
drop policy if exists "user_data_select_own" on public.user_data;
create policy "user_data_select_own" on public.user_data
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "user_data_insert_own" on public.user_data;
create policy "user_data_insert_own" on public.user_data
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "user_data_update_own" on public.user_data;
create policy "user_data_update_own" on public.user_data
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_data_delete_own" on public.user_data;
create policy "user_data_delete_own" on public.user_data
  for delete to authenticated using (auth.uid() = user_id);
