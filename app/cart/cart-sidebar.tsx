"use client";

import { ArrowRight, Loader2, ShoppingBasket } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
				<SheetHeader className="px-4 pt-6 pb-4 sm:px-6">
					<SheetTitle className="font-display text-display-sm text-black">Your cart</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12">
						<ShoppingBasket className="size-16 text-black/25" strokeWidth={1} aria-hidden />
						<p className="text-muted-foreground">Your shopping cart is empty.</p>
						<button
							type="button"
							onClick={closeCart}
							className="h-11 rounded-full bg-black px-8 text-sm font-medium text-white transition-colors hover:bg-black/80"
						>
							Shop
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-4 sm:px-6">
							<ul className="flex flex-col divide-y divide-black/10 rounded-[20px] border border-black/10 px-3.5 md:px-6">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</ul>
						</ScrollArea>

						<div className="p-4 sm:p-6">
							<div className="flex flex-col gap-4 rounded-[20px] border border-black/10 p-5 md:px-6">
								<h2 className="text-xl font-bold">Order Summary</h2>
								<dl className="flex flex-col gap-3 text-base">
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Subtotal</dt>
										<dd className="font-bold">{formatMoney({ amount: subtotal, currency, locale })}</dd>
									</div>
									{discount ? (
										<div className="flex items-center justify-between">
											<dt className="text-muted-foreground">Discount</dt>
											<dd className="font-bold text-sale">
												−{formatMoney({ amount: discount, currency, locale })}
											</dd>
										</div>
									) : null}
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Delivery Fee</dt>
										<dd className="text-sm font-medium">At checkout</dd>
									</div>
									<div className="flex items-center justify-between border-t border-black/10 pt-3">
										<dt>Total</dt>
										<dd className="text-xl font-bold">
											{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
										</dd>
									</div>
								</dl>
								<DiscountCodeField />
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
									className={cn(
										"group flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-medium text-white transition-colors hover:bg-black/80 md:h-[60px] md:text-base",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="size-4 animate-spin" />
											Updating…
										</>
									) : (
										<>
											Go to Checkout
											<ArrowRight
												className="size-5 transition-transform group-hover:translate-x-1"
												aria-hidden
											/>
										</>
									)}
								</a>
								<p className="text-center text-xs text-muted-foreground">
									{taxBehavior === "inclusive"
										? "Prices include tax. Shipping is calculated at checkout."
										: "Shipping and taxes are calculated at checkout."}
								</p>
							</div>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
