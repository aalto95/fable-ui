import { getSql } from "@/db/postgres";

/** Apply idempotent DDL (safe to run on every startup). */
export async function runMigrations(): Promise<void> {
  const sql = getSql();

  await sql`
    create table if not exists ui_specs (
      spec_id uuid primary key,
      document jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    create index if not exists idx_ui_specs_updated_at on ui_specs (updated_at)
  `;

  await sql`
    create table if not exists ui_schema_override (
      lock char(1) primary key default 'x' check (lock = 'x'),
      body jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists ui_origin_bindings (
      origin text primary key,
      spec_id uuid references ui_specs(spec_id) on delete set null,
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    create index if not exists idx_ui_origin_bindings_spec_id on ui_origin_bindings (spec_id)
  `;
}
