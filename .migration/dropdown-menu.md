# dropdown-menu

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated to Base UI `Menu`; call site updated.

## Changed

- `components/ui/dropdown-menu.tsx`: Content → `Portal > Positioner > Popup` (Positioner `isolate z-50 outline-none`, Popup keeps `z-50` and gains `outline-none`); align/alignOffset/side/sideOffset forwarded, `align` keeps Radix's `"center"` default (the base registry uses `"start"`). Label → `GroupLabel`; ItemIndicator → `CheckboxItemIndicator` / `RadioItemIndicator`; Sub/SubTrigger → `SubmenuRoot`/`SubmenuTrigger` with `data-popup-open:*` open styling; SubContent composes `DropdownMenuContent` with `align="start" alignOffset={-3} side="right" sideOffset={0}`. Vars → `--available-height`, `--transform-origin`.
- `components/theme-toggle.tsx`: `<DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Change theme" />}>`.

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

None.

## Behavior changes

- `CheckboxItem`/`RadioItem` no longer close the menu on click (`closeOnClick` defaults to false). No consumer uses them today.
- `DropdownMenuLabel` (GroupLabel) must sit inside a `DropdownMenuGroup` in Base UI. No consumer uses it today.

## Verify by hand

- Theme toggle: opens aligned to the button's right edge, 4 px below; arrow keys move between items; picking "Dark" applies it, closes the menu, focus returns to the button (verified).
