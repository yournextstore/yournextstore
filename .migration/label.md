# label

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: replaced with a native `<label>` (Base UI has no Label primitive).

## Changed

- `components/ui/label.tsx`: renders `<label data-slot="label">` typed `React.ComponentProps<"label">`; `"use client"` dropped. Added `peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50` next to the existing `peer-disabled:*`, because a Base UI checkbox peer is a `<span data-disabled>`, not a `:disabled` control.

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

- `components/newsletter-consent.tsx`, `app/product/[slug]/restock-notify.tsx`: consumers, unchanged.

## Behavior changes

None (Radix Label only added double-click text-selection prevention, already covered by `select-none`).

## Verify by hand

- Restock dialog: clicking "Email" focuses the input.
- Newsletter consent: clicking the sentence toggles the checkbox.
