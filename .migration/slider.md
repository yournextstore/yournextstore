# slider

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated; call site updated.

## Changed

- `components/ui/slider.tsx`: anatomy `Root > Control > Track > Indicator` + Thumbs (Range → Indicator, new Control); the user's layout classes moved Root → Control; `thumbAlignment="edge"` keeps thumbs inside the track; thumbs get `index` (needed for SSR of range sliders); thumb `disabled:*` → `data-[disabled]:*` (the thumb is a div with a nested input). The wrapper is now generic over the value shape (`SliderPrimitive.Root.Props<Value>`), and the manual `useMemo` was dropped (React Compiler).
- `components/sections/product-filters.tsx`: `minStepsBetweenThumbs` → `minStepsBetweenValues`; `onValueCommit` → `onValueCommitted`; the `value as [number, number]` cast is gone (`onValueChange={setPriceRange}`) because the generic infers the tuple.

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

None.

## Behavior changes

- `onValueCommitted` does not fire when the value did not change (Radix's commit always fired). Harmless here.

## Verify by hand

- Price filter: drag either thumb, release → URL gets `priceMin`/`priceMax`; thumbs cannot cross.
- Keyboard: arrows step by 1, PageUp/PageDown by 10, each step commits.
