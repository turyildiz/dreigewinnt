# The Design System: Editorial Localism

## 1. Overview & Creative North Star: "The Digital Curator"
This design system moves away from the generic "portal" look, opting instead for a **High-End Editorial** experience. The Creative North Star is **The Digital Curator**: a bridge between a premium broadsheet newspaper and a sleek, modern utility. 

To break the "template" aesthetic, we employ **Intentional Asymmetry**. Key information isn't always centered; it’s paced. Large typography scales collide with tight, functional grids to create a sense of authoritative urgency. We treat the user interface not as a collection of boxes, but as a series of layered, "physical" assets—like a curated desk of news, maps, and local intelligence.

---

## 2. Colors: Depth Over Definition
Our palette is rooted in the "Deep Navy" of institutional trust, punctuated by "Success Green" for action and "Gold" for exclusivity.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts. Use `surface-container-low` (#f0f3ff) for sections sitting on a `surface` (#f9f9ff) background. 

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of fine paper. 
- **Base Level:** `surface` (#f9f9ff)
- **Primary Content Blocks:** `surface-container-lowest` (#ffffff) for maximum "lift."
- **Secondary/Utility Blocks:** `surface-container-high` (#dee8ff) to recede.

### The "Glass & Gradient" Rule
To avoid a flat, "out-of-the-box" feel, floating elements (like the Search bar or Mobile Nav) must use **Glassmorphism**. Apply `surface` at 80% opacity with a `backdrop-blur` of 12px. 
*Signature Polish:* Main CTAs should not be flat. Use a subtle linear gradient from `secondary` (#006d42) to `secondary_fixed_dim` (#74db9f) at a 135° angle to provide visual "soul."

---

## 3. Typography: The Authoritative Voice
We use **Inter** exclusively, but we manipulate its weight and tracking to distinguish between "The Curator" (Headlines) and "The Utility" (Labels).

*   **Display & Headlines:** Use `display-md` or `headline-lg` with tight tracking (-0.02em) and `primary` (#020511). This creates a "masthead" feel for town names (e.g., **Rüsselsheim**).
*   **Body Copy:** `body-lg` uses `on_surface_variant` (#46464c) to reduce eye strain during long-form reading of local news.
*   **Labels:** `label-md` is always Uppercase with +0.05em tracking to denote metadata (e.g., 'GEWERBEVERZEICHNIS').

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too "software-heavy." We use **Ambient Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. The contrast in hex values creates a soft, natural edge.
*   **Ambient Shadows:** If an element must float (e.g., a modal), use a shadow with a 40px blur, 0px offset, and 6% opacity of `primary` (#020511). This mimics natural light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` (#c7c6cc) at **15% opacity**. Never use 100% opaque lines.

---

## 5. Signature Components

### Premium Business Cards (Gewerbeverzeichnis)
- **Base:** `surface-container-lowest` (#ffffff).
- **The Distinction:** A 2px "Ghost Border" using `tertiary_container` (#cca830) at 40% opacity.
- **Featured Badge:** A small, `tertiary` (#735c00) tab in the top right, featuring `label-sm` text "TOP-PARTNER" in `on_tertiary` (#ffffff).
- **Interaction:** On hover, the card shifts background to `surface-bright`.

### Featured Event Cards (Veranstaltungen)
- **Layout:** Asymmetric. The image occupies 60% of the card, while the text block overlaps the image edge by `spacing-4` (1rem).
- **Typography:** `title-lg` for the event name, `label-md` in `secondary` (#006d42) for the date.
- **Visual:** Use a `surface-variant` (#d8e3fa) overlay on the image bottom to ensure text legibility.

### Town Tags (Raunheim, Kelsterbach, Rüsselsheim)
- **Form:** Pill-shaped (`rounded-full`).
- **Visual Indicator:** 
    - **Raunheim:** `surface-container-highest` with `primary` text.
    - **Kelsterbach:** `secondary_container` with `on_secondary_container` text.
    - **Rüsselsheim:** `tertiary_fixed` with `on_tertiary_container` text.
- **Usage:** These are small anchors placed above headlines to build immediate local recognition.

### Search/Filter Interface (The Entry Point)
- **Style:** A floating "Glass" bar. 
- **Background:** `surface` (#f9f9ff) at 85% opacity + `backdrop-blur`.
- **Inner Shadow:** A subtle 1px inner stroke of `outline_variant` at 20% to give it a "carved" look into the viewport.
- **Action:** The 'Suchen' button uses the Signature Gradient (Secondary to Secondary-Dim).

### Buttons & Inputs
- **Primary Button:** `rounded-sm` (4px). Background: `secondary`. Text: `on_secondary`. No border.
- **Input Fields:** `surface-container-low` background. On focus, the background shifts to `surface-container-lowest` with a 1px `primary` Ghost Border (20% opacity).

---

## 6. Do's and Don'ts

### Do
- **Do** use whitespace (`spacing-8` and above) to separate news categories instead of lines.
- **Do** use German terminology: 'Veranstaltungen' instead of 'Events', 'Gewerbe' instead of 'Business'.
- **Do** use `tertiary` (Gold) sparingly; it is for "Premium" status only. If everything is gold, nothing is premium.

### Don't
- **Don't** use standard Material Design drop shadows.
- **Don't** use pure black (#000000). Use `primary` (#020511) for deep blacks and `on_surface_variant` (#46464c) for standard text.
- **Don't** round corners beyond `rounded-md` (6px) except for Town Tags. We want a professional, "sharper" architectural feel.
- **Don't** use dividers. If two items are too close, increase the spacing token (e.g., from `spacing-4` to `spacing-6`).