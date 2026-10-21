"use client";

import { Loader2, X } from "lucide-react";
import Link from "next/link";
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
			<SheetContent hideClose className="flex w-full flex-col gap-0 border-line bg-page sm:max-w-lg">
				<SheetHeader className="flex-row items-center justify-between border-b border-line px-5 py-4">
					<SheetTitle className="flex items-baseline gap-3 text-[1.9rem] text-ink">
						Your bag
						<span className="font-field text-[0.78rem] font-bold tracking-[0.06em] text-signal">
							[{itemCount}]
						</span>
					</SheetTitle>
					<SheetClose className="p-1.5 text-dim transition-colors hover:text-ink" aria-label="Close cart">
						<X className="h-5 w-5" aria-hidden="true" />
					</SheetClose>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-start justify-center gap-5 px-6 py-12">
						<p className="eyebrow">
							<span className="grid-ref" aria-hidden="true">
								[ 00 ]
							</span>
							NOTHING PACKED
						</p>
						<p className="font-display text-[2.6rem] text-ink">The bag is empty.</p>
						<p className="text-dim">Load it up before the weather turns.</p>
						<Link href="/products" onClick={closeCart} className="btn btn-primary">
							Shop the range
						</Link>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-5">
							<div className="divide-y divide-line">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto border-t border-line bg-panel px-5 pt-5 pb-6">
							<div className="w-full space-y-4">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1">
										<div className="flex items-center justify-between text-sm text-muted-foreground">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-sm font-medium text-signal">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-baseline justify-between">
									<span className="font-field text-[0.74rem] tracking-[0.1em] text-faint uppercase">
										{discount ? "Total" : "Subtotal"}
									</span>
									<span className="font-display text-[2rem] text-ink">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="font-field text-[0.7rem] tracking-[0.04em] text-dim uppercase">
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
										"btn btn-primary w-full [--btn-py:16px]",
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
											Proceed to checkout <span aria-hidden="true">→</span>
										</>
									)}
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="font-field w-full py-1 text-[0.74rem] tracking-[0.06em] text-dim uppercase transition-colors hover:text-ink"
								>
									Keep shopping
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
