# popover

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated; PopoverAnchor flagged; call site restructured.

## Changed

- `components/ui/popover.tsx`: Content → `Portal > Positioner > Popup` (Positioner `isolate z-50`). `align`, `alignOffset`, `side`, `sideOffset`, plus `collisionPadding` and `anchor` (needed by the search consumer) are declared, destructured and forwarded to the Positioner. Classes renamed: `data-open/closed`, `origin-(--transform-origin)`.
- `PopoverAnchor`: Base UI has no Anchor part. Kept as an inert `<div data-slot="popover-anchor">` with a comment, per the skill's rule. It positions nothing; use `anchor` on `PopoverContent`.
- `components/search/search-input.tsx`: icon popover `onOpenAutoFocus={e => { e.preventDefault(); ref.focus() }}` → `initialFocus={iconInputRef}`; inline popover `PopoverAnchor asChild` → `ref` on the wrapper div + `anchor={inlineAnchorRef}`, `onOpenAutoFocus` preventDefault → `initialFocus={false}`, and the `onPointerDownOutside` close was dropped because `onOpenChange` already receives the outside press.

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

- `components/search/mobile-search-input.tsx`, `search-page-input.tsx`: do not use the popover.

## Behavior changes

- Base UI's default `collisionPadding` is 5 (Radix 0); the search consumers pass 16, so nothing changed for them.

## Verify by hand

- xl: type in the header search; results appear under the input aligned to its right edge, focus stays in the input, Escape and outside click close (verified).
- lg: the search icon opens the popover with the input focused; Escape returns focus to the icon (verified).
