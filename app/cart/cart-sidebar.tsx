"use client";

import { Loader2, X } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { BagIcon } from "@/app/cart-button";
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
			<SheetContent
				showCloseButton={false}
				className="flex flex-col gap-0 p-0 data-[side=right]:w-full data-[side=right]:border-0 data-[side=right]:sm:max-w-[23.5rem]"
			>
				<SheetHeader className="grid h-[4.5rem] shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-0 border-b border-border px-4 py-0">
					<button
						type="button"
						onClick={closeCart}
						aria-label="Close cart"
						className="-ml-2 flex size-10 items-center justify-center"
					>
						<X className="size-6" strokeWidth={1.5} aria-hidden />
					</button>
					<SheetTitle className="text-lg font-bold">My Cart</SheetTitle>
					<span className="flex items-center justify-end gap-0.5" aria-hidden>
						<BagIcon className="size-[1.375rem]" />
						<span className="text-xs font-medium tabular-nums">({itemCount})</span>
					</span>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-12 text-center">
						<p className="text-lg font-bold">Your cart is empty</p>
						<button type="button" onClick={closeCart} className="bp-btn bp-btn-inverse-dark">
							Continue shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<ul className="flex flex-col">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</ul>
						</ScrollArea>

						<div className="shrink-0 border-t border-border">
							<div className="border-b border-border p-4">
								<DiscountCodeField />
							</div>
							<div className="flex flex-col gap-4 p-4">
								<div>
									{discount ? (
										<div className="mb-2 flex flex-col gap-1 text-sm">
											<div className="flex items-center justify-between">
												<span>Subtotal</span>
												<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
											</div>
											<div className="flex items-center justify-between gap-3 text-brand">
												<span>Discount</span>
												<span className="tabular-nums">
													−{formatMoney({ amount: discount, currency, locale })}
												</span>
											</div>
										</div>
									) : null}
									<div className="flex items-center justify-between text-base font-bold">
										<span>Total</span>
										<span>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</span>
									</div>
									{/* Tax is already inside the shown subtotal on an inclusive store — promising to
									    "calculate taxes at checkout" there would read as an extra charge to come. */}
									<p className="mt-1 text-xs">
										{taxBehavior === "inclusive"
											? "Shipping calculated at checkout"
											: "Shipping & taxes calculated at checkout"}
									</p>
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
									className={cn("bp-btn w-full", isMutating && "pointer-events-none opacity-70")}
								>
									{isMutating ? (
										<>
											<Loader2 className="size-4 animate-spin" aria-hidden />
											Updating…
										</>
									) : (
										"Checkout"
									)}
								</a>
							</div>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
