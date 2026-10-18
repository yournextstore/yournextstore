# label

2026-10-18 (second pass). Strategy: golden pair via CLI. components.json moved from the legacy `new-york` style to `base-maia`, and the wrapper was reinstalled with `shadcn add <component> --overwrite` (shadcn 4.22.0). The CLI leaves the registry's bare `import { cn } from "cn"` and installs an unrelated `cn` npm package to satisfy it, so after each add the import was rewritten to `@/lib/utils` and the package removed. The stock base styles also need `@import "shadcn/tailwind.css"` (custom variants such as `data-horizontal`, plus accordion keyframes), now in `app/globals.css` with `shadcn` as a dev dependency. Verdict: stock base-maia file, no local diff.

## Changed

- `components/ui/label.tsx`: registry native `<label>` with `"use client"`; the first pass's extra `peer-data-disabled:*` classes are gone.

Leftover scan: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder\|from \"cn\""` on this file is clean.

## Left alone

None.

## Behavior changes

- A label beside a disabled Base UI checkbox no longer dims through `peer-*` (the checkbox is a `<span>`, so `peer-disabled` never matches). Not used that way today.

## Verify by hand

- Restock dialog: clicking "Email" focuses the input.
