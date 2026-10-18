# sheet

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated (Base UI Dialog); call sites updated.

## Changed

- `components/ui/sheet.tsx`: same mapping as dialog (`Backdrop`, `Popup`). The per-side slide keyframes (500 ms in, 300 ms out) are kept on `data-open:`/`data-closed:`, so the look is unchanged (the base registry switched to 2.5rem transitions instead).
- `app/navbar.tsx`, `app/search/search-controls.tsx`: `<SheetTrigger asChild><button …>` → the trigger's own `<button>` carries the props/classes.
- `components/sections/product-filters.tsx`: `<SheetTrigger render={<Button variant="outline" size="sm" className="lg:hidden" />}>`.

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

- `app/cart/cart-sidebar.tsx`: controlled `open`/`onOpenChange`, compatible as is.

## Behavior changes

- `aria-modal` is no longer set on the popup; Base UI isolates the rest of the page itself. Not patched.

## Verify by hand

- Cart: opens from the right with backdrop and scroll lock; Escape plays the slide-out, then focus returns to the cart button (verified).
- Mobile menu and filters sheets slide from the left (verified); search "Refine" sheet slides from the bottom.
