"use client";

import { ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
			<SheetContent className="flex flex-col data-[side=right]:w-full data-[side=right]:sm:max-w-lg bg-background/95 backdrop-blur-xl border-l border-border">
				<SheetHeader className="border-b border-border pb-4">
					<SheetTitle className="flex items-center gap-3">
						<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
							<ShoppingBag className="w-5 h-5 text-primary" />
						</div>
						<div>
							<span className="text-lg font-bold">Your Cart</span>
							{itemCount > 0 && (
								<p className="text-sm font-normal text-muted-foreground">{itemCount} items</p>
							)}
						</div>
					</SheetTitle>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
							<ShoppingBag className="h-12 w-12 text-muted-foreground" />
						</div>
						<div className="text-center">
							<p className="text-lg font-bold">Your cart is empty</p>
							<p className="text-sm text-muted-foreground mt-1">Add some products to get started</p>
						</div>
						<Button
							variant="outline"
							onClick={closeCart}
							className="rounded-full px-6 hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							Continue Shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1 px-1">
							<div className="space-y-4 py-4">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="border-t border-border pt-4 mt-auto">
							<div className="w-full space-y-4">
								<DiscountCodeField />
								<div className="bg-secondary/50 rounded-2xl p-4">
									{discount ? (
										<div className="space-y-1 pb-2">
											<div className="flex items-center justify-between text-sm text-muted-foreground">
												<span>Subtotal</span>
												<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
											</div>
											<div className="flex items-center justify-between gap-3 text-sm font-medium text-green-700">
												<span>Discount</span>
												<span className="tabular-nums">
													−{formatMoney({ amount: discount, currency, locale })}
												</span>
											</div>
										</div>
									) : null}
									<div className="flex items-center justify-between text-base">
										<span className="font-medium text-muted-foreground">
											{discount ? "Total" : "Subtotal"}
										</span>
										<span className="text-xl font-bold">
											{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
										</span>
									</div>
									{/* Tax is already inside the shown subtotal on an inclusive store — promising to
									    "calculate taxes at checkout" there would read as an extra charge to come. */}
									<p className="text-xs text-muted-foreground mt-1">
										{taxBehavior === "inclusive"
											? "Shipping calculated at checkout"
											: "Shipping and taxes calculated at checkout"}
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
									className={cn(
										buttonVariants(),
										"w-full h-14 text-base font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow transition-all hover:scale-[1.02]",
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
											Checkout
											<ArrowRight className="ml-2 w-5 h-5" />
										</>
									)}
								</a>

								{/* Continue Shopping */}
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
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
