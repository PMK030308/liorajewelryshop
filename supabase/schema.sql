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
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'site_content_singleton'
      and conrelid = 'public.site_content'::regclass
  ) then
    alter table public.site_content add constraint site_content_singleton check (id = 1);
  end if;
end
$$;

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
drop policy if exists "profiles: self select"       on public.profiles;
drop policy if exists "profiles: self update"       on public.profiles;
drop policy if exists "profiles: admin update role" on public.profiles;
create policy "profiles: self select"  on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles: self update"   on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles: admin update role" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

-- ---------- products ----------
-- ai cũng đọc được (khách xem shop); chỉ admin ghi
drop policy if exists "products: public read"  on public.products;
drop policy if exists "products: admin write"  on public.products;
drop policy if exists "products: admin update" on public.products;
drop policy if exists "products: admin delete" on public.products;
create policy "products: public read"   on public.products for select using (true);
create policy "products: admin write"   on public.products for insert with check (public.is_admin());
create policy "products: admin update"  on public.products for update  using (public.is_admin()) with check (public.is_admin());
create policy "products: admin delete"  on public.products for delete  using (public.is_admin());

-- ---------- site_content ----------
drop policy if exists "site_content: public read"  on public.site_content;
drop policy if exists "site_content: admin write"  on public.site_content;
drop policy if exists "site_content: admin update" on public.site_content;
drop policy if exists "site_content: admin delete" on public.site_content;
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
-- orders: đơn hàng (1 dòng / đơn)
-- ============================================================
create table if not exists public.orders (
  id          text primary key,                  -- app-side order id (vd: o-<ts>-<rand>)
  user_id     uuid references auth.users(id) on delete set null,
  data        jsonb not null,                    -- toàn bộ object Order (items, shipping, payment, totals, status...)
  created_at  timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Khách chỉ xem đơn của chính mình; admin xem tất cả
drop policy if exists "orders: self read"   on public.orders;
drop policy if exists "orders: self insert" on public.orders;
drop policy if exists "orders: admin update" on public.orders;
drop policy if exists "orders: admin delete" on public.orders;
create policy "orders: self read"   on public.orders for select using (auth.uid() = user_id or public.is_admin());
-- Khách có thể tạo đơn cho chính mình; admin có thể tạo bất kỳ
create policy "orders: self insert" on public.orders for insert with check (auth.uid() = user_id or public.is_admin());
-- Khách không tự đổi trạng thái; admin đổi trạng thái + sửa đơn
create policy "orders: admin update" on public.orders for update using (public.is_admin()) with check (public.is_admin());
create policy "orders: admin delete" on public.orders for delete using (public.is_admin());

-- Realtime cho bảng orders
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end
$$;

-- ============================================================
-- user_carts: giỏ hàng + wishlist đồng bộ theo tài khoản (cross-device)
-- Mỗi user có 1 dòng (user_id = auth.users id). RLS: user chỉ truy cập dòng của mình.
-- ============================================================
create table if not exists public.user_carts (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  cart       jsonb not null default '[]'::jsonb,    -- CartItem[]
  wishlist   jsonb not null default '[]'::jsonb,   -- string[] (slug)
  updated_at timestamptz not null default now()
);

alter table public.user_carts enable row level security;

drop policy if exists "user_carts: owner all" on public.user_carts;
create policy "user_carts: owner all" on public.user_carts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Realtime cho bảng user_carts → đổi giỏ hàng ở thiết bị A thì thiết bị B thấy ngay
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'user_carts'
  ) then
    alter publication supabase_realtime add table public.user_carts;
  end if;
end
$$;

-- ============================================================
-- Ghi chú:
-- - Admin user được tạo bằng script `npm run seed-supabase` (dùng service key),
--   sau đó script update profiles.role = 'admin' cho user đó.
-- - Khách vãng lai (anon) chỉ ĐỌC products/site_content/orders của mình; không ghi được (RLS chặn).
-- - Realtime: khi 1 người cập nhật, tất cả client tự động nhận thay đổi
--   (Supabase Realtime postgres_changes). Cần chạy đoạn `alter publication` ở trên.
-- ============================================================
