# Dreigewinnt — Decisions

Last updated: 2026-05-11 16:25 UTC by Hermes

## Locked decisions
- GitHub target is `turyildiz/dreigewinnt` only. Do not push Dreigewinnt work to `gonzo-ai`.
- Host project images/media on Cloudflare R2 via `images.dreigewinnt.com`; prefer Cloudflare-hosted image URLs/assets for uploaded/media content rather than committing image blobs to the repo.
- Keep Supabase/PostgreSQL as the primary application database for now; do not migrate Dreigewinnt data to D1/PocketBase without a separate migration decision.
- Follow `/home/repos/AGENTS.md`: read repo index, read project AGENTS, do work, then update shared context after meaningful changes.
- Use German UI copy throughout the product.
- Respect Next.js 16 / React 19 differences; read local Next docs before changing framework-sensitive code.
- Do not write secrets, tokens, passwords, API keys, or full credential paths into agent context files.

## Operational notes
- Keep commits small and push regularly during active work.
- Prefer Vercel for the site unless Turgay decides otherwise; bots are planned for VPS.
