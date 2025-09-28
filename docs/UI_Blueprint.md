# ARC UI Blueprint

## I. UI Stack Setup Plan

Here’s the plan to integrate **TailwindCSS, Radix UI, and shadcn/ui** into the Electron + Vite + React project:

1.  **TailwindCSS Installation**
    -   Install `tailwindcss`, `postcss`, and `autoprefixer` as dev dependencies.
    -   Initialize `tailwind.config.js` and `postcss.config.js`.
    -   Configure `tailwind.config.js` to scan React component files:
        ```js
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
        ```
    -   Add Tailwind directives (` @tailwind base; @tailwind components; @tailwind utilities;`) into `src/index.css`.

2.  **Radix UI Integration**
    -   Use Radix as composable, accessible primitives (dialogs, dropdowns, popovers).
    -   Ensures ARC’s UI remains security‑focused and accessibility‑friendly by default.
    -   Radix is unstyled, which pairs perfectly with Tailwind and ARC’s holographic/blueprint design system.

3.  **shadcn/ui Setup**
    -   Run `npx shadcn-ui @latest init` to bootstrap configuration.
    -   Adds `components.json`, `src/lib/utils.ts`, and path aliases for components (` @/components`) and utils.
    -   Provides pre‑built Tailwind + Radix UI components (e.g., buttons, cards, modals) that are copy‑paste into source and completely customizable.
    -   Components live as source in ARC → they are not external black boxes.

---

## II. Why This Stack?

-   **Lightweight** → avoids heavy frameworks; builds only what ARC needs.
-   **Composable** → Radix primitives = maximum flexibility, no lock‑in.
-   **Customizable** → shadcn components + Tailwind = complete design ownership.
-   **Future‑proof** → easy to carry over to Tauri/Rust rewrite without vendor lock‑in.
-   **Brand fit** → perfectly suited for ARC’s holographic, blueprint‑themed UI.

---

## III. Future Extensions

*   **Skins/Theming Modules**
    -   Blueprint “skins,” factions, or visual overlays for gamification.
    -   Simple CSS variable override approach.

*   **Blueprint Dock**
    -   Core visualization layer for crew agents.
    -   Agents rendered as composable Radix/shadcn cards with holographic styling.

*   **Gamified Interactions**
    -   Real‑time Odometer and Faction System widgets built directly with Radix primitives.
    -   Ensures smooth animations while keeping accessibility intact.

---

**Note**:
This `UI_Blueprint.md` is the *living design guide*.
For formal reasoning about choices (e.g., why Tailwind over CSS‑in‑JS, why Radix over MUI), see `UI_ARCHITECTURAL_DECISIONS.md`.