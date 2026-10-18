# project

2026-10-18 (second pass). Moved the whole ui layer onto the stock shadcn `base-maia` registry. Verdict: 16 of 18 `components/ui` files are unmodified registry output (apart from the `cn` import fix-up); the other two carry one documented change each. Check and build are green.

## Changed

- `components.json`: `"style": "new-york"` → `"base-maia"`. `shadcn add` now delivers Base UI components.
- `app/globals.css`: `@import "shadcn/tailwind.css"`; `shadcn@4.22.0` is a dev dependency, as the base-maia style item specifies.
- All 18 `components/ui` files reinstalled with `shadcn add <c> --overwrite`, including the non-Radix input (now on Base UI's `Input` primitive), skeleton, sonner and pagination.
- Local deviations from the registry (lost on the next `--overwrite`):
  - `popover.tsx`: `PopoverContent` forwards `anchor` (the inline header search positions against its input).
  - `pagination.tsx`: `PaginationLink` renders `next/link` instead of `<a>` (soft navigation), replayed from the previous customization.
- CLI quirk: shadcn 4.22.0 leaves `import { cn } from "cn"` and installs the unrelated `cn` npm package. Each file's import was rewritten to `@/lib/utils` and the package removed.
- Call sites: FAQ accordion classes, price-slider tuple casts, `collisionPadding` dropped from the search popovers, cart/filters sheet widths scoped to `data-[side=…]`.
- Verification: `tsc` clean; `bun test` 114/114; `bun run build` passes with `check-shell` 12 ok / 3 skipped (same as before); Lighthouse `/products` mobile: accessibility 98, performance 90. Browser QA on `bun start` (dropdown, accordions, slider, checkbox, search popover, tooltip, all sheets, sort select, pagination soft navigation) showed no console errors.

## Left alone

- `skills-lock.json` (uncommitted, pre-existing biome error).
- `theme-*` branches: every ui file changed, so the next theme rebase will see conflicts in `components/ui`.

## Behavior changes

- Visual: Maia look throughout (pill buttons and inputs, rounded-2xl/4xl popups, bordered accordion boxes, softer variants).
- Pagination links carry `role="button"`. The stock base pagination renders `Button nativeButton={false} render={<a/>}`, and Base UI adds `role="button"` to non-native buttons, so screen readers announce page links as buttons. Lighthouse does not flag it.
- Select overlays its trigger (`alignItemWithTrigger`); sheets use a short slide plus fade.
- Stock checkbox does not dim when disabled (`disabled:` on a `<span>`).

## Verify by hand

- Restock dialog on an out-of-stock product; newsletter popup.
- Dark mode pass over the Maia surfaces (popups use `bg-popover`, inputs `bg-input/30`).
- Touch: sheets, select, slider.
- `bun run audit https://<store>/` after publishing.
