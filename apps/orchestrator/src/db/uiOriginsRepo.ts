import { normalizeOrigin } from "@/config/originUtils";
import { getSql } from "@/db/postgres";

export type UiOriginBinding = {
  origin: string;
  specId: string | null;
};

export async function listUiOriginBindings(): Promise<UiOriginBinding[]> {
  const sql = getSql();
  const rows = await sql<{ origin: string; spec_id: string | null }[]>`
    select origin, spec_id::text
    from ui_origin_bindings
    order by origin
  `;
  return rows.map((row) => ({
    origin: row.origin,
    specId: row.spec_id,
  }));
}

export async function setUiOriginBinding(origin: string, specId: string | null): Promise<void> {
  const sql = getSql();
  const normalized = normalizeOrigin(origin);
  await sql`
    insert into ui_origin_bindings (origin, spec_id)
    values (${normalized}, ${specId}::uuid)
    on conflict (origin) do update set
      spec_id = excluded.spec_id,
      updated_at = now()
  `;
}

export async function clearUiOriginBinding(origin: string): Promise<void> {
  const sql = getSql();
  const normalized = normalizeOrigin(origin);
  await sql`delete from ui_origin_bindings where origin = ${normalized}`;
}

export async function collectAllUiOrigins(): Promise<string[]> {
  const sql = getSql();
  const rows = await sql<{ origin: string }[]>`
    select origin from ui_origin_bindings order by origin
  `;
  return rows.map((row) => row.origin);
}

export async function findSpecIdForOrigin(normalizedOrigin: string): Promise<string | undefined> {
  const sql = getSql();
  const rows = await sql<{ spec_id: string | null }[]>`
    select spec_id::text
    from ui_origin_bindings
    where origin = ${normalizedOrigin}
    limit 1
  `;
  const id = rows[0]?.spec_id ?? null;
  return id ?? undefined;
}
