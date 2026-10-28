-- 디지털어드민 화면 제너레이터 · Supabase 스키마 (스프린트 0)
-- Supabase 대시보드 → SQL Editor → New query 에 전체를 붙여넣고 Run.
-- 여러 번 실행해도 안전합니다 (if not exists / or replace).

-- 1. 화면 테이블 -----------------------------------------------------------
create table if not exists public.screens (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  area            text not null default '',          -- 여신 / 수신 / 설정 / 마케팅 …
  pattern         text not null default '',          -- 목록 / 상세 / 모달 / 대시보드
  schema          jsonb not null,                    -- ScreenSchema JSON
  thumbnail_path  text,                              -- storage: thumbnails/<id>.png
  source_id       uuid references public.screens(id) on delete set null,  -- 복제 원본
  created_by      uuid references auth.users(id) on delete set null,
  created_by_email text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists screens_updated_at_idx on public.screens (updated_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists screens_set_updated_at on public.screens;
create trigger screens_set_updated_at
  before update on public.screens
  for each row execute function public.set_updated_at();

-- 2. 접근 권한: 로그인한 사용자는 모든 화면을 읽고 쓸 수 있음 -------------------
alter table public.screens enable row level security;

drop policy if exists "screens: authenticated read"   on public.screens;
drop policy if exists "screens: authenticated insert" on public.screens;
drop policy if exists "screens: authenticated update" on public.screens;
drop policy if exists "screens: authenticated delete" on public.screens;

create policy "screens: authenticated read"   on public.screens for select to authenticated using (true);
create policy "screens: authenticated insert" on public.screens for insert to authenticated with check (true);
create policy "screens: authenticated update" on public.screens for update to authenticated using (true) with check (true);
create policy "screens: authenticated delete" on public.screens for delete to authenticated using (true);

-- 3. 썸네일 저장소 (공개 읽기, 로그인 사용자 쓰기) -------------------------------
insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

drop policy if exists "thumbnails: public read"         on storage.objects;
drop policy if exists "thumbnails: authenticated write" on storage.objects;
drop policy if exists "thumbnails: authenticated update" on storage.objects;
drop policy if exists "thumbnails: authenticated delete" on storage.objects;

create policy "thumbnails: public read"          on storage.objects for select using (bucket_id = 'thumbnails');
create policy "thumbnails: authenticated write"  on storage.objects for insert to authenticated with check (bucket_id = 'thumbnails');
create policy "thumbnails: authenticated update" on storage.objects for update to authenticated using (bucket_id = 'thumbnails');
create policy "thumbnails: authenticated delete" on storage.objects for delete to authenticated using (bucket_id = 'thumbnails');
