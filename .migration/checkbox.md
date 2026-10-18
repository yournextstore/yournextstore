# checkbox

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated 1:1.

## Changed

- `components/ui/checkbox.tsx`: `@base-ui/react/checkbox` Root/Indicator, typed `CheckboxPrimitive.Root.Props`. `data-[state=checked]:` → `data-checked:`; `disabled:cursor-not-allowed disabled:opacity-50` → `data-disabled:*` because the root now renders a `<span>` plus a hidden `<input>` (pseudo-class `:disabled` never matches a span).

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

- `components/sections/product-filters.tsx`, `components/newsletter-consent.tsx`: `onCheckedChange={(v) => …(v === true)}` still type-checks (value is now always boolean) and nobody uses `checked="indeterminate"`.

## Behavior changes

- `id` now lands on the hidden `<input>`, not the visible box. `<label htmlFor>` still toggles it (verified on the product filters).

## Verify by hand

- Product filters: clicking a colour checkbox or its label toggles it and updates the URL.
- Keyboard: Tab to a checkbox, Space toggles it, focus ring visible.
- Newsletter consent in a disabled state looks dimmed.
