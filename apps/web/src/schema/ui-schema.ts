import type { IPage } from "fable-ui";

/**
 * Bundled UI schema: extra routes rendered with {@link Renderer} (besides `/`, `/docs`, `/showcase/:kind`).
 * The `/` route is reserved for the app home screen; entries with `route: "/"` here are ignored for routing.
 */
export const UI_SCHEMA_PAGES: IPage[] = [];
