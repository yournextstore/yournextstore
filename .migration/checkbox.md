# checkbox

2026-10-18 (second pass). Strategy: golden pair via CLI. components.json moved from the legacy `new-york` style to `base-maia`, and the wrapper was reinstalled with `shadcn add <component> --overwrite` (shadcn 4.22.0). The CLI leaves the registry's bare `import { cn } from "cn"` and installs an unrelated `cn` npm package to satisfy it, so after each add the import was rewritten to `@/lib/utils` and the package removed. The stock base styles also need `@import "shadcn/tailwind.css"` (custom variants such as `data-horizontal`, plus accordion keyframes), now in `app/globals.css` with `shadcn` as a dev dependency. Verdict: stock base-maia file, no local diff.

## Changed

- `components/ui/checkbox.tsx`: registry file: 6px radius, enlarged hit area (`after:-inset-x-3 after:-inset-y-2`), field-group hooks.

Leftover scan: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder\|from \"cn\""` on this file is clean.

## Left alone

None.

## Behavior changes

- The stock file styles disabled state with `disabled:*`, which never matches the Base UI `<span>` root (an upstream registry quirk), so a disabled checkbox is not dimmed. No consumer disables one except the newsletter consent while submitting.

## Verify by hand

- Product filters: checkbox and label toggle, URL updates (verified).
