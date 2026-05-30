-- Adds branch scoping to service_splits and backfills existing rows.
-- Run this in your Supabase SQL editor.

alter table service_splits
  add column if not exists branch_id uuid references branches (id);

-- If there was a unique constraint only on service_id, drop it.
alter table service_splits
  drop constraint if exists service_splits_service_id_key;

-- Backfill existing rows to a default branch.
-- Prefer a branch named like 'Main', otherwise pick the first by name.
with fallback_branch as (
  select id
  from branches
  where name ilike 'main%'
  order by name
  limit 1
),
any_branch as (
  select id
  from branches
  order by name
  limit 1
)
update service_splits
set branch_id = coalesce((select id from fallback_branch), (select id from any_branch))
where branch_id is null;

-- Ensure new uniqueness is (service_id, branch_id).
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'service_splits_service_id_branch_id_key'
      and conrelid = 'service_splits'::regclass
  ) then
    alter table service_splits
      add constraint service_splits_service_id_branch_id_key unique (service_id, branch_id);
  end if;
end $$;
