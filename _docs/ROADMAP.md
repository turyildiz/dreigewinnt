# Dreigewinnt — Roadmap

## Tech Stack
- Next.js 16.2.1 + React 19 + Tailwind v4
- Supabase (PostgreSQL + Storage)
- Grammy (Telegram bot framework)
- Claude API (intent parsing + vision)
- Stripe (payments — deferred)
- Resend (email/newsletter)
- Vercel (site hosting)
- VPS (Telegram bots)
- Plausible (analytics)

---

## What's Live
- Design system, layout, navigation
- /gewerbe — business directory (browse, filter by town/category)
- /gewerbe/[slug] — business profile (Aktuelles tab + Info tab)
- /events — events list + detail pages
- /news — news + magazine feed (type filter: Alle / Nachrichten / Magazin)
- /news/[slug] — article detail
- Homepage: hero, Spotlight partners, live business posts feed
- Public business submission form (/gewerbe/einreichen → queue)
- Admin panel: login, dashboard, manage businesses/events/articles/jobs
- Admin: business posts (multi-image, inline edit)
- Admin: approval queue

---

## Pre-Launch (must finish before going live)

- [ ] Import ~594 businesses from `/var/www/html/dreigewinnt/businesses.json`
- [ ] Jobs page — connect to DB (currently static)
- [ ] .ics export — calendar download on event detail pages
- [ ] Legal pages — Impressum + Datenschutz (DSGVO required)
- [ ] Newsletter signup — homepage form → Resend
- [ ] Create Turgay's superadmin account
- [ ] Deploy to Vercel

---

## Post-Launch

### Automation
- [ ] **Event scraper** — scheduled daily/weekly agent fetches venue websites (theater-ruesselsheim.de, das-rind.de, etc.), extracts events via Claude, pushes to admin queue. Config stored in `content_sources` table.
- [ ] **City mailing list ingestion** — AI reads city newsletters → drafts news articles → admin queue
- [ ] **Social media auto-posting** — publish to Instagram/Facebook when article/event goes live
- [ ] **Weekly newsletter** — automated send via Resend every Monday

### Telegram Bots (both run on VPS as Node.js)

**Business Bot** (paid businesses only)
- Natural conversation — business owner chats like texting a support agent
- Intents: post offer, post event, post job, announcement, update hours
- AI provider abstracted (default: Claude Haiku — swap to DeepSeek/GPT via config)
- Image generation via Flux (fal.ai) — optional, if business has no photo
- Standard tier: 10 posts/month cap
- Premium tier: unlimited
- Flow: message → Claude parses intent → preview → business confirms → admin queue → Turgay approves → live

**Admin Bot** (Turgay only, private chat)
- Photo of event poster → Claude Vision reads it → drafts event → goes live directly
- Photo of news article/flyer → Claude rewrites in German → draft in admin panel
- Quick publish without opening the admin panel

### Monetisation
- [ ] Stripe integration — Standard €9.99/mo, Premium €29.99/mo recurring
- [ ] Featured event boost — €12 one-time
- [ ] Spotlight slots (homepage Top-Partner) — 4 max, price TBD based on traffic
- [ ] Banner ads — manual invoicing
- [ ] "Gründungsmitglied" early adopter pricing at launch

### Analytics & SEO
- [ ] Plausible analytics
- [ ] Sitemap + robots.txt
- [ ] Structured data (JSON-LD) for events and businesses

---

## Business Tier Model

| Tier | Price | Features |
|------|-------|----------|
| Free | €0 | Basic listing, 1 photo |
| Standard | €9.99/mo | Description, hours, 5 photos, bot (10 posts/month) |
| Premium | €29.99/mo | Top of Gewerbe directory, unlimited bot posts |
| Spotlight | TBD | Homepage Top-Partner slot (max 4, booked separately) |

---

## Key Decisions
- No resident accounts — Turgay manages all content
- Stripe deferred until platform has traffic
- Bot access free for invited beta businesses at launch
- Site on Vercel, bots on VPS
- AI provider abstracted in bot — swappable without rewrite
