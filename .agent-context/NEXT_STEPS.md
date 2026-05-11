# Dreigewinnt — Next Steps

Last updated: 2026-05-11 16:25 UTC by Hermes

## Immediate
1. Keep commits small and push regularly to `turyildiz/dreigewinnt` only.
2. Finish establishing shared agent context so Claude/Hermes/Otis can coordinate safely.
3. Review remaining pre-launch blockers from `_docs/ROADMAP.md`.

## Pre-launch checklist from roadmap
- [ ] Import ~594 businesses from `/var/www/html/dreigewinnt/businesses.json` once the source file is restored or copied to this machine. Use `npm run import:businesses -- --source <path>` for dry-run first, then add `--apply` only after checking the output.
- [x] Jobs page is connected to Supabase `jobs` table.
- [x] Add `.ics` export/calendar download on event detail pages.
- [ ] Legal pages: Impressum + Datenschutz exist as drafts, but address placeholders must be replaced before launch.
- [ ] Wire newsletter signup to Resend.
- [ ] Create Turgay's superadmin account.
- [ ] Deploy to Vercel.

## Suggested order
1. Baseline commit/push: lint/type/build stabilization + agent context.
2. Pick one functional blocker at a time, starting with jobs DB or legal pages depending on launch urgency.
3. Verify with lint + typecheck + build/smoke after each meaningful change.
