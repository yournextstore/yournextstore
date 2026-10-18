# dialog

2026-10-18 (second pass). Strategy: golden pair via CLI. components.json moved from the legacy `new-york` style to `base-maia`, and the wrapper was reinstalled with `shadcn add <component> --overwrite` (shadcn 4.22.0). The CLI leaves the registry's bare `import { cn } from "cn"` and installs an unrelated `cn` npm package to satisfy it, so after each add the import was rewritten to `@/lib/utils` and the package removed. The stock base styles also need `@import "shadcn/tailwind.css"` (custom variants such as `data-horizontal`, plus accordion keyframes), now in `app/globals.css` with `shadcn` as a dev dependency. Verdict: stock base-maia file, no local diff.

## Changed

- `components/ui/dialog.tsx`: registry file: `rounded-4xl` popup with a soft ring, `bg-black/80` backdrop with blur, icon `Button` close control, `DialogFooter` with an optional close button.

Leftover scan: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder\|from \"cn\""` on this file is clean.

## Left alone

- `app/product/[slug]/restock-notify.tsx`, `components/newsletter-dialog.tsx`: compatible as they are.

## Behavior changes

None beyond styling.

## Verify by hand

- Restock dialog on an out-of-stock product: open, Escape, backdrop click, focus return. Not exercised: no out-of-stock product in the QA data.
- Newsletter popup open/dismiss.
