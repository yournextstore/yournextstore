"use client";

import { Loader2 } from "lucide-react";
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

	// The original's drawer: a #1a1a1a panel taking 45% of the screen from the right, a ruled
	// "Your card / Close" header, text rows, a ruled total and one pale Checkout slab.
	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				hideClose
				className="w-full gap-0 border-l-0 bg-panel p-0 text-snow sm:max-w-none md:w-[45%] md:min-w-[28rem]"
			>
				<SheetHeader className="mx-4 flex-row items-center justify-between gap-4 border-b border-snow px-0 py-0 md:mx-[2vw]">
					<SheetTitle className="flex h-16 items-center text-nav font-normal md:h-[clamp(4.5rem,10vh,6.5rem)]">
						Your cart{itemCount > 0 ? ` (${itemCount})` : ""}
					</SheetTitle>
					<SheetClose className="text-nav underline-offset-[0.3em] hover:underline">Close</SheetClose>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-start gap-6 px-4 py-10 md:px-[2vw]">
						<p className="text-copy">Your cart is empty.</p>
						<button
							type="button"
							onClick={closeCart}
							className="text-copy underline underline-offset-[0.3em] hover:no-underline"
						>
							Continue shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<div className="divide-y divide-snow/15 px-4 md:px-[2vw]">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<div className="mt-auto border-t border-snow px-4 pb-6 pt-4 md:px-[2vw] md:pb-[2vw]">
							<DiscountCodeField />
							{discount ? (
								<div className="mt-4 space-y-1 text-foot">
									<div className="flex items-center justify-between text-muted-foreground">
										<span>Subtotal</span>
										<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
									</div>
									<div className="flex items-center justify-between gap-3">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								</div>
							) : null}
							<div className="mt-4 flex items-center justify-between text-nav">
								<span>Total price</span>
								<span className="tabular-nums">
									{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
								</span>
							</div>
							{/* Tax is already inside the shown total on an inclusive store. */}
							<p className="mt-2 text-foot text-muted-foreground">
								{taxBehavior === "inclusive"
									? "Tax included and shipping calculated at checkout"
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
									"mx-auto mt-6 flex h-14 w-full items-center justify-center gap-2 border border-snow bg-snow text-copy text-black transition-colors duration-500 hover:bg-black hover:text-snow md:h-[clamp(3.5rem,8vh,4.5rem)] md:w-4/5",
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
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
