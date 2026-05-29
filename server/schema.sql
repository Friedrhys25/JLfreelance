create extension if not exists "pgcrypto";

create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  role text not null check (role in ('admin', 'cashier', 'client')),
  branch_id uuid references branches (id),
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null default 0,
  duration text not null,
  tax_rate numeric not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  branch_id uuid references branches (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists barbers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar text,
  specialty text,
  branch_id uuid references branches (id),
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time text not null,
  client_name text not null,
  barber_id uuid references barbers (id),
  service_id uuid references services (id),
  cost numeric not null default 0,
  status text not null default 'queued',
  branch_id uuid references branches (id),
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  month text not null,
  electricity numeric not null default 0,
  water numeric not null default 0,
  rent numeric not null default 0,
  other numeric not null default 0,
  branch_id uuid references branches (id),
  created_at timestamptz not null default now()
);

create table if not exists service_splits (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services (id) on delete cascade,
  branch_id uuid references branches (id),
  shop_pct integer not null default 60,
  barber_pct integer not null default 40,
  unique (service_id, branch_id)
);

-- Optional migration for existing databases:
-- alter table services add column if not exists branch_id uuid references branches (id);
-- alter table service_splits drop constraint if exists service_splits_service_id_fkey;
-- alter table service_splits
--   add constraint service_splits_service_id_fkey
--   foreign key (service_id) references services (id) on delete cascade;
-- create unique index if not exists service_splits_branch_default_key
--   on service_splits (branch_id)
--   where service_id is null;

create index if not exists transactions_branch_id_idx on transactions (branch_id);
create index if not exists transactions_date_idx on transactions (date);
create index if not exists expenses_branch_id_idx on expenses (branch_id);
create index if not exists services_branch_id_idx on services (branch_id);
create unique index if not exists service_splits_branch_default_key
  on service_splits (branch_id)
  where service_id is null;
