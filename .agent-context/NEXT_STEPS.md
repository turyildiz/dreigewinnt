# Dreigewinnt — Next Steps

Last updated: 2026-05-11 16:25 UTC by Hermes

## Immediate
1. Keep commits small and push regularly to `turyildiz/dreigewinnt` only.
2. Finish establishing shared agent context so Claude/Hermes/Otis can coordinate safely.
3. Review remaining pre-launch blockers from `_docs/ROADMAP.md`.

## Pre-launch checklist from roadmap
- [ ] Import ~594 businesses from `/var/www/html/dreigewinnt/businesses.json`.
- [ ] Connect Jobs page to DB; roadmap says it is currently static.
- [ ] Add `.ics` export/calendar download on event detail pages.
- [ ] Add legal pages: Impressum + Datenschutz.
- [ ] Wire newsletter signup to Resend.
- [ ] Create Turgay's superadmin account.
- [ ] Deploy to Vercel.

## Suggested order
1. Baseline commit/push: lint/type/build stabilization + agent context.
2. Pick one functional blocker at a time, starting with jobs DB or legal pages depending on launch urgency.
3. Verify with lint + typecheck + build/smoke after each meaningful change.
