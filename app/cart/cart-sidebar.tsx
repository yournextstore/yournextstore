"use client";

import { Loader2, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
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
				className="gap-0 bg-white p-0 shadow-xl data-[side=right]:w-[calc(100%-2.5rem)] data-[side=right]:max-w-md data-[side=right]:border-l-0 data-[side=right]:sm:max-w-md"
			>
				<div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
					<div className="flex items-start justify-between">
						<SheetTitle className="text-lg font-medium text-gray-900">Shopping cart</SheetTitle>
						<SheetDescription className="sr-only">
							Review items in your cart and proceed to checkout.
						</SheetDescription>
						<div className="ml-3 flex h-7 items-center">
							<SheetClose className="-m-2 p-2 text-gray-500 hover:text-gray-600">
								<span className="sr-only">Close panel</span>
								<X className="h-6 w-6" aria-hidden="true" />
							</SheetClose>
						</div>
					</div>

					{items.length > 0 && (
						<div className="mt-6">
							<DiscountCodeField />
						</div>
					)}

					<div className="mt-8">
						{items.length === 0 ? (
							<div className="flex flex-col items-center py-16 text-center">
								<ShoppingCart className="h-12 w-12 text-gray-300" aria-hidden="true" />
								<p className="mt-4 text-base font-medium text-gray-900">Your cart is empty</p>
								<p className="mt-1 text-sm text-gray-500">
									Add a few products and they will wait for you here.
								</p>
							</div>
						) : (
							<div className="flow-root">
								<ul className="-my-6 divide-y divide-gray-200">
									{items.map((item) => (
										<CartItem key={itemKey(item)} item={item} />
									))}
								</ul>
							</div>
						)}
					</div>
				</div>

				<div className="border-t border-gray-200 px-4 py-6 sm:px-6">
					{discount ? (
						<div className="mb-2 space-y-1">
							<div className="flex justify-between text-sm text-gray-500">
								<p>Subtotal</p>
								<p>{formatMoney({ amount: subtotal, currency, locale })}</p>
							</div>
							<div className="flex justify-between text-sm font-medium text-green-700">
								<p>Discount</p>
								<p className="tabular-nums">−{formatMoney({ amount: discount, currency, locale })}</p>
							</div>
						</div>
					) : null}
					<div className="flex justify-between text-base font-medium text-gray-900">
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
					<div className="mt-6">
						{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
						    different Next.js zone. While a cart write is in flight, block the link: a full
						    navigation now would load /checkout before the item is committed server-side. */}
						<a
							href={checkoutUrl}
							aria-disabled={isMutating || itemCount === 0}
							tabIndex={isMutating || itemCount === 0 ? -1 : undefined}
							onClick={(e) => {
								if (isMutating || itemCount === 0) {
									e.preventDefault();
								}
							}}
							className={cn(
								"flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-brand px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-brand-hover focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none",
								(isMutating || itemCount === 0) && "pointer-events-none opacity-50",
							)}
						>
							{isMutating ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
									Updating…
								</>
							) : (
								"Checkout"
							)}
						</a>
					</div>
					<div className="mt-6 flex justify-center text-center text-sm text-gray-500">
						<p>
							or{" "}
							<button
								type="button"
								className="font-medium text-brand hover:text-brand-hover"
								onClick={closeCart}
							>
								Continue Shopping<span aria-hidden="true"> &rarr;</span>
							</button>
						</p>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
