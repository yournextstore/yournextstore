# button

2026-10-18 (second pass). Strategy: golden pair via CLI. components.json moved from the legacy `new-york` style to `base-maia`, and the wrapper was reinstalled with `shadcn add <component> --overwrite` (shadcn 4.22.0). The CLI leaves the registry's bare `import { cn } from "cn"` and installs an unrelated `cn` npm package to satisfy it, so after each add the import was rewritten to `@/lib/utils` and the package removed. The stock base styles also need `@import "shadcn/tailwind.css"` (custom variants such as `data-horizontal`, plus accordion keyframes), now in `app/globals.css` with `shadcn` as a dev dependency. Verdict: stock base-maia file, no local diff.

## Changed

- `components/ui/button.tsx`: registry file: `rounded-4xl` pill, `h-9 px-3` default size, softer `outline`/`ghost`, a tinted `destructive`, new `xs`/`icon-xs` sizes, explicit `variant`/`size` defaults.
- No call-site changes. The cart checkout link and the order-success link already use `buttonVariants()` directly, from the first pass.

Leftover scan: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder\|from \"cn\""` on this file is clean.

## Left alone

- `components/ui/pagination.tsx` uses `Button` with `render`; see its report in `project.md`.

## Behavior changes

- Native buttons default to `type="button"` (unchanged from the first pass; every submit button declares `type="submit"`).
- Visual: pill shape and new padding everywhere `Button` is used.

## Verify by hand

- Product page, cart, newsletter dialog, cookie banner: buttons read as pills, focus ring visible on Tab.
- Forms still submit on their submit buttons.
