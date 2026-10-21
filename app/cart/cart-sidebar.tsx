"use client";

import { Loader2 } from "lucide-react";
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
			<SheetContent className="flex flex-col gap-0 border-hairline-strong p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
				<SheetHeader className="shrink-0 border-b border-hairline px-6 pb-6 pt-7">
					<p className="kicker">Your selection</p>
					<SheetTitle className="mt-2 font-display text-4xl font-light tracking-[-0.02em] text-ink">
						Cart{" "}
						{itemCount > 0 && (
							<span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
								{itemCount} {itemCount === 1 ? "item" : "items"}
							</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
						<div aria-hidden="true" className="size-24 rounded-full blur-2xl [background:var(--key-light)]" />
						<div className="-mt-16">
							<p className="font-display text-3xl font-light text-ink">The room is dark.</p>
							<p className="mt-2 text-sm text-muted-foreground">Your cart is empty for now.</p>
						</div>
						<button type="button" onClick={closeCart} className="btn-ghost-line btn-sm">
							Continue shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-6">
							<div className="divide-y divide-[var(--hairline)]">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto shrink-0 border-t border-hairline px-6 pb-7 pt-6">
							<div className="w-full space-y-5">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1">
										<div className="flex items-center justify-between text-sm text-muted-foreground">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-sm font-medium text-warm">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-baseline justify-between border-t border-hairline pt-5">
									<span className="text-micro font-medium uppercase tracking-[0.28em] text-muted-foreground">
										{discount ? "Total" : "Subtotal"}
									</span>
									<span className="font-display text-3xl font-light text-ink tabular-nums">
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
										"btn-premium w-full [--btn-fs:12px] [--btn-py:1rem]",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating…
										</>
									) : (
										"Checkout"
									)}
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
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
