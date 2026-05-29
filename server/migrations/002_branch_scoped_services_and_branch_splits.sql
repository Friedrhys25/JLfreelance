-- Adds branch-scoped services and one default split per branch.

alter table services
  add column if not exists branch_id uuid references branches (id);

create index if not exists services_branch_id_idx on services (branch_id);

create unique index if not exists service_splits_branch_default_key
  on service_splits (branch_id)
  where service_id is null;
