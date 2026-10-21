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
				closeLabel="Close cart"
				className="flex flex-col gap-0 bg-white data-[side=right]:w-full data-[side=right]:border-l-0 data-[side=right]:sm:max-w-md"
			>
				<SheetHeader className="px-6 pt-7 pb-4">
					<SheetTitle className="flex items-center gap-2 text-lg font-bold">
						My Cart
						{itemCount > 0 && (
							<span>
								({itemCount} {itemCount === 1 ? "item" : "items"})
							</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
						<p className="font-display text-display-md">Your cart is empty</p>
						<p className="text-sm text-muted-foreground">Find something you love in the shop.</p>
						<button
							type="button"
							onClick={closeCart}
							className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-bold text-white hover:bg-slate-800"
						>
							Continue Shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-6">
							<div className="divide-y divide-slate-200">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto border-t border-slate-200 px-6 pt-6 pb-6">
							<div className="w-full space-y-4">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1">
										<div className="flex items-center justify-between text-sm text-muted-foreground">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-sm font-medium text-green-700">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between text-base font-bold">
									<span>{discount ? "Total" : "Subtotal"}</span>
									<span>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="-mt-3 text-sm text-muted-foreground">
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
									className={cn(
										"flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-base font-bold text-white transition-colors hover:bg-slate-800",
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
								<p className="text-center text-sm text-muted-foreground">
									or{" "}
									<button
										type="button"
										onClick={closeCart}
										className="text-ink underline underline-offset-2 hover:text-olive"
									>
										Continue Shopping &rarr;
									</button>
								</p>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
