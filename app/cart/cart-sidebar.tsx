"use client";

import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
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
			<SheetContent
				showCloseButton={false}
				className="flex flex-col gap-0 border-line bg-page data-[side=right]:w-full data-[side=right]:sm:max-w-md"
			>
				<SheetHeader className="flex-row items-center justify-between border-b border-line px-5 py-4">
					<SheetTitle className="flex items-center gap-3 text-[1.45rem] text-ink">
						<span aria-hidden="true" className={cn("led", itemCount > 0 ? "led--amber" : "")} />
						Your rack
						<span className="font-plate text-[0.74rem] font-normal tracking-[0.12em] text-faint uppercase">
							{itemCount} {itemCount === 1 ? "item" : "items"}
						</span>
					</SheetTitle>
					<SheetClose
						className="rounded-[9px] p-2 text-dim transition-colors hover:bg-line-2 hover:text-ink"
						aria-label="Close cart"
					>
						<X className="h-5 w-5" aria-hidden="true" />
					</SheetClose>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-start justify-center gap-5 px-6 py-12">
						<p className="kicker">Empty rack</p>
						<p className="font-display text-[2rem] text-ink">No cables, no signal.</p>
						<p className="font-plate text-[0.8rem] text-dim">
							<span className="text-signal">▸ </span>Grab a module — start with anything marked in stock.
						</p>
						<Link href="/products" onClick={closeCart} className="btn btn-primary">
							See the line <span aria-hidden="true">→</span>
						</Link>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-5">
							<div className="divide-y divide-line">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto border-t border-line bg-page-2 px-5 pt-5 pb-6">
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
									<span className="plate-label">{discount ? "Total" : "Subtotal"}</span>
									<span className="font-plate text-[1.5rem] text-ink">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="font-plate text-[0.7rem] text-faint">
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
										"btn btn-primary w-full [--btn-py:0.9rem]",
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
								<button type="button" onClick={closeCart} className="btn btn-ghost w-full">
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
