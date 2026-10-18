# scroll-area

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated (part renames only).

## Changed

- `components/ui/scroll-area.tsx`: `ScrollAreaScrollbar` → `Scrollbar`, `ScrollAreaThumb` → `Thumb`, types → `ScrollAreaPrimitive.*.Props`; unused `React` import removed.

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

- `app/cart/cart-sidebar.tsx`: consumer, no `type`/`scrollHideDelay` props to drop.

## Behavior changes

- Radix defaulted to `type="hover"` (scrollbar only on hover/scroll). Base UI has no such mode; the scrollbar is visible whenever the cart list overflows, as in the shadcn base registry. Not patched.

## Verify by hand

- Fill the cart past the sheet height: the list scrolls, the thumb drags, wheel and touch scrolling work.
