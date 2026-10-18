# slider

2026-10-18 (second pass). Strategy: golden pair via CLI. components.json moved from the legacy `new-york` style to `base-maia`, and the wrapper was reinstalled with `shadcn add <component> --overwrite` (shadcn 4.22.0). The CLI leaves the registry's bare `import { cn } from "cn"` and installs an unrelated `cn` npm package to satisfy it, so after each add the import was rewritten to `@/lib/utils` and the package removed. The stock base styles also need `@import "shadcn/tailwind.css"` (custom variants such as `data-horizontal`, plus accordion keyframes), now in `app/globals.css` with `shadcn` as a dev dependency. Verdict: stock base-maia file; call site adjusted.

## Changed

- `components/ui/slider.tsx`: registry file (track `h-3`, pill thumbs, `thumbAlignment="edge"`). It is not generic over the value shape like the first-pass wrapper was.
- `components/sections/product-filters.tsx`: `onValueChange`/`onValueCommitted` cast the value back to `[number, number]`.

Leftover scan: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder\|from \"cn\""` on this file is clean.

## Left alone

None.

## Behavior changes

- Thumbs no longer get an explicit `index` (stock omits it).

## Verify by hand

- Price filter: drag or arrow-key a thumb, release, URL gets `priceMin`/`priceMax`.
