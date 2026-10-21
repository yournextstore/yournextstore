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
			<SheetContent
				className="gap-0 border-line p-0 shadow-none data-[side=right]:w-[min(440px,92vw)] data-[side=right]:sm:max-w-none"
				side="right"
				showCloseButton={false}
			>
				<SheetHeader className="flex-row items-center justify-between gap-4 border-b border-line px-7 pt-7 pb-5">
					<SheetTitle className="text-[11px] font-normal tracking-[0.24em]">
						SHOPPING BAG ({itemCount})
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your bag and proceed to checkout.
					</SheetDescription>
					<button
						type="button"
						onClick={closeCart}
						className="cursor-pointer py-1 text-[10px] uppercase tracking-[0.18em]"
					>
						Close
					</button>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-6 px-7 py-16">
						<p className="cap-tag text-faint">Your bag is empty.</p>
						<button type="button" onClick={closeCart} className="btn-ink h-[50px] w-full max-w-[260px] px-6">
							Continue shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-7 py-2">
							<div className="flex flex-col">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-0 gap-4 border-t border-line px-7 pt-6 pb-8">
							<DiscountCodeField />
							{discount ? (
								<div className="flex flex-col gap-1 text-[11px] tracking-[0.08em] text-soft">
									<div className="flex items-center justify-between">
										<span>Subtotal</span>
										<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
									</div>
									<div className="flex items-center justify-between gap-3 text-acc">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								</div>
							) : null}
							<div className="flex items-center justify-between text-[12px] tracking-[0.1em]">
								<span>{discount ? "TOTAL" : "SUBTOTAL"}</span>
								<span>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</span>
							</div>
							{/* Tax is already inside the shown subtotal on an inclusive store — promising to
							    "calculate taxes at checkout" there would read as an extra charge to come. */}
							<p className="text-[10px] tracking-[0.1em] text-faint">
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
								className={cn("btn-ink h-[50px] w-full gap-2 px-4", isMutating && "pointer-events-none")}
							>
								{isMutating ? (
									<>
										<Loader2 aria-hidden className="h-3.5 w-3.5 animate-spin" />
										Updating…
									</>
								) : (
									"Go to checkout"
								)}
							</a>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
