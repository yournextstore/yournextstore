"use client";

import { Loader2, X } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { BagIcon } from "@/app/cart-button";
import { useStoreConfig } from "@/components/store-config-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
				className="flex flex-col gap-0 border-0 bg-white p-0 shadow-xl data-[side=right]:w-full data-[side=right]:border-0 data-[side=right]:sm:max-w-md"
			>
				<SheetHeader className="flex shrink-0 flex-row items-start justify-between gap-4 px-4 pb-2 pt-6 sm:px-6">
					<SheetTitle className="text-lg font-medium text-gray-900">
						Shopping cart{itemCount > 0 ? ` (${itemCount})` : ""}
					</SheetTitle>
					<div className="ml-3 flex h-7 items-center">
						<button
							type="button"
							onClick={closeCart}
							aria-label="Close panel"
							className="relative -m-2 p-2 text-subtle transition-colors hover:text-gray-500"
						>
							<X className="size-6" strokeWidth={1.5} aria-hidden />
						</button>
					</div>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-12 text-center">
						<BagIcon className="size-10 text-subtle" />
						<p className="text-lg font-medium text-gray-900">Your cart is empty</p>
						<button type="button" onClick={closeCart} className="ds-btn">
							Continue shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<ul className="divide-y divide-border px-4 sm:px-6">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</ul>
						</ScrollArea>

						<div className="shrink-0 border-t border-border px-4 py-6 sm:px-6">
							<DiscountCodeField />
							{discount ? (
								<div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
									<div className="flex items-center justify-between">
										<span>Items</span>
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
							<div className="mt-4 flex justify-between text-base font-medium text-gray-900">
								<p>Subtotal</p>
								<p>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</p>
							</div>
							{/* Tax is already inside the shown subtotal on an inclusive store — promising to
							    "calculate taxes at checkout" there would read as an extra charge to come. */}
							<p className="mt-0.5 text-sm text-muted-foreground">
								{taxBehavior === "inclusive"
									? "Shipping calculated at checkout."
									: "Shipping and taxes calculated at checkout."}
							</p>
							<div className="mt-6">
								{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
								    different Next.js zone. A soft RSC nav 500s the cross-zone request.
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
										"ds-btn ds-btn-wide w-full shadow-sm [--btn-r:0.375rem]",
										isMutating && "pointer-events-none opacity-70",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="size-4 animate-spin" aria-hidden />
											Updating…
										</>
									) : (
										"Checkout"
									)}
								</a>
							</div>
							<div className="mt-6 flex justify-center text-center text-sm text-muted-foreground">
								<p>
									or{" "}
									<button
										type="button"
										onClick={closeCart}
										className="font-medium text-ink underline decoration-sky decoration-2 underline-offset-4 hover:decoration-sky-deep"
									>
										Continue Shopping<span aria-hidden> &rarr;</span>
									</button>
								</p>
							</div>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
