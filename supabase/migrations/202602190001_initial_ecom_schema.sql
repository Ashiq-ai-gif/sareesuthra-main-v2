-- Initial schema for Saree Sutra e-commerce app

create extension if not exists pgcrypto;

-- PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Men', 'Women', 'Unisex')),
  price numeric(10,2) not null,
  real_price numeric(10,2),
  size text,
  notes text[] not null default '{}',
  description text not null,
  images text[] not null default '{}',
  variants jsonb not null default '[]'::jsonb,
  is_gift_set boolean not null default false,
  bundle_items text[] not null default '{}',
  gallery text[] not null default '{}',
  "olfactoryNotes" jsonb not null default '[]'::jsonb,
  "extraSections" jsonb not null default '[]'::jsonb,
  "isHidden" boolean not null default false,
  videos text[] not null default '{}',
  is_featured boolean not null default false,
  is_sold_out boolean not null default false,
  fabric text,
  weave text,
  "blouseDetail" text,
  "washCare" text,
  color text,
  pattern text,
  occasion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_created_at on public.products (created_at desc);
create index if not exists idx_products_is_featured on public.products (is_featured);

alter table public.products disable row level security;

-- REVIEWS
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  user_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.reviews disable row level security;

-- BLOGS
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  content text not null,
  cover_image text not null,
  media_type text not null default 'image',
  author_name text not null default 'Admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blogs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'blogs' and policyname = 'Public can view blogs'
  ) then
    create policy "Public can view blogs" on public.blogs for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'blogs' and policyname = 'Admins can insert blogs'
  ) then
    create policy "Admins can insert blogs" on public.blogs for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'blogs' and policyname = 'Admins can update blogs'
  ) then
    create policy "Admins can update blogs" on public.blogs for update using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'blogs' and policyname = 'Admins can delete blogs'
  ) then
    create policy "Admins can delete blogs" on public.blogs for delete using (true);
  end if;
end $$;

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Public profiles are viewable by everyone.'
  ) then
    create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can insert their own profile.'
  ) then
    create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update own profile.'
  ) then
    create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);
  end if;
end $$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ADDRESSES
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  district text,
  state text not null,
  pincode text not null,
  phone text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.addresses enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'addresses' and policyname = 'Users can view their own addresses.'
  ) then
    create policy "Users can view their own addresses." on public.addresses for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'addresses' and policyname = 'Users can insert their own addresses.'
  ) then
    create policy "Users can insert their own addresses." on public.addresses for insert with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'addresses' and policyname = 'Users can update their own addresses.'
  ) then
    create policy "Users can update their own addresses." on public.addresses for update using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'addresses' and policyname = 'Users can delete their own addresses.'
  ) then
    create policy "Users can delete their own addresses." on public.addresses for delete using (auth.uid() = user_id);
  end if;
end $$;

-- ORDERS
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated by default as identity,
  created_at timestamptz not null default now(),
  customer_name text,
  customer_mobile text not null,
  customer_email text,
  address_json jsonb not null,
  total_amount numeric not null,
  payment_status text not null default 'pending',
  tracking_status text not null default 'Order Placed',
  tracking_id text,
  razorpay_order_id text,
  razorpay_payment_id text,
  items jsonb not null,
  user_id uuid references auth.users(id),
  cancellation_reason text,
  shiprocket_order_id text,
  shiprocket_shipment_id text,
  awb_code text
);

create unique index if not exists idx_orders_order_number on public.orders (order_number);
create index if not exists idx_orders_created_at on public.orders (created_at desc);

-- App has admin panel using client SDK; keep permissive like original project intent.
alter table public.orders disable row level security;

-- SITE SETTINGS
create table if not exists public.site_settings (
  key text primary key,
  value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_settings disable row level security;

insert into public.site_settings (key, value)
values
  ('hero_image_url', ''),
  ('hero_images', '[]'),
  ('hero_images_mobile', '[]'),
  ('banner_enabled', 'false'),
  ('banner_text', '')
on conflict (key) do nothing;

-- Shared updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_product_updated on public.products;
create trigger on_product_updated
before update on public.products
for each row execute procedure public.handle_updated_at();

drop trigger if exists on_blog_updated on public.blogs;
create trigger on_blog_updated
before update on public.blogs
for each row execute procedure public.handle_updated_at();

drop trigger if exists on_address_updated on public.addresses;
create trigger on_address_updated
before update on public.addresses
for each row execute procedure public.handle_updated_at();

drop trigger if exists on_site_setting_updated on public.site_settings;
create trigger on_site_setting_updated
before update on public.site_settings
for each row execute procedure public.handle_updated_at();

-- Storage bucket + policies for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public Uploads'
  ) then
    create policy "Public Uploads"
      on storage.objects
      for insert
      with check (bucket_id = 'product-images');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public Viewing'
  ) then
    create policy "Public Viewing"
      on storage.objects
      for select
      using (bucket_id = 'product-images');
  end if;
end $$;
