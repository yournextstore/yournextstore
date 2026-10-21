"use client";

import { Loader2, X } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	const checkoutLink = (
		// Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a different
		// Next.js zone. While a cart write is in flight, block the link: a full navigation now
		// would load /checkout before the item is committed server-side and show an empty cart.
		<a
			href={checkoutUrl}
			aria-disabled={isMutating}
			tabIndex={isMutating ? -1 : undefined}
			onClick={(e) => {
				if (isMutating) {
					e.preventDefault();
				}
			}}
			className={cn(
				"btn-taupe gap-2 text-xl max-md:text-base",
				isMutating && "pointer-events-none opacity-60",
			)}
		>
			{isMutating ? (
				<>
					<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
					Updating…
				</>
			) : (
				"Checkout"
			)}
		</a>
	);

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent hideClose className="flex w-full flex-col gap-0 p-0 shadow-lg sm:max-w-lg">
				<SheetHeader className="flex-row items-center justify-between border-b border-border px-5 py-5">
					<SheetTitle className="text-3xl font-normal tracking-tight">
						Shopping Cart
						{itemCount > 0 && <span className="sr-only">, {itemCount} items</span>}
					</SheetTitle>
					<SheetClose className="flex h-10 w-10 items-center justify-center" aria-label="Close cart">
						<X className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
					</SheetClose>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-12 text-center">
						<p className="text-xl">Your cart is empty</p>
						<button type="button" onClick={closeCart} className="btn-white max-w-xs">
							Continue Shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-5">
							<ul className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</ul>
						</ScrollArea>

						<SheetFooter className="mt-auto gap-0 p-0">
							<section aria-labelledby="summary-heading" className="bg-summary px-5 py-6">
								<h2 id="summary-heading" className="text-lg">
									Order summary
								</h2>
								<div className="mt-4">
									<DiscountCodeField />
								</div>
								<dl className="mt-4 space-y-3 text-sm">
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Subtotal</dt>
										<dd>{formatMoney({ amount: subtotal, currency, locale })}</dd>
									</div>
									{discount ? (
										<div className="flex items-center justify-between border-t border-border pt-3 text-green-800">
											<dt>Discount</dt>
											<dd className="tabular-nums">−{formatMoney({ amount: discount, currency, locale })}</dd>
										</div>
									) : null}
									<div className="flex items-center justify-between border-t border-border pt-3">
										<dt className="text-muted-foreground">Shipping</dt>
										<dd className="text-muted-foreground">At checkout</dd>
									</div>
									<div className="flex items-center justify-between border-t border-border pt-3 text-base">
										<dt>Order total</dt>
										<dd>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</dd>
									</div>
								</dl>
								{/* Tax is already inside the shown subtotal on an inclusive store. */}
								<p className="mt-2 text-xs text-muted-foreground">
									{taxBehavior === "inclusive" ? "Taxes included." : "Taxes calculated at checkout."}
								</p>
								<div className="mt-5">{checkoutLink}</div>
								<button
									type="button"
									onClick={closeCart}
									className="mt-3 w-full text-sm underline-offset-4 hover:underline"
								>
									Continue Shopping
								</button>
							</section>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
