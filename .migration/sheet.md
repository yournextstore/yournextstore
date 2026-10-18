# sheet

2026-10-18 (second pass). Strategy: golden pair via CLI. components.json moved from the legacy `new-york` style to `base-maia`, and the wrapper was reinstalled with `shadcn add <component> --overwrite` (shadcn 4.22.0). The CLI leaves the registry's bare `import { cn } from "cn"` and installs an unrelated `cn` npm package to satisfy it, so after each add the import was rewritten to `@/lib/utils` and the package removed. The stock base styles also need `@import "shadcn/tailwind.css"` (custom variants such as `data-horizontal`, plus accordion keyframes), now in `app/globals.css` with `shadcn` as a dev dependency. Verdict: stock base-maia file; two call sites adjusted.

## Changed

- `components/ui/sheet.tsx`: registry file. Enter/exit is a transition (opacity plus a 2.5rem translate per side), not the full slide keyframes. Widths use `data-[side=…]:w-3/4` and `data-[side=…]:sm:max-w-sm`.
- `app/cart/cart-sidebar.tsx`, `components/sections/product-filters.tsx`: plain `w-*`/`max-w-*` lost to those data-side selectors (the cart shrank from 512px to 384px), so the widths are now scoped as `data-[side=right]:w-full data-[side=right]:sm:max-w-lg` and `data-[side=left]:w-[85vw] data-[side=left]:max-w-sm`.

Leftover scan: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder\|from \"cn\""` on this file is clean.

## Left alone

- `app/navbar.tsx`, `app/search/search-controls.tsx`: no width overrides, stock sizing kept.

## Behavior changes

- Sheets slide in only 2.5rem while fading, instead of sliding from the edge.

## Verify by hand

- Cart: full width on mobile, 512px on desktop (verified). Filters 85vw capped at 384px; mobile menu 75% (verified).
