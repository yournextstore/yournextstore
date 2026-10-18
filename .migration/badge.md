# badge

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated to `useRender` + `mergeProps`.

## Changed

- `components/ui/badge.tsx`: `Slot`/`asChild` replaced by `useRender({ defaultTagName: "span", render, state: { slot: "badge" } })` (the `state.slot` emits `data-slot="badge"`, as in the base registry). Added `"use client"`: `useRender` calls `useRef` (via `@base-ui/utils/useRefWithInit`), which cannot run in a Server Component.

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

- `app/product/[slug]/bundle-builder.tsx`: the only consumer; already a client component, no `asChild` usage.

## Behavior changes

None.

## Verify by hand

- Bundle product page: "Included" badges render with the secondary style.
