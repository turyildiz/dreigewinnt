# Dreigewinnt — Current State

Last updated: 2026-06-20 by Claude

## Strategy Pivot (2026-06-20)

Major direction change from v2. Read `_docs/PRD_v3.md` and `_docs/BATTLEPLAN.md` for full spec.

**Key changes from v2:**
- **No tiers** — every partner gets full features, no freemium/premium distinction
- **Telegram-first partner management** — partners manage everything via bot, no web dashboard
- **Telegram code onboarding** — physical flyers with codes (e.g., RINGRAU001), Turgay visits shops
- **No approval queue for partner content** — trust-based, admin deletes bad actors
- **Visitor-to-partner messaging** — contact form on profiles, forwarded to partner via Telegram
- **Revenue model** — ticketing commission (2€/ticket), premium ad spots, job ads, municipality funding
- **Design locked** — UI/UX stays as-is

## Repository
- Path: `/home/repos/dreigewinnt`
- Remote: `https://github.com/turyildiz/dreigewinnt`
- Push policy: push only to `turyildiz/dreigewinnt`
- Main branch: `main`

## Product
- German-language local portal for Rüsselsheim am Main, Raunheim, and Kelsterbach — the "Drei Gewinnt" strategic alliance, ~92,000 residents.
- Core: **Events (hero)**, Gewerbe directory, Sportvereine directory, news/magazine.
- All partners (businesses + clubs) are equal — same features, same bot access.

## Stack
- Next.js 16.2.1 + React 19, Tailwind v4, TypeScript strict
- Supabase (jhsvcmrdzwtjdbvglnjs.supabase.co)
- Cloudflare R2 — bucket `dreigewinnt-images`, served at `images.dreigewinnt.com`
- Grammy (Telegram bot framework)
- Claude API (intent parsing + vision)
- Staging: dreigewinnt.heyturgay.com (port 3005, systemd: dreigewinnt.service)
- Production target: Vercel

## What's Built
- Design system: editorial "Digital Curator" aesthetic — locked, do not change
- Public pages: `/` homepage, `/gewerbe` + `/gewerbe/[slug]`, `/sport` + `/sport/[slug]`, `/events` + detail, `/news` + detail, `/suche`
- Submission forms: `/gewerbe/einreichen`, `/sport/einreichen`, `/events/einreichen`
- Admin panel: full CRUD for businesses, events, articles, jobs, posts, clubs; approval queue; team management
- Sports clubs: 83 clubs imported, full profiles with gallery and posts
- Navigation: Events first, Sport added, Jobs hidden
- Admin Telegram bot: @dreigewinnt_admin_bot — poster-to-event, quick publish, text-to-article
- R2 image uploads working
- `.ics` calendar export on event detail pages

## What Still Needs Building (V1)
1. **Telegram code system** — generate codes in admin, link partners via bot
2. **Public Telegram bot** — partner self-service (header, gallery, info, posts, events via chat)
3. **Visitor-to-partner messaging** — contact form on profiles → forwarded via bot
4. **Events-first homepage** — redesign homepage to lead with upcoming events
5. **Content seeding** — 30-50 businesses, 20+ events, 5-10 articles
6. **Image lightbox** on event detail pages

## Verification baseline (2026-05-11, still valid)
- `npm run lint` passes
- `tsc --noEmit --incremental false` passes
- Production routes HTTP 200: `/`, `/gewerbe`, `/events`, `/sport`, `/news`, `/suche?q=test`, `/admin/login`

## Environment notes
- `.next/` ownership issues may occur — use `sudo chown -R claude /home/repos/dreigewinnt/.next` if build fails
- Do not write secrets into context files
