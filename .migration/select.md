# select

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated; call site updated.

## Changed

- `components/ui/select.tsx`: `Select` is a bare re-export of the generic `SelectPrimitive.Root`. Content → `Portal > Positioner > Popup` (`isolate z-50` on the Popup); `position="popper"` → `alignItemWithTrigger`, which defaults to **false** here to keep the old popper default (the base registry defaults to true). Viewport → `List`; ScrollUp/DownButton → `ScrollUp/DownArrow` (+ `top-0`/`bottom-0 w-full z-10 bg-popover`); Label → `GroupLabel`; Icon `asChild` → `render`. Item anatomy: `ItemText` first (now a `<div>`, so it gets `flex items-center gap-2` explicitly instead of the old `*:[span]:last:*` selector), then `ItemIndicator render={<span className="absolute right-2 …" />}`.
- The popper-mode `h-[var(--radix-select-trigger-height)]` on the viewport was dropped instead of renamed: under Radix it was overridden by the viewport's `flex: 1`; on a Base UI List it would clip the list to the trigger's height. `min-w` maps to `--anchor-width`.
- `app/products/products-sort-select.tsx`: passes `items={options}` so the trigger shows "Newest" rather than the raw value (Base UI's `Value` does not read item text); the handler accepts the `string | null` Base UI emits and ignores `null`.

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

None.

## Behavior changes

- After closing, Base UI keeps the popup mounted but hidden (`hidden`, opacity 0). Not visible.

## Verify by hand

- Mobile products page: the sort trigger shows the current label; the list opens under the trigger with a check on the current option; picking one updates the URL and the label (verified).
- Keyboard: Enter opens, arrows and typeahead move, Enter selects, Escape closes.
