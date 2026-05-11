# Dreigewinnt — Agent Changelog

## 2026-05-11 16:25 UTC — Hermes
- Confirmed project remote is `https://github.com/turyildiz/dreigewinnt`; push policy is turyildiz only, not gonzo-ai.
- Fixed lint errors from JSX German quote usage and React 19 `set-state-in-effect` rule.
- Cleaned several unused variables/imports.
- Verified lint passes with 0 errors, TypeScript passes with `--incremental false`, production build passes in clean temp copy, and 7 production routes return HTTP 200.
- Created `.agent-context/` files so future agents have shared state and next steps.
