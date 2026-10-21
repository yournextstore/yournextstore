"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { buttonVariants } from "@/components/ui/button";
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
			<SheetContent className="flex flex-col gap-0 bg-background data-[side=right]:w-full data-[side=right]:sm:max-w-md">
				<SheetHeader className="border-b border-border bg-card p-5 pr-12">
					<SheetTitle className="flex items-baseline gap-2 text-2xl font-semibold">
						Shopping Cart
						{itemCount > 0 && (
							<span className="font-price text-xs font-normal text-muted-foreground">
								{itemCount} {itemCount === 1 ? "item" : "items"}
							</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="p-5">
						<div className="rounded-lg border border-border bg-card p-6">
							<p className="text-lg text-foreground">Your cart is empty</p>
							<p className="mt-1 text-sm text-muted-foreground">
								Looks like you haven&apos;t added anything yet.
							</p>
							<div className="mt-6 flex justify-center">
								<Link
									href="/products"
									onClick={closeCart}
									className="rounded-md bg-brand px-6 py-3 text-base font-medium text-brand-foreground transition-opacity hover:opacity-90"
								>
									Browse Products
								</Link>
							</div>
						</div>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-5">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto border-t border-border bg-card p-5">
							<h2 className="text-xl font-semibold">Order Summary</h2>
							<div className="w-full space-y-4">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1">
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
								<div className="flex items-center justify-between text-sm text-muted-foreground">
									<span>Shipping</span>
									<span>Calculated at checkout</span>
								</div>
								<div className="flex items-center justify-between border-t border-border pt-4 text-base">
									<span className="font-semibold">{discount ? "Total" : "Subtotal"}</span>
									<span className="font-price text-lg font-bold">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
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
										buttonVariants(),
										"h-12 w-full rounded-full text-sm font-semibold uppercase tracking-[0.08em] hover:bg-brand hover:text-brand-foreground",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating…
										</>
									) : (
										"Proceed to checkout"
									)}
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-brand transition-colors hover:underline"
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
