"use client";

import { ArrowRight, ChevronDown, Loader2, Lock, ShoppingBag, X } from "lucide-react";
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

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex w-full flex-col gap-0 bg-surface p-0 sm:max-w-[30rem] [&>button]:hidden">
				<SheetHeader className="flex-row items-center justify-between border-b border-border px-6 py-5 sm:px-8">
					<SheetTitle className="font-serif text-lg font-medium tracking-[0.18em] uppercase">
						Cart
						{itemCount > 0 && <span className="sr-only"> ({itemCount} items)</span>}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<SheetClose className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary">
						<X className="h-6 w-6" strokeWidth={1.5} />
						<span className="sr-only">Close cart</span>
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-12 text-center">
						<ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1} />
						<p className="font-serif text-2xl">Your cart is empty</p>
						<p className="text-sm text-muted-foreground">Discover pieces made to be kept.</p>
						<button
							type="button"
							onClick={closeCart}
							className="mt-2 h-12 rounded-md border border-foreground px-6 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
						>
							Continue Shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<div className="px-6 sm:px-8">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<div className="space-y-3 border-t border-border px-6 pt-5 pb-6 sm:px-8">
							<details className="group">
								<summary className="flex cursor-pointer list-none items-center gap-2 text-base text-foreground [&::-webkit-details-marker]:hidden">
									Add promo code
									<ChevronDown
										aria-hidden="true"
										className="h-4 w-4 transition-transform group-open:rotate-180"
										strokeWidth={1.5}
									/>
								</summary>
								<div className="pt-3">
									<DiscountCodeField />
								</div>
							</details>
							<div className="flex items-center justify-between text-base">
								<span>Subtotal</span>
								<span className="tabular-nums">{formatMoney({ amount: subtotal, currency, locale })}</span>
							</div>
							{discount ? (
								<div className="flex items-center justify-between gap-3 text-base text-[#047857]">
									<span>Discount</span>
									<span className="tabular-nums">−{formatMoney({ amount: discount, currency, locale })}</span>
								</div>
							) : null}
							<div className="flex items-center justify-between text-sm">
								<span className="text-base">Shipping</span>
								<span className="text-muted-foreground">Calculated at checkout</span>
							</div>
							<div className="flex items-center justify-between border-t border-border pt-4">
								<span className="text-lg font-semibold">Total</span>
								<span className="text-xl font-semibold tabular-nums">
									{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
								</span>
							</div>
							{taxBehavior !== "inclusive" && (
								<p className="text-xs text-muted-foreground">Taxes calculated at checkout</p>
							)}
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
									"mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-md bg-primary text-lg font-medium text-primary-foreground transition-colors hover:bg-[#1c1917]",
									isMutating && "pointer-events-none opacity-60",
								)}
							>
								{isMutating ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Updating…
									</>
								) : (
									<>
										Proceed to Checkout
										<ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
									</>
								)}
							</a>
							<p className="flex items-center justify-center gap-2 pt-1 text-sm text-muted-foreground">
								<Lock aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
								Secure checkout
							</p>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
