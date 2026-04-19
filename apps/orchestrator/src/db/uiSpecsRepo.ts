import type postgres from "postgres";
import { normalizeOrigin } from "@/config/originUtils";
import { getSql } from "@/db/postgres";

export async function getUiSpec(specId: string): Promise<Record<string, unknown> | undefined> {
  const sql = getSql();
  const rows = await sql<{ document: Record<string, unknown> }[]>`
    select document from ui_specs where spec_id = ${specId}::uuid
  `;
  return rows[0]?.document;
}

export async function setUiSpec(specId: string, doc: Record<string, unknown>): Promise<void> {
  const sql = getSql();
  await sql`
    insert into ui_specs (spec_id, document)
    values (${specId}::uuid, ${sql.json(doc as postgres.JSONValue)})
    on conflict (spec_id) do update set
      document = excluded.document,
      updated_at = now()
  `;
}

export async function resetUiSpec(specId: string): Promise<void> {
  const sql = getSql();
  await sql`delete from ui_specs where spec_id = ${specId}::uuid`;
}

export async function listUiSpecIds(): Promise<string[]> {
  const sql = getSql();
  const rows = await sql<{ spec_id: string }[]>`
    select spec_id::text from ui_specs order by spec_id
  `;
  return rows.map((r) => r.spec_id);
}

export async function collectOriginsFromAllUiSpecs(): Promise<string[]> {
  const sql = getSql();
  const rows = await sql<{ document: Record<string, unknown> }[]>`
    select document from ui_specs where document ? 'origins'
  `;
  const seen = new Set<string>();
  for (const { document: doc } of rows) {
    const raw = doc.origins;
    if (!Array.isArray(raw)) continue;
    for (const item of raw) {
      if (typeof item === "string" && item.trim()) {
        seen.add(normalizeOrigin(item));
      }
    }
  }
  return [...seen];
}

export async function findSpecIdForOrigin(normalizedOrigin: string): Promise<string | undefined> {
  const sql = getSql();
  const rows = await sql<{ spec_id: string; document: Record<string, unknown> }[]>`
    select spec_id::text, document from ui_specs order by spec_id
  `;
  for (const { spec_id: specId, document: doc } of rows) {
    const raw = doc.origins;
    if (!Array.isArray(raw)) continue;
    for (const item of raw) {
      if (typeof item === "string" && item.trim() && normalizeOrigin(item) === normalizedOrigin) {
        return specId;
      }
    }
  }
  return undefined;
}
