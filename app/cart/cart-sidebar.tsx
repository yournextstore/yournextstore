"use client";

import { Loader2 } from "lucide-react";
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
			<SheetContent className="flex flex-col gap-0 border-earth/10 bg-background shadow-luxury-lg data-[side=right]:w-full data-[side=right]:sm:max-w-md [&>button:last-child]:top-6 [&>button:last-child]:right-6">
				<SheetHeader className="border-b border-earth/10 px-6 py-5">
					<SheetTitle className="font-display text-2xl font-normal text-royal">Your Cart</SheetTitle>
					<p className="font-body text-xs uppercase tracking-widest text-earth-soft">
						{itemCount} {itemCount === 1 ? "item" : "items"}
					</p>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
						<div className="mb-4 flex size-16 items-center justify-center rounded-full bg-earth/10">
							<svg
								aria-hidden="true"
								width="28"
								height="28"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-earth-soft"
							>
								<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
								<line x1="3" y1="6" x2="21" y2="6" />
								<path d="M16 10a4 4 0 0 1-8 0" />
							</svg>
						</div>
						<p className="font-display text-xl text-earth">Your cart is empty</p>
						<p className="mt-2 font-body text-sm text-earth-soft">Discover something beautiful</p>
						<Link
							href="/products"
							onClick={closeCart}
							className="mt-6 rounded-sm bg-royal px-6 py-3 font-body text-xs uppercase tracking-widest text-cream transition-colors hover:bg-royal-deep"
						>
							Shop Now
						</Link>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-6">
							<div className="divide-y divide-earth/10">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto gap-0 border-t border-earth/10 px-6 py-5">
							<div className="w-full space-y-4">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1 font-body">
										<div className="flex items-center justify-between text-sm text-earth-soft">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-sm font-medium text-green-800">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between">
									<span className="font-body text-xs uppercase tracking-widest text-earth-soft">
										{discount ? "Total" : "Subtotal"}
									</span>
									<span className="font-display text-xl text-royal">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="font-body text-xs text-earth-soft">
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
										"flex w-full items-center justify-center gap-2 bg-crimson py-4 text-center font-body text-xs uppercase tracking-widest text-cream transition-colors duration-200 hover:bg-crimson-deep",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating…
										</>
									) : (
										"Proceed to Checkout"
									)}
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="w-full font-body text-xs uppercase tracking-widest text-earth-soft transition-colors hover:text-crimson"
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
