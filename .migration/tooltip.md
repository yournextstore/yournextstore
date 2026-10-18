# tooltip

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated; direct radix consumer moved onto the wrappers.

## Changed

- `components/ui/tooltip.tsx`: Content → `Portal > Positioner > Popup` with side/align offsets forwarded; Provider `delayDuration` → `delay` (default 0 kept); `Tooltip` still wraps its own provider as before. `sideOffset` default 0 → 4: Radix silently added the arrow height to the offset, Base UI does not. The arrow gets per-side placement classes (`data-[side=top]:-bottom-2.5` etc.) because Base UI only positions it on the cross axis.
- `components/quick-add-button.tsx`: dropped its direct `@radix-ui/react-tooltip` import (`Provider delayDuration={1000}` + `Root`) for `<Tooltip>` + `<TooltipTrigger delay={1000}>`. A trigger `delay` takes precedence over the provider's (`delay ?? providerDelay` in TooltipTrigger). The wrapping `<button>` became the trigger's own button.

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

None.

## Behavior changes

None observed: the tooltip opens after ~1 s, centered above the button, arrow pointing at it (verified).

## Verify by hand

- Hover a product card's bag icon: "Add to cart" appears after about a second; clicking adds to cart and closes it.
