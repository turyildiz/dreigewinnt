# Dreigewinnt — Current State

Last updated: 2026-05-11 17:01 UTC by Hermes

## Repository
- Path: `/home/repos/dreigewinnt`
- Remote: `https://github.com/turyildiz/dreigewinnt`
- Push policy: push only to `turyildiz/dreigewinnt`; do not use `gonzo-ai` for this project.
- Main branch: `main`

## Product
- German-language local portal for Raunheim, Kelsterbach, and Rüsselsheim.
- Core areas: Gewerbe directory, events, news/magazine, jobs, admin workflows, approval queue.

## Stack
- Next.js 16.2.1 + React 19
- TypeScript strict
- Tailwind v4
- Supabase/PostgreSQL
- Cloudflare R2 for image/media hosting via `images.dreigewinnt.com`
- Target hosting from roadmap: Vercel for site, VPS for bots

## Verification baseline
As of 2026-05-11:
- `npm run lint` passes with 0 errors; warnings remain mostly `@next/next/no-img-element`.
- `./node_modules/.bin/tsc --noEmit --incremental false` passes.
- Production build passes in a clean temp copy at `/tmp/dreigewinnt-build` with physical `node_modules` copy.
- Smoke-tested production routes returned HTTP 200: `/`, `/gewerbe`, `/events`, `/jobs`, `/news`, `/suche?q=test`, `/admin/login`.
- Event `.ics` downloads are implemented at `/api/events/[slug]/calendar.ics` and smoke-tested with an active event slug.
- Business import source `/var/www/html/dreigewinnt/businesses.json` is currently missing on this machine; a dry-run-first importer exists at `scripts/import-businesses.mjs`.
- Media uploads now prefer Cloudflare R2 when `CLOUDFLARE_R2_*` env vars are configured, with Supabase Storage fallback for unconfigured local environments.

## Environment notes
- The repo has local permission/artifact issues around `.next`/`tsconfig.tsbuildinfo`; use `--incremental false` for typecheck and clean temp copy for build if needed.
- Do not write secrets, Supabase keys, tokens, or credential paths into context files.
