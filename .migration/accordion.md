# accordion

2026-10-18 (second pass). Strategy: golden pair via CLI. components.json moved from the legacy `new-york` style to `base-maia`, and the wrapper was reinstalled with `shadcn add <component> --overwrite` (shadcn 4.22.0). The CLI leaves the registry's bare `import { cn } from "cn"` and installs an unrelated `cn` npm package to satisfy it, so after each add the import was rewritten to `@/lib/utils` and the package removed. The stock base styles also need `@import "shadcn/tailwind.css"` (custom variants such as `data-horizontal`, plus accordion keyframes), now in `app/globals.css` with `shadcn` as a dev dependency. Verdict: stock base-maia file; FAQ call site adjusted.

## Changed

- `components/ui/accordion.tsx`: registry file: bordered `rounded-2xl` box, padded triggers, `bg-muted/50` on open items, chevron up/down icon swap, `animate-accordion-down/up` keyframes from `shadcn/tailwind.css` (they read `--accordion-panel-height`).
- `app/faq/page.tsx`: drops its own `rounded-lg border border-border px-4`; the stock box already provides border, radius and padding.

Leftover scan: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder\|from \"cn\""` on this file is clean.

## Left alone

- `components/sections/product-filters.tsx`: keeps `className="w-full"`; the filter groups now sit in the Maia box.

## Behavior changes

- Filters sidebar and FAQ now render as bordered, rounded boxes with tinted open items.

## Verify by hand

- FAQ: one item open at a time, clicking an open item collapses it, height animates (verified).
- Filters: several groups open at once.
