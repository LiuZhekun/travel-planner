# Design System Document: The Kinetic Nomad

## 1. Overview & Creative North Star
**Creative North Star: The Kinetic Nomad**
This design system rejects the static, clinical nature of traditional utility apps. Instead, it embraces "The Kinetic Nomad"—a philosophy where the interface feels as fluid and alive as the travel experience itself. We move away from the "standard grid" toward an editorial, layered experience characterized by **intentional asymmetry, hyper-radii, and tonal depth.**

To break the "template" look, designers must prioritize breathing room and overlapping elements. Layouts should feel like a high-end travel magazine brought to life: bold typography that breaks margins, cards that stack like physical snapshots, and a complete absence of rigid structural lines. This is a system built for high-glare sunlight and fast-paced movement, balancing "cool" aesthetics with high-utility performance.

---

## 2. Colors: High-Contrast Vitality
The palette is a celebration of the landscape—Sunset Oranges (`primary`), Ocean Blues (`secondary`), and Tropical Greens (`tertiary`).

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning. Boundaries are defined solely through background color shifts. Use `surface-container-low` sections against a `surface` background to create structure. If an element needs to stand out, let its color or a tonal shift do the work, never a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked physical layers.
*   **Base:** `surface` (#f5f6f7) for the global canvas.
*   **Sections:** `surface-container-low` (#eff1f2) for major content groupings.
*   **Nesting:** Place `surface-container-lowest` (#ffffff) cards on top of `surface-container-high` (#e0e3e4) backgrounds to create natural, soft lift. This creates "nested depth" that feels premium and architectural.

### The "Glass & Gradient" Rule
Standard flat colors lack "soul." 
*   **Signature Textures:** For Hero sections and primary CTAs, use a subtle linear gradient (135°) transitioning from `primary` (#9b3f00) to `primary_container` (#ff7a2c).
*   **Glassmorphism:** For floating navigation bars or quick-action overlays, use `surface` with 80% opacity and a `24px` backdrop-blur. This ensures the vibrant "travel" content bleeds through, making the UI feel integrated into the user's journey.

---

## 3. Typography: Editorial Impact
The type scale balances the playful energy of **Plus Jakarta Sans** with the functional clarity of **Be Vietnam Pro**.

*   **Display & Headlines (Plus Jakarta Sans):** These are your "vibe" setters. Use `display-lg` for destination names and `headline-md` for section starters. Use tight letter-spacing (-0.02em) to maintain a modern, "chunky" feel.
*   **Body & Labels (Be Vietnam Pro):** Reserved for the "utility." `body-lg` is your workhorse for itineraries. The high x-height ensures readability even in bright outdoor conditions.
*   **The Hierarchy Strategy:** Create contrast not just through size, but through color. Pair a `primary` color `headline-sm` with a `on_surface_variant` `body-md` to direct the eye instantly.

---

## 4. Elevation & Depth: Tonal Layering
We move away from the "shadow-heavy" look of 2010s Material Design in favor of modern layering.

*   **The Layering Principle:** Avoid shadows for static content. Achieve hierarchy by stacking `surface-container` tiers. A `surface-container-highest` card on a `surface` background provides all the "pop" required.
*   **Ambient Shadows:** For interactive "floating" elements (e.g., a "Add Note" FAB), use an extra-diffused shadow: `box-shadow: 0 12px 32px rgba(44, 47, 48, 0.08)`. The shadow must be a tinted version of `on-surface` (#2c2f30) to feel like natural ambient light.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge (e.g., in high-glare dark mode), use a "Ghost Border": `outline_variant` (#abadae) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components: Fluid Utility

### Buttons
*   **Primary:** High-contrast `primary` background with `on_primary` text. Radius: `full`.
*   **Secondary:** `secondary_container` background with `on_secondary_container` text. These should feel "cooler" and less urgent.
*   **Interactive State:** On hover/tap, buttons should scale to `1.05` with a "bouncy" cubic-bezier (0.34, 1.56, 0.64, 1).

### Cards & Lists
*   **The Rule:** No dividers. Use `1.5rem` (`md`) vertical spacing or subtle background shifts to separate items.
*   **Travel Cards:** Use `lg` (2rem) rounded corners. Image-heavy cards should use a `primary_container` placeholder to maintain energy while loading.

### External App "Portals"
Dedicated chips for Amap, Xiaohongshu, and Douyin.
*   **Style:** Use `surface-container-highest` with a vibrant icon of the respective service. 
*   **Interaction:** These are "Portals." They should have a distinct "click" feel (scale down to 0.95) to signify leaving the app.

### Input Fields
*   **Style:** `surface-container-low` backgrounds, no borders, `sm` (0.5rem) radius.
*   **Active State:** The background shifts to `surface-container-highest` with a 2px "Ghost Border" of the `primary` color.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins (e.g., 24px left, 16px right) to create a sense of movement.
*   **Do** use `primary` and `secondary` colors for "Actionable" vs "Informational" elements.
*   **Do** prioritize "Offline Ready" indicators—use the `tertiary` (Tropical Green) to signal synced data.
*   **Do** use large touch targets (minimum 48x48dp) for travelers on the move.

### Don’t
*   **Don’t** use pure black (#000000) for text or backgrounds. Use the `on_surface` and `surface` tokens to maintain tonal depth.
*   **Don’t** use 1px lines to separate list items; let the white space breathe.
*   **Don’t** use "stiff" animations. If it doesn't have a slight "bounce" or "overshoot," it doesn't fit the design system.
*   **Don’t** clutter the screen with utility. If a feature isn't needed for "on-the-road" planning, hide it in a `surface-container-low` drawer.