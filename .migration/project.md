# project

2026-10-18. Whole-project Radix → Base UI migration, transformation engine (legacy `new-york` style). Verdict: all 14 Radix-backed wrappers migrated, Radix removed, check and build green against the baseline.

## Changed

- Dependencies: `@base-ui/react@1.9.0` added; removed `@radix-ui/react-accordion`, `-checkbox`, `-dialog`, `-dropdown-menu`, `-label`, `-popover`, `-scroll-area`, `-select`, `-slider`, `-slot`, `-tooltip`. `bun.lock` carries no `radix` entry.
- Wrappers, leaves first: button, badge, breadcrumb, label, checkbox, scroll-area, accordion, slider, dialog, sheet, popover, tooltip, dropdown-menu, select. One commit each, consumers fixed in the same commit; see the per-component reports.
- App-code sweep (`asChild`, `type`/`collapsible`, `delayDuration`, `onValueCommit`, `minStepsBetweenThumbs`, `onOpenAutoFocus`, `onPointerDownOutside`, `PopoverAnchor`, `onValueChange` typing, `data-[state`, `--radix-*`): no matches left outside the reports.
- Verification vs baseline: `tsc --noEmit` clean (baseline clean); `bun test` 114/114 (baseline 114/114); `bun run build` passes with `check-shell` 12 ok / 3 skipped, the same documents as baseline (header offsets +140–280 bytes, the FAQ shell ~8 KB smaller); Lighthouse on `/products` (mobile): accessibility 98, performance 88. Browser QA on `bun start`: dropdown, accordion (single + multiple), slider (keyboard commit), checkbox + label, both search popovers, tooltip, cart/menu/filters sheets, sort select; no console errors.

## Left alone

- `components/ui/sonner.tsx` (sonner), `input.tsx`, `skeleton.tsx`, `pagination.tsx`: not Radix.
- `components.json` still says `"style": "new-york"`. FLAG: that style has no base variant, so `shadcn add` will keep delivering Radix-based components. Either switch to a `base-*` style (which restyles new additions) or add components by hand from Base UI.
- `skills-lock.json` (uncommitted, pre-existing): the only `biome check` error, before and after.

## Behavior changes

Collected from the component reports, none patched:
- Button defaults native buttons to `type="button"` (all submit buttons already declare `type="submit"`).
- Scroll-area scrollbar visible whenever content overflows (no hover-only mode).
- Accordion triggers no longer move with arrow keys (Tab instead).
- Menu checkbox/radio items would not close on click (no consumers).
- Sheet/dialog popup no longer carries `aria-modal`.
- `breadcrumb.tsx` and `badge.tsx` are client modules now (`useRender` needs `useRef`).

## Verify by hand

- Restock dialog on an out-of-stock product (not reachable in the QA store data).
- Newsletter popup open/dismiss.
- Touch device: sheets, select, slider dragging.
- `bun run audit https://<store>/` after publishing.
