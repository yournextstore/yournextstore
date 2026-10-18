# dialog

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated; call site updated.

## Changed

- `components/ui/dialog.tsx`: Overlay → `Backdrop`, Content → `Popup` (centered, no Positioner), types → `DialogPrimitive.*.Props`. The tw-animate enter/exit keyframes stay, keyed on `data-open:`/`data-closed:`; Base UI keeps the popup mounted until the exit animation finishes (this is also what the base registry does).
- `app/product/[slug]/restock-notify.tsx`: `<DialogTrigger asChild><Button …>` → `<DialogTrigger render={<Button …/>}>…</DialogTrigger>` (redundant `type="button"` dropped; the trigger sets it).

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

- `components/newsletter-dialog.tsx`: `open` + `onOpenChange={(open) => !open && handleClose()}` is compatible with the new `(open, eventDetails)` signature.

## Behavior changes

None observed. The close button's `data-[state=open]:*` classes were renamed to `data-open:*`; they were inert under Radix too.

## Verify by hand

- Restock dialog (out-of-stock product): opens with fade/zoom, focus moves inside, Escape and backdrop click close it, focus returns to the trigger. Not exercised in the browser run: no out-of-stock product was available.
- Newsletter popup: opens on its schedule and dismisses.
