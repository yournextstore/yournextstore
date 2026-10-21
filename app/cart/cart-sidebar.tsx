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
	const { cart, isOpen, closeCart, items, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex flex-col gap-0 bg-white p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
				<SheetHeader className="z-10 flex-row items-center gap-4 p-5 pr-14 shadow-sm">
					<SheetTitle className="flex items-center gap-4 text-2xl font-bold text-zinc-800">
						Your cart
						{isMutating ? (
							<Loader2 className="h-4 w-4 animate-spin text-zinc-500" aria-label="Updating" />
						) : null}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="mt-20 flex-1 px-5 text-center">
						<p className="text-gray-500">Your cart is empty</p>
						<button
							type="button"
							onClick={closeCart}
							className="mt-1 font-semibold text-emerald-900 hover:text-emerald-700"
						>
							Continue Shopping
							<span aria-hidden> &rarr;</span>
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<ul className="divide-y divide-zinc-100 px-5">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</ul>
						</ScrollArea>

						<SheetFooter className="mt-0 border-t border-zinc-200 px-4 py-6 sm:px-6">
							<div className="w-full">
								<DiscountCodeField />
								{discount ? (
									<div className="mt-4 space-y-1 text-sm">
										<div className="flex items-center justify-between text-gray-600">
											<span>Items</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 font-medium text-emerald-800">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="mt-4 flex justify-between text-base font-medium text-gray-900">
									<p>{discount ? "Total" : "Subtotal"}</p>
									<p>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</p>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="mt-0.5 text-sm text-gray-500">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout."
										: "Shipping and taxes calculated at checkout."}
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
									className={cn("btn-emerald mt-6 w-full", isMutating && "pointer-events-none")}
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
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
