"use client";

import { Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
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

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex flex-col border-l border-border/50 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
				<SheetHeader className="border-b border-border/50 pb-6">
					<SheetTitle className="flex items-center gap-3 text-lg font-serif font-light tracking-wide">
						Shopping Bag
						{itemCount > 0 && (
							<span className="text-xs font-sans tracking-[0.1em] uppercase text-muted-foreground">
								({itemCount} items)
							</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-6 py-16">
						<div className="flex h-24 w-24 items-center justify-center border border-border/50">
							<ShoppingBag className="h-10 w-10 text-primary/50" />
						</div>
						<div className="text-center">
							<p className="text-lg font-serif font-light">Your bag is empty</p>
							<p className="text-sm text-muted-foreground mt-2">Discover our exquisite collections</p>
						</div>
						<Button
							variant="outline"
							onClick={closeCart}
							className="tracking-[0.1em] uppercase text-xs h-12 px-8 border-primary/30 hover:bg-primary hover:text-primary-foreground"
						>
							Continue Shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1 px-4">
							<div className="divide-y divide-border/50">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="border-t border-border/50 pt-6 mt-auto">
							<div className="w-full space-y-6">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-2">
										<div className="flex items-center justify-between text-xs tracking-[0.15em] uppercase text-muted-foreground">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-xs tracking-[0.15em] uppercase font-medium text-green-700">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between">
									<span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
										{discount ? "Total" : "Subtotal"}
									</span>
									<span className="text-lg font-light text-primary">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">Complimentary shipping on orders over $500</p>
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
										buttonVariants(),
										"w-full h-14 text-xs tracking-[0.15em] uppercase font-medium",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating…
										</>
									) : (
										"Proceed to Checkout"
									)}
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
								>
									Continue Shopping
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
