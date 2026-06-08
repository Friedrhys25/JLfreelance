create table if not exists queue_logs (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid,
  action text not null check (action in ('add', 'delete')),
  actor_user_id uuid references users (id) on delete set null,
  actor_username text not null,
  actor_role text not null,
  client_name text not null,
  contact_number text,
  barber_name text,
  service_name text,
  branch_id uuid references branches (id) on delete set null,
  branch_name text,
  logged_at timestamptz not null default now()
);

create index if not exists queue_logs_logged_at_idx
  on queue_logs (logged_at desc);
