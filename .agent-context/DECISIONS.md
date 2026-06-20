# Dreigewinnt — Decisions

Last updated: 2026-06-18 by Claude

## Locked decisions
- GitHub target is `turyildiz/dreigewinnt` only. Do not push Dreigewinnt work to `gonzo-ai`.
- Host project images/media on Cloudflare R2 via `images.dreigewinnt.com` — DONE. Bucket: `dreigewinnt-images`. Token: `bereket-r2-production` (shared with Bereket/psy).
- Keep Supabase/PostgreSQL as the primary application database; do not migrate to D1/PocketBase.
- Follow `/home/repos/AGENTS.md`: read repo index, read project AGENTS, do work, update context after.
- Use German UI copy throughout the product.
- Respect Next.js 16 / React 19 differences; read local Next docs before changing framework-sensitive code.
- Do not write secrets, tokens, passwords, API keys, or credential paths into agent context files.
- **Business strategy (2026-06-13):** Do NOT bulk-import old scraped data. Target 30–50 hand-curated active businesses in the 3 towns — food/service shops (döner, groceries, salons, cafes) that post daily. Quality over quantity.
- **Newsletter:** Use All-inkl SMTP (not Resend). Ask Turgay for credentials before implementing.
- **Strategy pivot (2026-06-18):** Events are the hero feature. Sports clubs (Sportvereine) added as a new core entity — same profile quality as businesses. Two Telegram bots: admin bot (poster-to-event, quick publish) + public bot (businesses/clubs post updates). Jobs section dropped from V1 (hide, don't delete). No fixed launch date. Full spec: `_docs/PRD_v2.md`.
- **Revenue model (2026-06-18):** Ticketing (commission-based) is the primary revenue stream — but it's V2. Merch shop (Dreigewinnt + club merchandise) also V2. Do NOT build payment/ticketing in V1.
- **Sports clubs = businesses (2026-06-18):** Clubs get the same treatment: rich profile (header, gallery, info, posts feed), Telegram bot access, admin CRUD, approval queue. Mirror the Gewerbe architecture.
- **Town support (2026-06-18):** Approach press departments of all 3 towns for support (financial, promotional, endorsement). This is a partnership play.

## Operational notes
- Keep commits small and push regularly during active work.
- Site on Vercel for production. Currently running on VPS at port 3005 for staging.
- Two Telegram bots will run as separate systemd services on VPS.
