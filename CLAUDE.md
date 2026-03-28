@AGENTS.md

# Drei Gewinnt — Project Instructions

## Project Overview
**dreigewinnt.com** is a local portal for three adjacent German towns: Raunheim, Kelsterbach, and Rüsselsheim. It aggregates a business directory (Gewerbeverzeichnis), local events (Veranstaltungen), and a newsletter. The UI language is **German**.

## Tech Stack
- **Next.js 16.2.1** + **React 19** — see AGENTS.md; read `node_modules/next/dist/docs/` before writing Next.js code
- **Tailwind CSS v4** — breaking changes from v3. Use `@tailwindcss/postcss`, not the v3 PostCSS plugin. No `tailwind.config.js` — configuration lives in `globals.css` via `@theme`.
- **TypeScript** (strict)
- **clsx** + **tailwind-merge** for conditional class names
- **lucide-react** and **Material Symbols Outlined** (loaded via Google Fonts) for icons

## Commands
```bash
npm run dev    # development server
npm run build  # production build
npm run lint   # eslint
```

## File Structure
```
src/
  app/                    # Next.js App Router pages & layouts
    (directory)/          # Route group for directory pages
  components/
    layout/               # TopNavbar, SideNavBar, Footer
    ui/                   # Reusable UI components (BusinessCard, EventCard, SearchBar, TownTag)
_docs/
  DESIGN.md               # Design system spec — read this before adding/changing UI
```

## Design System
The full spec is in [_docs/DESIGN.md](_docs/DESIGN.md). Key rules:

- **No borders for layout** — use background color shifts to separate sections (`surface-container-low` on `surface`, etc.)
- **No pure black** — use `primary` (#020511) for deep text, `on-surface-variant` for body text
- **No drop shadows** — use tonal layering; ambient shadow only for modals (40px blur, 6% opacity)
- **Corner radius max `rounded-md`** except Town Tag pills (`rounded-full`)
- **Glassmorphism** for floating elements (search bar, mobile nav): `surface` at 80% opacity + `backdrop-blur-[12px]`
- **Signature gradient** on primary CTAs: `secondary` → `secondary_fixed_dim` at 135°, use `.signature-gradient` class
- **Gold (`tertiary`)** is for "Premium" / "Top-Partner" status only — use sparingly
- **Labels**: always uppercase, `tracking-widest`

### Town Tags
Each town has a fixed color scheme — use the `<TownTag town="..." />` component, do not replicate inline.

### German terminology
Use German for all UI copy: `Veranstaltungen` not "Events", `Gewerbe` not "Business", `Suchen` not "Search", etc.

## Code Conventions
- Export components as named exports (not default)
- Use `clsx`/`tailwind-merge` for conditional Tailwind classes
- Pages go in `src/app/`, shared UI in `src/components/ui/`, layout shells in `src/components/layout/`
- Max content width: `max-w-[1440px] mx-auto` on the page wrapper
