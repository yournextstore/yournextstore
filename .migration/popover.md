# popover

2026-10-18 (second pass). Strategy: golden pair via CLI. components.json moved from the legacy `new-york` style to `base-maia`, and the wrapper was reinstalled with `shadcn add <component> --overwrite` (shadcn 4.22.0). The CLI leaves the registry's bare `import { cn } from "cn"` and installs an unrelated `cn` npm package to satisfy it, so after each add the import was rewritten to `@/lib/utils` and the package removed. The stock base styles also need `@import "shadcn/tailwind.css"` (custom variants such as `data-horizontal`, plus accordion keyframes), now in `app/globals.css` with `shadcn` as a dev dependency. Verdict: stock base-maia file plus one forwarded prop.

## Changed

- `components/ui/popover.tsx`: registry file with one local deviation: `PopoverContent` also picks and forwards `anchor` to the Positioner. The inline header search has no trigger and must position against its input. Re-running `shadcn add popover --overwrite` would drop this and break the xl search.
- `PopoverAnchor` no longer exists (stock has none).
- `components/search/search-input.tsx`: drops `collisionPadding={16}`, so Base UI's default of 5 applies; neither popover reaches the viewport edge at the widths where it shows.

Leftover scan: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder\|from \"cn\""` on this file is clean.

## Left alone

None.

## Behavior changes

None observed.

## Verify by hand

- xl: type in the header search; results sit under the input, aligned to its right edge, focus stays in the input (verified).
- lg: the icon opens the popover with the input focused.
