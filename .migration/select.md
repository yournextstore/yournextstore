# select

2026-10-18 (second pass). Strategy: golden pair via CLI. components.json moved from the legacy `new-york` style to `base-maia`, and the wrapper was reinstalled with `shadcn add <component> --overwrite` (shadcn 4.22.0). The CLI leaves the registry's bare `import { cn } from "cn"` and installs an unrelated `cn` npm package to satisfy it, so after each add the import was rewritten to `@/lib/utils` and the package removed. The stock base styles also need `@import "shadcn/tailwind.css"` (custom variants such as `data-horizontal`, plus accordion keyframes), now in `app/globals.css` with `shadcn` as a dev dependency. Verdict: stock base-maia file, no local diff.

## Changed

- `components/ui/select.tsx`: registry file. `alignItemWithTrigger` defaults to `true`, so the list opens over the trigger with the selected item aligned to it.

Leftover scan: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder\|from \"cn\""` on this file is clean.

## Left alone

- `app/products/products-sort-select.tsx`: keeps `items={options}` and the null-ignoring handler from the first pass.

## Behavior changes

- The sort list now overlays its trigger instead of dropping below it.

## Verify by hand

- Mobile products page: the trigger shows the current label; picking an option updates the URL and the label (verified).
