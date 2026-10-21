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
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex w-full flex-col gap-0 border-l-0 sm:max-w-[300px] lg:max-w-[300px]">
				<SheetHeader className="px-6 pt-12 pb-4">
					<SheetTitle className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
						Basket
						{itemCount > 0 && <span className="font-normal">({itemCount})</span>}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="px-6 text-center">
							<p className="text-lg font-bold">Your basket is empty</p>
							<p className="mt-1 text-sm text-muted-foreground">Find something you'll love sitting on.</p>
						</div>
						<button
							type="button"
							onClick={closeCart}
							className="h-11 rounded-xs bg-peach px-6 text-sm font-bold text-foreground hover:bg-pink"
						>
							Continue shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-6">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto px-6 pt-4 pb-6">
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
								<dl className="space-y-0.5 text-[13px] text-muted-foreground">
									<div className="flex items-center justify-between">
										<dt>Total price:</dt>
										<dd className="font-bold">{formatMoney({ amount: subtotal, currency, locale })}</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt>To pay:</dt>
										<dd className="font-bold">
											{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
										</dd>
									</div>
								</dl>
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
								<Button
									asChild
									variant="outline"
									className="h-10 w-full rounded-none border-2 border-foreground bg-white text-base font-bold text-muted-foreground shadow-none hover:bg-peach hover:text-foreground"
								>
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
											"Go to checkout"
										)}
									</a>
								</Button>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Continue shopping
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
