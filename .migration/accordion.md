# accordion

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated; call sites updated.

## Changed

- `components/ui/accordion.tsx`: Content → `Panel`; chevron rotation `[&[data-state=open]>svg]` → `[&[data-panel-open]>svg]`; trigger `disabled:*` → `aria-disabled:*`.
- Animation: the old `animate-accordion-up/down` keyframes read `--radix-accordion-content-height`, which Base UI never sets. The Panel now uses `h-(--accordion-panel-height) transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0`. This deliberately differs from the skill's wrapper-shapes note (put these on the inner div): `data-starting-style`/`data-ending-style` are set on the Panel element, so on the inner div they would never match.
- `app/faq/page.tsx:68`: `type="single" collapsible` removed (Base UI single mode is always collapsible).
- `components/sections/product-filters.tsx:163`: `type="multiple"` → `multiple`; `defaultValue` was already an array.

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

None.

## Behavior changes

- Base UI dropped arrow-key roving focus between accordion triggers (APG update); Tab moves between them instead. Not patched.

## Verify by hand

- FAQ: opening one item closes the other; clicking an open item collapses it; height animates both ways.
- Product filters: several sections open at once; first section open by default.
- Keyboard: Tab to a trigger, Enter/Space toggles.
