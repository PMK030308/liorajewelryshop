-- ============================================================
-- Liorajewelry — Supabase schema (Phase 1)
-- Chạy toàn bộ file này trong Supabase SQL Editor (Dashboard → SQL Editor → New query → Run).
-- Bao gồm: bảng profiles / products / site_content + RLS + trigger auto-tạo profile khi đăng ký.
-- ============================================================

-- ---------- profiles: thông tin tài khoản (1 dòng / auth.users) ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  name       text,
  phone      text,
  role       text not null default 'customer',  -- 'admin' | 'customer'
  created_at timestamptz not null default now()
);

-- ---------- products: 1 dòng / sản phẩm, slug là khoá ----------
create table if not exists public.products (
  slug       text primary key,
  data       jsonb not null,                     -- toàn bộ object Product
  updated_at timestamptz not null default now()
);

-- ---------- site_content: 1 dòng duy nhất (id = 1) ----------
create table if not exists public.site_content (
  id         int primary key default 1,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content add constraint site_content_singleton check (id = 1);

-- ============================================================
-- Trigger: khi auth.users có user mới → tự tạo dòng profiles (role = customer)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'nickname',
      new.email
    ),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles      enable row level security;
alter table public.products      enable row level security;
alter table public.site_content  enable row level security;

-- helper: kiểm tra user hiện tại có role admin không
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- profiles ----------
-- chủ tài khoản đọc/sửa của mình; admin đọc được tất cả
create policy "profiles: self select"  on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles: self update"   on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles: admin update role" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

-- ---------- products ----------
-- ai cũng đọc được (khách xem shop); chỉ admin ghi
create policy "products: public read"   on public.products for select using (true);
create policy "products: admin write"   on public.products for insert with check (public.is_admin());
create policy "products: admin update"  on public.products for update  using (public.is_admin()) with check (public.is_admin());
create policy "products: admin delete"  on public.products for delete  using (public.is_admin());

-- ---------- site_content ----------
create policy "site_content: public read" on public.site_content for select using (true);
create policy "site_content: admin write" on public.site_content for insert with check (public.is_admin());
create policy "site_content: admin update" on public.site_content for update using (public.is_admin()) with check (public.is_admin());
create policy "site_content: admin delete" on public.site_content for delete using (public.is_admin());

-- ============================================================
-- Realtime (Supabase Realtime / postgres_changes)
-- Bật publication cho các bảng cần đồng bộ theo thời gian thực.
-- Khi admin cập nhật sản phẩm/nội dung, tất cả client sẽ nhận được thay đổi.
-- Chạy câu này (hoặc bật trong Dashboard → Database → Replication):
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products'
  ) then
    alter publication supabase_realtime add table public.products;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'site_content'
  ) then
    alter publication supabase_realtime add table public.site_content;
  end if;
end
$$;

-- ============================================================
-- Ghi chú:
-- - Admin user được tạo bằng script `npm run seed-supabase` (dùng service key),
--   sau đó script update profiles.role = 'admin' cho user đó.
-- - Khách vãng lai (anon) chỉ ĐỌC products/site_content; không ghi được (RLS chặn).
-- - Phase 2 sẽ thêm bảng orders + chính sách tương ứng.
-- - Realtime: khi 1 người cập nhật, tất cả client tự động nhận thay đổi
--   (Supabase Realtime postgres_changes). Cần chạy đoạn `alter publication` ở trên.
-- ============================================================
