"use client";

import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button } from "@/components/ui/button";
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
	const { cart, isOpen, closeCart, items, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="cart flex w-full flex-col gap-0 border-l-0 p-0 sm:max-w-lg [&>button:last-child]:top-5 [&>button:last-child]:right-5 [&>button:last-child>svg]:size-6">
				<SheetHeader className="border-b border-border px-6 py-5">
					<SheetTitle className="font-heading text-xl font-semibold">Your Cart</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-12 text-center">
						<p className="text-body">Your cart is empty</p>
						<Button className="h-11 rounded-lg px-5 text-base font-semibold" onClick={closeCart}>
							Continue shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<div className="px-6 py-2">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto gap-0 border-t border-foreground/80 px-6 pb-6 pt-6">
							<div className="w-full space-y-5">
								{discount ? (
									<div className="space-y-1">
										<div className="flex items-center justify-between text-body">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-base font-medium text-green-800">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between text-body">
									<span>{discount ? "Total" : "Subtotal"}</span>
									<span>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</span>
								</div>
								<DiscountCodeField />
								{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
								    different Next.js zone (yns.store). A soft RSC nav 500s the cross-zone request.
								    While a cart write is in flight, block the link: a full navigation now would
								    load /checkout before the item is committed server-side and show an empty cart. */}
								<Button asChild className="h-11 w-full rounded-lg text-base font-semibold">
									<a
										href={checkoutUrl}
										aria-disabled={isMutating}
										tabIndex={isMutating ? -1 : undefined}
										onClick={(e) => {
											if (isMutating) {
												e.preventDefault();
											}
										}}
										className={cn(isMutating && "pointer-events-none opacity-60")}
									>
										{isMutating ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin" />
												Updating…
											</>
										) : (
											"Continue to checkout"
										)}
									</a>
								</Button>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-center text-sm text-muted-foreground">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout"
										: "Shipping and taxes calculated at checkout"}
								</p>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
