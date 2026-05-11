<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

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
