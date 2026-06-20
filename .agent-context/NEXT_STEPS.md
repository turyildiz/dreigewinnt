# Dreigewinnt — Next Steps

Last updated: 2026-06-20 by Claude

**Full battle plan: `_docs/BATTLEPLAN.md`**

---

## NOW: Phase 3 — Telegram Code System (June 20–24)

### Database
- [ ] Add `telegram_code` (unique, e.g., RINGRAU001), `telegram_chat_id`, `telegram_linked_at` to businesses table
- [ ] Add same columns to clubs table
- [ ] Consider a unified `partners` view or shared approach

### Admin UI
- [ ] Generate codes per partner (auto-format: town abbreviation + sequential number)
- [ ] Display code on partner detail page in admin
- [ ] Regenerate code if needed

### Public Bot
- [ ] `/start <CODE>` flow — verify code exists and is unlinked
- [ ] Link Telegram chat_id to partner profile
- [ ] Confirm to partner: "Du bist jetzt mit [Business Name] verbunden!"
- [ ] Prevent double-linking

### Flyer Template
- [ ] Design printable A5 flyer with: Dreigewinnt branding, blank code field, QR to bot, instructions in German

---

## NEXT: Phase 4 — Partner Self-Service Bot (June 25–July 2)

- [ ] Claude API intent parsing for partner messages
- [ ] Handle: set_header, add_gallery, update_info, create_post, submit_event, update_contact
- [ ] R2 uploads from bot
- [ ] Confirmation messages back to partner
- [ ] systemd service on VPS

---

## THEN: Phase 5 — Visitor-to-Partner Messaging (July 3–6)

- [ ] "Nachricht senden" contact form on partner profile pages
- [ ] API route → forward message to partner's Telegram
- [ ] Honeypot + rate limiting for spam protection

---

## LATER: Phase 6+7 — Content + Launch (July 7–20)

- [ ] Events-first homepage redesign
- [ ] Content seeding (30-50 businesses, 20+ events, 5-10 articles)
- [ ] Legal pages, newsletter wiring
- [ ] Vercel deploy, DNS switch
- [ ] Print flyers, visit partners, outreach

---

## Dependencies on Turgay

| Item | Needed for |
|------|-----------|
| Create public Telegram bot via BotFather | Phase 4 |
| All-inkl SMTP credentials | Phase 7 |
| Legal address for Impressum/Datenschutz | Phase 7 |
| Print onboarding flyers | Phase 7 |
| Visit partners in person | Phase 7 |

---

## Dev workflow
```
cd /home/repos/dreigewinnt
npm run build
fuser -k 3005/tcp
# systemd (dreigewinnt.service) auto-restarts in ~5s
# test at https://dreigewinnt.heyturgay.com
```
