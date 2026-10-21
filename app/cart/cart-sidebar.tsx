"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
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
			<SheetContent className="flex flex-col gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-xl">
				<SheetHeader className="px-6 pt-8 pb-6 sm:px-10">
					<SheetTitle className="text-4xl leading-tight font-light text-foreground sm:text-5xl">
						Your Cart
					</SheetTitle>
					<SheetDescription className="text-sm text-muted-foreground">
						{itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "item" : "items"}` : "No items in cart."}
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-start gap-6 px-6 py-6 sm:px-10">
						<p className="text-muted-foreground">Find something you&apos;ll love in the shop.</p>
						<button type="button" onClick={closeCart} className="jam-btn">
							Continue shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-6 sm:px-10">
							<div className="divide-y divide-border border-t border-border">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto border-t border-border px-6 pt-6 pb-8 sm:px-10">
							<div className="w-full space-y-4">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1 text-sm">
										<div className="flex items-center justify-end gap-10 text-muted-foreground">
											<span>Subtotal</span>
											<span className="tabular-nums">
												{formatMoney({ amount: subtotal, currency, locale })}
											</span>
										</div>
										<div className="flex items-center justify-end gap-10 text-[#276749]">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-baseline justify-end gap-10">
									<span className="text-sm">Total</span>
									<span className="font-semibold tracking-wide tabular-nums">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown total on an inclusive store. */}
								<p className="text-right text-xs text-muted-foreground">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout"
										: "Shipping and taxes calculated at checkout"}
								</p>
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
									className={cn("jam-btn w-full", isMutating && "pointer-events-none opacity-60")}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating…
										</>
									) : (
										<>
											Proceed to check out
											<ArrowRight aria-hidden className="h-4 w-4" />
										</>
									)}
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
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
