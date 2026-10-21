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
			<SheetContent className="flex flex-col gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
				<SheetHeader className="border-b border-border px-5 pt-5 pb-4">
					<SheetTitle className="font-display text-2xl font-bold">Shopping Cart</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex size-16 items-center justify-center rounded-full bg-accent/15">
							<ShoppingBag className="size-7 text-gold-ink" />
						</div>
						<div className="text-center">
							<p className="font-display text-xl font-bold">Your cart is empty</p>
							<p className="mt-1 text-sm text-muted-foreground">Find something new: the shelf is full.</p>
						</div>
						<Button onClick={closeCart} className="bg-accent text-accent-foreground hover:bg-accent/85">
							Continue Shopping
						</Button>
					</div>
				) : (
					<>
						<div className="grid grid-cols-[1fr_auto] border-b border-border px-5 py-2.5 text-xs font-medium text-gold-ink">
							<span>Item</span>
							<span>Price</span>
						</div>
						<ScrollArea className="min-h-0 flex-1 px-5">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto p-4">
							<div className="w-full space-y-4 rounded-lg border border-border bg-card p-5">
								<p className="font-display text-xl font-bold">Order Summary</p>
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1">
										<div className="flex items-center justify-between text-sm text-muted-foreground">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-sm font-medium text-[hsl(150_45%_28%)] dark:text-[hsl(150_45%_65%)]">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between text-lg">
									<span>
										{discount ? "Total" : "Subtotal"}{" "}
										<span className="text-sm text-muted-foreground">
											({itemCount} {itemCount === 1 ? "item" : "items"})
										</span>
									</span>
									<span className="font-semibold">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-xs text-muted-foreground">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout"
										: "Shipping and taxes calculated at checkout"}
								</p>
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
										"h-10 w-full bg-[var(--footer)] text-base font-medium text-[var(--footer-foreground)] hover:bg-[var(--footer)]/90",
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
											<ArrowRight aria-hidden="true" className="size-4" />
											Proceed to Checkout
										</>
									)}
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
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
