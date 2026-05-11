# Dreigewinnt — Agent Changelog

## 2026-05-11 17:01 UTC — Hermes
- Locked product decision: Dreigewinnt images/media should be hosted on Cloudflare R2 via `images.dreigewinnt.com`.
- Implemented R2-first upload support in `src/lib/storage.ts` without adding dependencies; it uses R2 when `CLOUDFLARE_R2_*` env vars are configured and falls back to Supabase Storage otherwise.
- Added `.env.example` with Supabase and Cloudflare R2 variable names only; no secret values.
- Rewrote `README.md` with Dreigewinnt-specific setup, verification, and media architecture notes.
- Documented that Supabase/PostgreSQL remains the primary application database for now; Cloudflare image hosting is not a database migration.
- Marked Cloudflare image/media wiring as done; actual deployment credentials/domain config remain pending.
- Verified lint, TypeScript, and production build in `/tmp/dreigewinnt-r2-build` pass.

## 2026-05-11 16:32 UTC — Hermes
- Investigated business import blocker; expected source `/var/www/html/dreigewinnt/businesses.json` is not present on this machine.
- Added `scripts/import-businesses.mjs`, a dry-run-first importer that normalizes common business JSON fields and only writes to Supabase when run with `--apply`.
- Added `npm run import:businesses` defaulting to `--dry-run`.
- Tested importer against `/tmp/dreigewinnt-businesses-sample.json`; it parsed 2/2 sample rows successfully.
- Verified lint and TypeScript still pass.

## 2026-05-11 16:29 UTC — Hermes
- Added `/api/events/[slug]/calendar.ics` Route Handler for event calendar downloads.
- Verified lint and TypeScript still pass.
- Verified production build includes the new ICS route.
- Smoke-tested `/events`, extracted an active event slug, and confirmed the `.ics` download returns HTTP 200 with `text/calendar`.
- Updated roadmap: Jobs page is DB-backed; `.ics` export is done; legal pages remain draft because address placeholders must be replaced before launch.

## 2026-05-11 16:25 UTC — Hermes
- Confirmed project remote is `https://github.com/turyildiz/dreigewinnt`; push policy is turyildiz only, not gonzo-ai.
- Fixed lint errors from JSX German quote usage and React 19 `set-state-in-effect` rule.
- Cleaned several unused variables/imports.
- Verified lint passes with 0 errors, TypeScript passes with `--incremental false`, production build passes in clean temp copy, and 7 production routes return HTTP 200.
- Created `.agent-context/` files so future agents have shared state and next steps.
