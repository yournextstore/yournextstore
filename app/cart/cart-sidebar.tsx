"use client";

import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
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
			<SheetContent className="flex w-full flex-col gap-0 bg-background sm:max-w-md">
				<SheetHeader className="flex-row items-center border-b border-line px-6 py-5">
					<SheetTitle className="font-serif text-2xl font-normal tracking-tight">
						Your cart
						{itemCount > 0 && <span className="sr-only"> ({itemCount} items)</span>}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="px-6 py-10 text-center">
						<p className="text-sm text-muted-foreground">Your cart is empty.</p>
						<button
							type="button"
							onClick={closeCart}
							className="mt-4 py-1 text-xs uppercase tracking-widest text-faint transition-colors hover:text-foreground"
						>
							Continue shopping
						</button>
					</div>
				) : (
					<div className="flex-1 overflow-y-auto px-6 py-5">
						<ul className="divide-y divide-line">
							{items.map((item) => (
								<CartItem key={item.productVariant.id} item={item} />
							))}
						</ul>

						<div className="mt-6 space-y-4 border-t border-line pt-4">
							<DiscountCodeField />
							{discount ? (
								<div className="space-y-1 text-sm">
									<div className="flex items-center justify-between text-muted-foreground">
										<span>Subtotal</span>
										<span className="tabular-nums">
											{formatMoney({ amount: subtotal, currency, locale })}
										</span>
									</div>
									<div className="flex items-center justify-between gap-3 text-green-800">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								</div>
							) : null}
							<div className="flex items-center justify-between">
								<span className="text-xs uppercase tracking-widest text-muted-foreground">
									{discount ? "Total" : "Subtotal"}
								</span>
								<span className="text-lg tabular-nums">
									{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
								</span>
							</div>
							{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
							    different Next.js zone. While a cart write is in flight, block the link: a full
							    navigation now would load /checkout before the item is committed server-side. */}
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
									"flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground transition hover:bg-primary/85",
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
							{/* Tax is already inside the shown subtotal on an inclusive store. */}
							<p className="text-center text-xs text-faint">
								{taxBehavior === "inclusive"
									? "Shipping calculated at checkout"
									: "Shipping and taxes calculated at checkout"}
							</p>
							<button
								type="button"
								onClick={closeCart}
								className="block w-full py-1 text-center text-xs uppercase tracking-widest text-faint transition-colors hover:text-foreground"
							>
								Continue shopping
							</button>
						</div>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
