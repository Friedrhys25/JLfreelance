create table if not exists login_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users (id) on delete set null,
  username text not null,
  role text not null,
  branch_id uuid references branches (id) on delete set null,
  branch_name text,
  ip_address text,
  user_agent text,
  logged_in_at timestamptz not null default now()
);

create index if not exists login_logs_logged_in_at_idx
  on login_logs (logged_in_at desc);
