import type postgres from "postgres";
import { getSql } from "@/db/postgres";

export async function getSchemaOverride(): Promise<unknown | null> {
  const sql = getSql();
  const rows = await sql<{ body: unknown }[]>`
    select body from ui_schema_override where lock = 'x'
  `;
  const body = rows[0]?.body;
  return body === undefined ? null : body;
}

export async function setSchemaOverride(doc: unknown): Promise<void> {
  const sql = getSql();
  await sql`
    insert into ui_schema_override (lock, body)
    values ('x', ${sql.json(doc as postgres.JSONValue)})
    on conflict (lock) do update set
      body = excluded.body,
      updated_at = now()
  `;
}

export async function clearSchemaOverride(): Promise<void> {
  const sql = getSql();
  await sql`delete from ui_schema_override where lock = 'x'`;
}
