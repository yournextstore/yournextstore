"use client";

import { Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
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
			<SheetContent className="flex w-full flex-col gap-0 border-line bg-background sm:max-w-md">
				<SheetHeader className="shrink-0 border-b border-line px-5 pb-4 pt-5">
					<p className="hs-kicker text-[0.7rem]">[ Your build ]</p>
					<SheetTitle className="hs-display flex items-baseline gap-2 text-[1.6rem]">
						Cart
						<span className="hs-mono text-[0.8rem] font-normal tracking-normal text-faint normal-case">
							{String(itemCount).padStart(2, "0")} {itemCount === 1 ? "item" : "items"}
						</span>
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-12 text-center">
						<ShoppingBag className="h-10 w-10 text-faint" strokeWidth={1.4} />
						<div>
							<p className="hs-display text-[1.4rem]">Nothing bolted on yet.</p>
							<p className="hs-mono mt-2 text-[0.75rem] text-faint">Add a part and it lands here.</p>
						</div>
						<button type="button" onClick={closeCart} className="hs-btn hs-btn-ghost">
							Keep browsing
						</button>
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

						<SheetFooter className="mt-auto shrink-0 border-t border-line bg-card px-5 pb-5 pt-4">
							<div className="w-full space-y-4">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1">
										<div className="hs-mono flex items-center justify-between text-[0.8rem] text-muted-foreground">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="hs-mono flex items-center justify-between gap-3 text-[0.8rem] font-bold text-signal">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-baseline justify-between">
									<span className="hs-label">{discount ? "Total" : "Subtotal"}</span>
									<span className="hs-display text-[1.7rem] normal-case">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="hs-mono text-[0.7rem] text-faint">
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
										"hs-btn hs-btn-primary hs-btn-block min-h-12",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating…
										</>
									) : (
										"Checkout →"
									)}
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="hs-mono w-full text-[0.75rem] text-muted-foreground transition-colors hover:text-signal"
								>
									Keep browsing
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
