# Dreigewinnt — Product Requirements Document v2

**Date:** 2026-06-18
**Author:** Turgay + Claude
**Status:** Active

---

## 1. Vision

Dreigewinnt is the digital home for **Rüsselsheim am Main, Raunheim, and Kelsterbach** — three towns united under the official "Drei Gewinnt" strategic alliance (~92,000 residents).

The platform is an **events-first local portal** where residents discover what's happening, businesses promote themselves, and sports clubs connect with their communities. Content flows in through **Telegram bots** with zero friction — a club manager sends a photo of a flyer, and it becomes a published event.

Revenue comes from **ticket sales** (commission-based) and a **merch shop** — not SaaS subscriptions.

---

## 2. Core Entities

### Businesses (Gewerbe)
Local food, service, and retail shops — döner, Turkish/Arabic groceries, barbershops, nail studios, cafes, bakeries. Each gets a **rich profile**: header image, gallery, opening hours, contact, location, and a feed of their posts/updates.

### Sports Clubs (Sportvereine)
Every club across the three towns — football, volleyball, water sports, athletics, martial arts, etc. Same treatment as businesses: **rich profile** with header, gallery, info, and a news/updates feed. Clubs can post match results, training schedules, event announcements.

### Events (Veranstaltungen)
The **hero feature**. Cultural events, sports matches, tournaments, club activities, town festivals. Prominent placement on homepage, dedicated browse/filter page, calendar views. This is what drives traffic and becomes the ticketing funnel.

### News (Nachrichten/Magazin)
Local news and editorial content. Town announcements, club features, business spotlights.

---

## 3. Telegram Bots

Two separate bots, both running on VPS as Node.js services.

### 3.1 Public Bot (for businesses + clubs)
**Users:** Business owners, club managers — anyone with a linked profile.

**Capabilities:**
- Post updates (text + photos) to their profile feed
- Submit events (including photo-of-flyer → AI-drafted event)
- Update business hours, contact info
- View stats on their posts

**Flow:** Message → AI parses intent → preview → user confirms → admin approval queue → live

**Tech:** Grammy framework, Claude API for intent parsing + vision.

### 3.2 Admin Bot (for Turgay + team)
**Users:** Platform admins only.

**Capabilities:**
- Photo of event poster → Claude Vision reads it → drafts event → publish directly (no queue)
- Photo of news article/flyer → AI rewrites in German → draft in admin panel
- Approve/reject items from the queue
- Quick-publish without opening admin panel
- Notifications on new submissions

---

## 4. Poster-to-Event Pipeline

A core differentiator. Someone sees a flyer on a lamppost, snaps a photo, sends it to the bot. AI extracts: title, date, time, location, description, pricing. Drafts a full event listing. Admin reviews and publishes.

**Tech:** Claude Vision API for extraction, structured output to event schema.

---

## 5. V1 Scope — Get Live

Everything needed to launch a compelling, content-rich site that's ready to show to town press departments and early business/club partners.

### 5.1 Site Changes

| Item | Status | Work needed |
|------|--------|-------------|
| Business profiles — rich header, gallery, info, posts feed | Mostly built | Review and polish, ensure header image is prominent |
| Sports clubs section (`/vereine`) | New | Build: listing page, detail/profile page, admin CRUD — mirror Gewerbe architecture |
| Sports club profiles — header, gallery, info, news feed | New | Same profile quality as businesses |
| Events as homepage hero | Partially built | Redesign homepage to lead with events, make it the primary CTA |
| Jobs section | Built | Remove from navigation and homepage (keep code, just hide) |
| Admin: sports club management | New | CRUD for clubs, approval queue, posts management |
| Admin: club submissions | New | Public submission form at `/vereine/einreichen` |
| Legal pages | Draft exists | Fill in address placeholders (waiting on Turgay) |
| Newsletter signup | UI exists | Wire to All-inkl SMTP (waiting on Turgay for credentials) |

### 5.2 Telegram Bots

| Item | Work needed |
|------|-------------|
| Admin bot — poster-to-event | Build: Grammy bot, Claude Vision integration, event draft flow |
| Admin bot — quick publish | Build: approve/reject from chat, direct publish |
| Public bot — post updates | Build: link business/club to Telegram user, intent parsing, preview flow |
| Public bot — submit events | Build: flyer photo → event draft → queue |

### 5.3 Content & Outreach

| Item | Details |
|------|---------|
| Curate 30-50 businesses | Manually select food/service shops from OSM data, enter profiles |
| Research sports clubs | Find all Vereine in the 3 towns, compile list |
| Seed 10-20 events | Enter upcoming real events to populate the calendar |
| Contact town press departments | Pitch the platform, ask for support (financial, promotional, endorsement) |
| Business/club outreach | Same email playbook as Bereket — after site looks solid |

### 5.4 Infrastructure

| Item | Status |
|------|--------|
| Staging (VPS, port 3005) | Running |
| Cloudflare R2 images | Working |
| Supabase DB | Working |
| Vercel production deploy | Not done — do when site is ready to show |
| Bot hosting on VPS | New — need systemd services for both bots |

---

## 6. V2 Scope — After Traction

Do NOT build any of this before V1 is live and has real users/content.

| Feature | Notes |
|---------|-------|
| **Ticketing system** | Commission-based ticket sales for all events. Major revenue stream. Stripe integration. |
| **Merch shop** | Dreigewinnt branded merchandise + club merchandise sales |
| **Business sponsorship on club pages** | Cross-sell: local shops sponsor clubs, ads show on club profiles |
| **Season passes** | Recurring tickets (e.g., volleyball season home games) |
| **Weekly digest email** | "This week in Drei Gewinnt" automated newsletter |
| **Club membership sales** | Online Vereinsbeitritt for clubs that still do it on paper |
| **Analytics** | Plausible integration |
| **SEO** | Sitemap, robots.txt, JSON-LD structured data |
| **Social media auto-posting** | Auto-publish to Instagram/Facebook |

---

## 7. Tech Stack

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

## 8. Design

"Digital Curator" editorial aesthetic. Deep navy, gold accents, Inter typography. No borders — background shifts only. Glassmorphism for floating elements. Full spec in `DESIGN.md`.

Sports club profiles follow the same design language as business profiles.

---

## 9. Key Decisions

- **Events-first** — events drive traffic, everything else follows
- **No bulk import** — manually curate quality businesses, not 594 scraped dentists
- **Two Telegram bots** — clean separation between admin and public
- **Jobs dropped from V1** — not a priority, hide from nav
- **Ticketing is V2** — get content flowing first, monetize later
- **Town support** — approach press departments as partners, not just advertisers
- **Sports clubs = businesses** — same profile quality, same bot access, same admin workflows
