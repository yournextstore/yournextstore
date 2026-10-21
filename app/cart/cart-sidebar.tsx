"use client";

import { ArrowRight, Loader2 } from "lucide-react";
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
			<SheetContent className="flex w-full flex-col gap-0 border-0 sm:max-w-lg">
				<SheetHeader className="px-5 pt-8 pb-6 sm:px-8">
					<SheetTitle className="flex items-baseline gap-2 font-heading text-4xl leading-none font-normal">
						Cart
						{itemCount > 0 && <span className="text-contrast-400">{itemCount}</span>}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-start gap-4 px-5 py-6 sm:px-8">
						<p className="font-heading text-2xl">Your cart is empty</p>
						<p className="text-contrast-500">Add some products to get started.</p>
						<button
							type="button"
							onClick={closeCart}
							className="btn-soul btn-secondary mt-2 min-h-12 px-5 py-3"
						>
							Continue shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-5 sm:px-8">
							<div className="divide-y divide-contrast-100">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto gap-0 border-t border-contrast-100 px-5 pt-2 pb-6 sm:px-8">
							<dl className="w-full text-base">
								<div className="flex items-center justify-between border-b border-contrast-100 py-3">
									<dt>Subtotal</dt>
									<dd>{formatMoney({ amount: subtotal, currency, locale })}</dd>
								</div>
								{discount ? (
									<div className="flex items-center justify-between border-b border-contrast-100 py-3">
										<dt>Discount</dt>
										<dd className="tabular-nums text-[#2f6a12]">
											−{formatMoney({ amount: discount, currency, locale })}
										</dd>
									</div>
								) : null}
								<div className="flex items-center justify-between border-b border-contrast-100 py-3">
									<dt>Shipping</dt>
									<dd className="text-contrast-500">Calculated at checkout</dd>
								</div>
							</dl>
							<div className="w-full border-b border-contrast-100 py-4">
								<DiscountCodeField />
							</div>
							<div className="flex w-full items-center justify-between py-4 text-xl font-semibold">
								<span>Total</span>
								<span>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</span>
							</div>
							{/* Tax is already inside the shown total on an inclusive store — promising to
							    "calculate taxes at checkout" there would read as an extra charge to come. */}
							{taxBehavior !== "inclusive" && (
								<p className="-mt-2 mb-3 w-full text-sm text-contrast-500">Taxes calculated at checkout</p>
							)}
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
									"btn-soul btn-primary min-h-14 w-full px-6 py-4 text-base",
									isMutating && "pointer-events-none",
								)}
							>
								{isMutating ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										Updating…
									</>
								) : (
									<>
										Proceed to checkout
										<ArrowRight className="size-5" strokeWidth={1.5} />
									</>
								)}
							</a>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
