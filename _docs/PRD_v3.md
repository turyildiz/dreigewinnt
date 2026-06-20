# Dreigewinnt — Product Requirements Document v3

**Date:** 2026-06-20
**Author:** Turgay + Claude
**Status:** Active
**Supersedes:** PRD_v2.md

---

## 1. Vision

Dreigewinnt is the digital home for **Rüsselsheim am Main, Raunheim, and Kelsterbach** — three towns united under the official "Drei Gewinnt" strategic alliance (~92,000 residents).

The platform is an **events-first local portal** where residents discover what's happening, businesses promote themselves, and sports clubs connect with their communities. Partners manage their presence entirely through a **Telegram bot** — zero friction, no logins, no dashboards.

Revenue comes from **ticket sales commission**, **premium ad placements**, **job listings**, and **municipality partnerships** — not SaaS subscriptions or tiered pricing.

---

## 2. Core Entities

### Partners (unified concept)

Every business, sports club, or organisation on the platform is a **partner**. There are no tiers — no freemium, no premium. Every partner gets the full feature set: header image, gallery, info section, posts feed, contact form, and full Telegram bot access.

**Types of partners:**
- **Businesses (Gewerbe):** Local food, service, and retail shops — döner, groceries, barbershops, nail studios, cafes, bakeries, pharmacies.
- **Sports Clubs (Sportvereine):** Football, volleyball, water sports, athletics, martial arts, etc. Same profile quality as businesses.
- **Organisations:** Future — could include cultural centres, town offices, churches, etc.

### Events (Veranstaltungen)

The **hero feature**. Cultural events, sports matches, tournaments, club activities, town festivals. Prominent placement on homepage, dedicated browse/filter page. Drives traffic and becomes the ticketing funnel.

### News (Nachrichten/Magazin)

Local news and editorial content. Town announcements, club features, business spotlights.

---

## 3. Partner Onboarding Flow

Partners do not create accounts on the website. The flow is physical + Telegram:

1. **Admin creates partner profile** in the admin panel with basic info (name, town, category, address).
2. **Admin generates a Telegram code** for the partner (e.g., `RINGRAU001` — town abbreviation + sequential number).
3. **Turgay visits the partner** in person with a printed flyer. The flyer explains what dreigewinnt is and includes:
   - The partner's unique Telegram code
   - Instructions: "Search for @dreigewinnt_bot on Telegram and send your code"
4. **Partner starts the bot**, sends their code. Bot verifies the code and links their Telegram account to their profile.
5. **Partner manages everything via Telegram** from this point on.

If a partner posts garbage or inappropriate content, admin deletes the account. No approval queue for partner content — trust-based with admin override.

---

## 4. Telegram Bots

Two separate bots, both running on VPS via Grammy (Node.js) + Claude API.

### 4.1 Public Bot — Partner Self-Service

**Users:** Any partner linked via Telegram code.

**Capabilities:**
- **Set header image:** Send a photo + "set this as my header" → bot updates header
- **Add to gallery:** Send photos + "add to gallery" → bot appends to gallery
- **Update info:** Send text + "add to info section" → bot updates profile description/info
- **Create post:** Send photo/text + "this is a post" → published to their profile feed
- **Submit event:** Send a flyer photo or text → AI drafts event → partner confirms → live
- **Update contact/hours:** Natural language instructions parsed by Claude

**How it works:** Partner sends a message → Claude API parses intent → bot performs action → confirms back to partner. No approval queue — content goes live immediately. Admin monitors and removes bad actors.

**Tech:** Grammy framework, Claude API for intent parsing + vision.

### 4.2 Admin Bot — Content Management

**Users:** Platform admins only (Turgay + team, whitelisted by Telegram user ID).

**Capabilities:**
- Photo of event poster → Claude Vision extracts event data → preview → publish
- Link or photo → Claude drafts news article → preview → publish
- Approve/reject partner submissions (if queue is ever added)
- Quick-publish without opening admin panel
- Notifications on new partner registrations

Already built and running: `@dreigewinnt_admin_bot`

---

## 5. Visitor-to-Partner Messaging

Visitors on the website can message any partner without creating an account.

**Flow:**
1. Partner profile page has a "Nachricht senden" button
2. Visitor fills a simple form: name, message, optionally email/phone
3. On submit, the bot forwards the message to the partner on Telegram
4. Partner can respond directly via phone/email to the visitor

**Spam protection:** Honeypot field + rate limiting (max 3 messages per IP per hour). No captcha.

---

## 6. Poster-to-Event Pipeline

A core differentiator. Someone sees a flyer, snaps a photo, sends it to either bot. AI extracts: title, date, time, location, description, pricing. Drafts a full event listing.

- Admin bot: publishes directly
- Public bot: partner confirms → goes live

**Tech:** Claude Vision API for extraction, structured output to event schema.

---

## 7. V1 Scope — Get Live

### 7.1 Already Built

| Item | Status |
|------|--------|
| Business profiles (header, gallery, info, posts) | Done |
| Sports clubs section (`/sport`) | Done — 83 clubs imported |
| Club profiles (header, gallery, info, posts) | Done |
| Events listing + detail + calendar export | Done |
| News/magazine section | Done |
| Admin panel (full CRUD for all entities) | Done |
| Submission forms (businesses, clubs, events) | Done |
| Search (businesses, clubs, events) | Done |
| Navigation (Events first, Sport, Jobs hidden) | Done |
| Admin Telegram bot | Done — @dreigewinnt_admin_bot live |
| R2 image uploads | Done |
| Staging at dreigewinnt.heyturgay.com | Done |

### 7.2 Still Needed

| Item | Details |
|------|---------|
| Telegram code system | Generate codes in admin, verify in bot, link partner to profile |
| Public bot — partner self-service | Full self-service: header, gallery, info, posts, events via chat |
| Visitor-to-partner messaging | Contact form on profiles, forwarded via bot |
| Events-first homepage | Redesign homepage to lead with upcoming events as hero |
| Content seeding | 30-50 curated businesses, 20+ events, 5-10 articles |
| Image lightbox on event detail pages | |
| Legal pages | Fill in address (need Turgay's input) |
| Newsletter signup | Wire to All-inkl SMTP |

### 7.3 Infrastructure

| Item | Status |
|------|--------|
| Staging (VPS, port 3005) | Running |
| Cloudflare R2 images | Working |
| Supabase DB | Working |
| Admin bot on VPS | Running |
| Vercel production deploy | Not done — deploy when ready |
| Public bot on VPS | Not done |

---

## 8. Revenue Model

No SaaS subscriptions. No tiered pricing. Partners use the platform for free.

### Revenue Streams

| Stream | Model | When |
|--------|-------|------|
| **Ticketing** | 2€ Gebühr per ticket sold via Stripe. Even small events (10-15€ tickets) generate profit after Stripe fees. | V2 — primary revenue stream |
| **Premium ad spots** | Paid placements on homepage and section pages. 3-4 spots per page. Pricing scales with traffic (30-200€/month per spot). | After traction |
| **Job listings** | Charge per listing (20-50€ for 30 days). | After traction |
| **Municipality partnerships** | Pitch as digital infrastructure for the Drei Gewinnt alliance. 500-2,000€/month per town. | After launch — approach press departments |

### Revenue Projections by Traffic

| Monthly visitors | Ticketing | Ad spots | Job ads | Municipality | Total |
|-----------------|-----------|----------|---------|-------------|-------|
| 1,000 | 100-200€ | 90-150€ | — | — | 190-350€ |
| 5,000 | 400-1,000€ | 150-400€ | 200-500€ | 1,500-6,000€ | 2,250-7,900€ |
| 10,000+ | 1,000-4,000€ | 300-800€ | 200-500€ | 1,500-6,000€ | 3,000-11,300€ |

Target: 5% of 92,000 residents = ~4,600 monthly visitors is realistic for a well-run local portal.

---

## 9. V2 Scope — After Traction

| Feature | Notes |
|---------|-------|
| **Ticketing system** | Stripe integration, commission-based. Main revenue. |
| **Weekly digest bot** | Subscribers get weekly Telegram message with events/offers summary |
| **Event reminders** | "Erinnere mich" on event pages → Telegram/email reminder 24h before |
| **Partner offers/Aktionen** | Time-limited deals posted via bot, shown on profile + homepage |
| **Club match schedules** | Spielplan widget on Sport page |
| **Partner QR codes** | Auto-generated QR linking to profile, for shop windows |
| **"Neu in der Stadt" page** | Curated landing page for newcomers — evergreen SEO content |
| **Event photo galleries** | Post-event photo uploads, drives traffic spikes |
| **Merch shop** | Dreigewinnt + club merchandise |
| **Sponsorship ads on club pages** | Local businesses sponsor clubs |
| **Season passes** | Recurring tickets for sports seasons |
| **Club memberships** | Online Vereinsbeitritt |
| **Jobs section** | Reactivate in nav, charge per listing |
| **Analytics** | Plausible integration |
| **SEO** | Sitemap, robots.txt, JSON-LD structured data |

---

## 10. Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 + React 19, Tailwind v4, TypeScript strict |
| Database | Supabase (PostgreSQL) |
| Media | Cloudflare R2 (`images.dreigewinnt.com`) |
| Bots | Grammy (Node.js), Claude API |
| AI | Claude (intent parsing, vision, content generation) |
| Hosting — site | Vercel (production), VPS port 3005 (staging) |
| Hosting — bots | VPS (systemd services) |
| Payments (V2) | Stripe |
| Email | All-inkl SMTP |
| DNS | Cloudflare |

---

## 11. Design

"Digital Curator" editorial aesthetic. Deep navy, gold accents, Inter typography. No borders — background shifts only. Glassmorphism for floating elements. Full spec in `DESIGN.md`. **Design is locked — do not change.**

---

## 12. Key Decisions

- **Events-first** — events drive traffic, everything else follows
- **No tiers** — every partner gets full features, no freemium/premium distinction
- **Telegram-first partner management** — no web dashboard, no login, everything via bot
- **Telegram codes** — physical onboarding, Turgay visits partners with printed flyers
- **No approval queue for partner content** — trust-based, admin deletes bad actors
- **Two Telegram bots** — admin bot (content management) + public bot (partner self-service)
- **Revenue from usage, not subscriptions** — ticketing commission, ad spots, job ads, municipality funding
- **No bulk import** — manually curate quality partners
- **Jobs hidden in V1** — reactivate later when charging per listing
- **Design is locked** — UI/UX stays as-is, only functional changes
