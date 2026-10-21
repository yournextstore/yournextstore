"use client";

import { Dialog } from "@base-ui/react/dialog";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/**
 * The cart: a panel under the header's "Cart (n)" rather than a drawer, as in the original.
 * Black line cards, a summary card, and the red Checkout bar; a long cart scrolls inside it.
 */
export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<Dialog.Portal>
				<Dialog.Popup className="fixed inset-x-3 top-[34px] z-50 max-h-[calc(100svh-38px)] overflow-y-auto overscroll-contain text-label font-semibold text-white focus:outline-none data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-1 lg:left-auto lg:w-[500px]">
					<Dialog.Title className="sr-only">Cart</Dialog.Title>
					{/* For keyboards: shown only while focused (Escape and clicking outside close it too). */}
					<Dialog.Close className="sr-only z-10 rounded-sm bg-white p-2 text-black focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:right-10">
						Close cart
					</Dialog.Close>

					{items.length === 0 ? (
						<>
							<p className="card bg-black">Your cart is empty.</p>
							<Link
								href="/products"
								onClick={closeCart}
								className="mt-1 flex h-8 items-center justify-center rounded-sm bg-brand hover:underline"
							>
								Visit the shop
							</Link>
						</>
					) : (
						<>
							<ul className="flex flex-col gap-1">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</ul>

							<div className="card mt-1 flex flex-col gap-3 bg-black">
								<DiscountCodeField />
								<dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2">
									{discount ? (
										<>
											<dt>Subtotal</dt>
											<dd className="text-right">{formatMoney({ amount: subtotal, currency, locale })}</dd>
											<dt>Discount</dt>
											<dd className="text-right tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</dd>
										</>
									) : null}
									<dt>{discount ? "Total" : "Subtotal"}</dt>
									<dd className="text-right">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</dd>
								</dl>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-copy font-normal text-white/80">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout."
										: "Shipping and taxes calculated at checkout."}
								</p>
							</div>

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
									"mt-1 flex h-8 items-center justify-center rounded-sm bg-brand hover:underline",
									isMutating && "pointer-events-none opacity-70",
								)}
							>
								{isMutating ? "Updating…" : "Checkout"}
							</a>
						</>
					)}
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
