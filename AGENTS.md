<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

## ⚠️ CRITICAL — CONFIRM BEFORE ANY ACTION

Before writing a single line of code, running a script, editing a file, or pushing anything:
1. Explain what you plan to do and why
2. Explain the implications (what changes, what's irreversible)
3. Wait for Turgay's explicit "yes"
4. Only then act

**Session resumption:** Approvals from a previous session do NOT carry over. Always list pending work and wait for fresh confirmation.



This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Dreigewinnt Agent Workflow

Before meaningful work:
1. Read `/home/repos/AGENTS.md`.
2. Read this file.
3. Read `.agent-context/CURRENT_STATE.md` and `.agent-context/NEXT_STEPS.md`.

After meaningful work:
- Append a short factual entry to `.agent-context/CHANGELOG.md`.
- Update `.agent-context/CURRENT_STATE.md` if reality changed.
- Update `.agent-context/NEXT_STEPS.md` if priorities changed.
- Update `.agent-context/DECISIONS.md` if a decision was locked in.

Project-specific rules:
- Push only to `https://github.com/turyildiz/dreigewinnt`; do not push Dreigewinnt work to `gonzo-ai`.
- Keep commits small and push regularly during active work.
- Never write secrets, tokens, passwords, API keys, or full credential paths into context files.
- **Design is locked** — do not change UI/UX, only functional changes.
- **No tier system** — every partner gets full features. Do not add freemium/premium logic.
- **PRD v3 is current** — read `_docs/PRD_v3.md` (not v2). Battle plan at `_docs/BATTLEPLAN.md`.
