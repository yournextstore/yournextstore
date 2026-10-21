"use client";

import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { CartIcon } from "@/app/cart-button";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button, buttonVariants } from "@/components/ui/button";
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
			<SheetContent className="flex flex-col gap-0 p-6 pr-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
				<SheetHeader className="space-y-2.5 p-0 pr-6">
					<SheetTitle>Cart {itemCount > 0 && `(${itemCount})`}</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<div className="h-px bg-border" />
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center gap-1 pr-6">
						<CartIcon className="mb-4 size-16 text-muted-foreground" />
						<p className="text-xl font-medium text-muted-foreground">Your cart is empty</p>
						<Button variant="link" size="sm" className="text-sm text-muted-foreground" onClick={closeCart}>
							Add items to your cart to checkout
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<div className="flex w-full flex-col gap-5 pt-4 pr-6">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<div className="space-y-4 pt-4 pr-6">
							<div className="h-px bg-border" />
							<DiscountCodeField />
							<div className="space-y-1.5 text-sm">
								{discount ? (
									<>
										<div className="flex">
											<span className="flex-1">Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex">
											<span className="flex-1">Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</>
								) : null}
								<div className="flex">
									<span className="flex-1">Shipping</span>
									<span className="text-muted-foreground">Calculated at checkout</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<div className="flex">
									<span className="flex-1">Taxes</span>
									<span className="text-muted-foreground">
										{taxBehavior === "inclusive" ? "Included" : "Calculated at checkout"}
									</span>
								</div>
								<div className="flex font-medium">
									<span className="flex-1">Total</span>
									<span>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</span>
								</div>
							</div>
							{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
							    different Next.js zone. A soft RSC nav 500s the cross-zone request.
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
									buttonVariants({ size: "sm" }),
									"w-full",
									isMutating && "pointer-events-none opacity-60",
								)}
							>
								{isMutating ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										Updating…
									</>
								) : (
									"Continue to checkout"
								)}
							</a>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
