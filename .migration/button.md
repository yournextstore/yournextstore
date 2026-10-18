# button

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated to the real `@base-ui/react/button` primitive.

## Changed

- `components/ui/button.tsx`: `Slot`/`asChild` replaced by `ButtonPrimitive` (`render` supported natively); props typed `ButtonPrimitive.Props & VariantProps<typeof buttonVariants>`. No `"use client"` needed: the primitive module carries its own, so `Button` and `buttonVariants` still work from Server Components.
- `app/cart/cart-sidebar.tsx`: the checkout link was `<Button asChild><a></Button>`; it is now a plain `<a className={cn(buttonVariants(), ...)}>`. A Base UI button with `nativeButton={false}` adds `role="button"` to the `<a>`, which would announce a link as a button. Still a plain `<a>` into the proxied `/checkout` zone.
- `app/order/success/[id]/page.tsx`: same treatment for the "Continue Shopping" `<Link>` (`className={buttonVariants()}`), matching `components/ui/pagination.tsx`.
- `package.json` / `bun.lock`: `@base-ui/react@1.9.0` added.

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

- `components/ui/pagination.tsx`: already styles `<Link>` with `buttonVariants`; only imports `Button` for a type.

## Behavior changes

- Base UI renders native buttons with `type="button"` by default (Radix left the native `submit` default). Every submit button in the app already declares `type="submit"` (newsletter dialog, forms), so nothing changed in practice; a future untyped `<Button>` inside a `<form>` will no longer submit it.

## Verify by hand

- Click checkout in the cart sheet: full document load to `/checkout`, disabled look while a cart write is in flight.
- Order success page: "Continue Shopping" looks like a primary button and soft-navigates home.
- Newsletter and restock forms still submit on Enter and on the submit button.
