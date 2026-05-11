# Dreigewinnt — Agent Changelog

## 2026-05-11 16:29 UTC — Hermes
- Added `/api/events/[slug]/calendar.ics` Route Handler for event calendar downloads.
- Verified lint and TypeScript still pass.
- Verified production build includes the new ICS route.
- Smoke-tested `/events`, extracted an active event slug, and confirmed the `.ics` download returns HTTP 200 with `text/calendar`.
- Updated roadmap: Jobs page is DB-backed; `.ics` export is done; legal pages remain draft because address placeholders must be replaced before launch.

## 2026-05-11 16:25 UTC — Hermes
- Confirmed project remote is `https://github.com/turyildiz/dreigewinnt`; push policy is turyildiz only, not gonzo-ai.
- Fixed lint errors from JSX German quote usage and React 19 `set-state-in-effect` rule.
- Cleaned several unused variables/imports.
- Verified lint passes with 0 errors, TypeScript passes with `--incremental false`, production build passes in clean temp copy, and 7 production routes return HTTP 200.
- Created `.agent-context/` files so future agents have shared state and next steps.
