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
			<SheetContent className="flex flex-col data-[side=right]:w-full data-[side=right]:sm:max-w-md bg-[#FAFAF8] border-l border-zinc-200">
				<SheetHeader className="border-b border-zinc-200 pb-6">
					<SheetTitle className="text-xs tracking-[0.3em] uppercase text-zinc-900 font-normal">
						Cart
						{itemCount > 0 && <span className="text-zinc-400 ml-2">({itemCount})</span>}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-8 py-16">
						<div className="text-center">
							<p className="text-sm text-zinc-900 font-light">Your cart is empty</p>
							<p className="text-xs text-zinc-400 mt-2">Add some products to get started</p>
						</div>
						<button
							type="button"
							onClick={closeCart}
							className="text-xs tracking-[0.15em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
						>
							Continue Shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1">
							<div className="divide-y divide-zinc-200">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="border-t border-zinc-200 pt-6 mt-auto">
							<div className="w-full space-y-6">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-xs tracking-[0.2em] uppercase text-zinc-400">Subtotal</span>
											<span className="text-sm text-zinc-900 font-light">
												{formatMoney({ amount: subtotal, currency, locale })}
											</span>
										</div>
										<div className="flex items-center justify-between gap-3">
											<span className="text-xs tracking-[0.2em] uppercase text-zinc-400">Discount</span>
											<span className="text-sm text-zinc-900 font-light tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between">
									<span className="text-xs tracking-[0.2em] uppercase text-zinc-400">
										{discount ? "Total" : "Subtotal"}
									</span>
									<span className="text-sm text-zinc-900 font-light">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-xs text-zinc-400">
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
										"block w-full py-4 bg-zinc-900 text-white text-xs tracking-[0.15em] uppercase text-center hover:bg-zinc-800 transition-colors",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<span className="inline-flex items-center gap-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating…
										</span>
									) : (
										"Checkout"
									)}
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-xs tracking-[0.15em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
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
