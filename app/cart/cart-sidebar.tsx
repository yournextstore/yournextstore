"use client";

import { Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex flex-col gap-0 bg-white data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
				<SheetHeader className="shrink-0 border-b border-slate-line px-5 pb-4 pt-6 sm:px-6">
					<SheetTitle className="text-2xl font-bold text-slate-ink">Shopping Cart</SheetTitle>
					<SheetDescription className="text-sm text-slate-body">
						{itemCount > 0
							? `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`
							: "Review items in your cart and proceed to checkout."}
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
						<span className="flex h-14 w-14 items-center justify-center rounded-md bg-slate-ink text-white">
							<ShoppingBag className="h-6 w-6" aria-hidden />
						</span>
						<div>
							<p className="text-lg font-semibold text-slate-ink">Your cart is empty</p>
							<p className="mt-1 text-sm">Add a few products to get started.</p>
						</div>
						<button type="button" onClick={closeCart} className="btn-ae btn-ae-white">
							Continue Shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-5 sm:px-6">
							<div className="divide-y divide-slate-line">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						{/* The original's Order Summary card: grey panel, ruled rows, dark Checkout over a white button. */}
						<div className="shrink-0 border-t border-slate-line p-4 sm:p-5">
							<div className="rounded-xl border border-slate-line bg-muted p-4 shadow-xs-ae sm:p-5">
								<h3 className="mb-3 text-lg font-semibold">Order Summary</h3>
								<div className="mb-4">
									<DiscountCodeField />
								</div>
								<dl className="space-y-2 border-b border-slate-line pb-3 text-sm">
									<div className="flex items-center justify-between">
										<dt>Subtotal</dt>
										<dd className="font-semibold text-slate-ink">
											{formatMoney({ amount: subtotal, currency, locale })}
										</dd>
									</div>
									{discount ? (
										<div className="flex items-center justify-between gap-3 text-[#0f7a4c]">
											<dt>Discount</dt>
											<dd className="font-semibold tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</dd>
										</div>
									) : null}
									<div className="flex items-center justify-between">
										<dt>Shipping estimate</dt>
										<dd>At checkout</dd>
									</div>
								</dl>
								<div className="flex items-center justify-between py-3">
									<span className="text-lg font-semibold text-slate-ink">Total</span>
									<span className="text-lg font-semibold text-slate-ink">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
								    different Next.js zone (yns.store). A soft RSC nav 500s the cross-zone request.
								    While a cart write is in flight, block the link: a full navigation now would
								    load /checkout before the item is committed server-side and show an empty cart. */}
								<a
									href={checkoutUrl}
									aria-disabled={isMutating}
									tabIndex={isMutating ? -1 : undefined}
									onClick={(e) => {
										if (isMutating) {
											e.preventDefault();
										}
									}}
									className={cn("btn-ae btn-ae-dark btn-ae-lg w-full", isMutating && "pointer-events-none")}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating…
										</>
									) : (
										"Checkout"
									)}
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="btn-ae btn-ae-white btn-ae-lg mt-3 w-full"
								>
									Continue Shopping
								</button>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="mt-3 text-center text-sm">
									{taxBehavior === "inclusive"
										? "Tax included. Shipping calculated at checkout."
										: "Shipping and taxes calculated at checkout."}
								</p>
							</div>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
