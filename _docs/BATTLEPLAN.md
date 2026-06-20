# Dreigewinnt — Battle Plan

**Updated:** 2026-06-20
**Goal:** Revamp partner access model (Telegram-first, no tiers), build public bot for self-service, add visitor messaging, launch with real content.

---

## Phase 1: Sports Clubs + Site Restructure — DONE

Completed 2026-06-18. Clubs section built, 83 clubs imported, navigation updated, admin bot live.

---

## Phase 2: Admin Telegram Bot — DONE

Completed 2026-06-18. @dreigewinnt_admin_bot running on VPS. Poster-to-event, quick publish, text-to-article all working.

---

## Phase 3: Telegram Code System + Partner Onboarding (June 20–24)

**Goal:** Partners can be onboarded via printed flyers with unique Telegram codes.

- [ ] **Database**: Add `telegram_code`, `telegram_chat_id`, `telegram_linked_at` columns to businesses and clubs tables
- [ ] **Admin UI**: Generate/view/regenerate Telegram codes for each partner
- [ ] **Code format**: Town abbreviation + sequential number (e.g., `RINGRAU001`, `KELKEL015`, `RUSRUS042`)
- [ ] **Bot**: `/start <CODE>` flow — verify code, link Telegram user to partner profile, confirm
- [ ] **Bot**: Prevent double-linking (one code = one Telegram account)
- [ ] **Flyer template**: Design a printable A5 flyer with code field, bot instructions, QR code to bot

**Done when:** Turgay can generate a code in admin, hand it to a shop owner, and the owner links their Telegram to their profile within 60 seconds.

---

## Phase 4: Public Bot — Partner Self-Service (June 25–July 2)

**Goal:** Partners manage their entire profile via Telegram chat.

- [ ] **Intent parsing**: Claude API parses partner messages into actions (set_header, add_gallery, update_info, create_post, submit_event)
- [ ] **Set header image**: Partner sends photo + intent → bot updates header_image in DB + R2
- [ ] **Add to gallery**: Partner sends photos → bot uploads to R2, appends to gallery
- [ ] **Update info**: Partner sends text about their business → bot updates description/info fields
- [ ] **Create post**: Partner sends photo/text → bot creates a post on their profile feed
- [ ] **Submit event**: Partner sends flyer/text → Claude Vision extracts → event goes live
- [ ] **Update contact/hours**: Natural language → bot parses and updates fields
- [ ] **Help/status**: Partner can ask "what does my profile look like?" → bot sends summary or link
- [ ] **Deploy**: systemd service on VPS, auto-restart

**Done when:** A linked partner can manage their entire profile — header, gallery, info, posts, events — purely through Telegram messages.

---

## Phase 5: Visitor-to-Partner Messaging (July 3–6)

**Goal:** Website visitors can contact any partner without creating an account.

- [ ] **Contact form**: "Nachricht senden" button on every partner profile page
- [ ] **Form fields**: Name (required), message (required), email (optional), phone (optional)
- [ ] **API route**: Receives form, forwards message to partner's linked Telegram via bot
- [ ] **Telegram message format**: "Neue Nachricht über dreigewinnt.com:\nVon: [name]\nNachricht: [message]\nKontakt: [email/phone]"
- [ ] **Spam protection**: Honeypot field + rate limiting (3 messages per IP per hour)
- [ ] **Unlinked partners**: Show contact info (phone/email/website) instead of form if no Telegram linked

**Done when:** A visitor can send a message from a partner's profile page and the partner receives it instantly on Telegram.

---

## Phase 6: Events-First Homepage + Content Seeding (July 7–13)

**Goal:** Homepage leads with events, site has enough real content to look alive.

- [ ] **Homepage redesign**: Upcoming events as hero section, prominent "Was ist los?" CTA
- [ ] **Content**: Curate 30-50 real businesses with profiles
- [ ] **Content**: Seed 20+ real upcoming events from venue sites, club calendars, town pages
- [ ] **Content**: Write 5-10 news articles
- [ ] **Content**: Review and enrich existing 83 club profiles
- [ ] **Image lightbox**: Add to event detail pages
- [ ] **Test both bots end-to-end** with real partner data

**Done when:** Homepage leads with events, site has 30+ businesses, 20+ events, 5+ articles — all real.

---

## Phase 7: Production Launch + Outreach (July 14–20)

**Goal:** dreigewinnt.com is live, first partners onboarded.

- [ ] **Legal pages**: Fill in address (need Turgay)
- [ ] **Newsletter**: Wire to All-inkl SMTP (need Turgay's credentials)
- [ ] **Vercel deploy**: Deploy site, point dreigewinnt.com DNS
- [ ] **Production env vars**: All secrets in Vercel project settings
- [ ] **Print flyers**: Design and print onboarding flyers with code fields
- [ ] **First partner visits**: Turgay visits 10-15 businesses in Raunheim with flyers
- [ ] **Contact town press departments**: Pitch as digital infrastructure for Drei Gewinnt alliance
- [ ] **Club outreach**: Email clubs with their profiles already live

**Done when:** dreigewinnt.com is live, first 10+ partners onboarded via Telegram codes, press departments contacted.

---

## Timeline Summary

| Phase | Dates | Focus | Status |
|-------|-------|-------|--------|
| 1 | June 18 | Sports clubs + site restructure | DONE |
| 2 | June 18 | Admin Telegram bot | DONE |
| 3 | June 20–24 | Telegram code system + onboarding | Next |
| 4 | June 25–July 2 | Public bot — partner self-service | |
| 5 | July 3–6 | Visitor-to-partner messaging | |
| 6 | July 7–13 | Events-first homepage + content seeding | |
| 7 | July 14–20 | Production launch + outreach | |

**Target: Live by end of July with real partners and content. August 2026 latest.**

---

## Dependencies on Turgay

| Item | Needed for |
|------|-----------|
| Create public Telegram bot via BotFather | Phase 4 |
| All-inkl SMTP credentials | Phase 7 (newsletter) |
| Legal address for Impressum/Datenschutz | Phase 7 (legal pages) |
| Print onboarding flyers | Phase 7 (partner visits) |
| Visit partners in person | Phase 7 (onboarding) |
| Contact press departments (personal touch) | Phase 7 |

---

## Out of Scope (V2)

Ticketing (Stripe), weekly digest bot, event reminders, partner offers/Aktionen, match schedules, partner QR codes, "Neu in der Stadt" page, event photo galleries, merch shop, sponsorship ads, season passes, club memberships, jobs section (reactivate later), Plausible analytics, SEO/structured data, social media auto-posting.
