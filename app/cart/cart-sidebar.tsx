"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/**
 * The original's bag: a full-screen ecru sheet that drops over the page, "Shopping Bag" and
 * "Close" across the top, large photographed lines, and one total-and-check-out row at the foot.
 */
export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";
	const total = subtotal - (discount ?? 0n);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-12 data-[state=open]:slide-in-from-top-12 fixed inset-0 z-50 overflow-y-auto bg-ecru text-ink duration-300 focus:outline-none">
					<div className="shell flex min-h-full flex-col justify-between md:px-4 lg:px-5">
						<div>
							<div className="flex items-center justify-between py-3 md:py-4 lg:py-5">
								<DialogPrimitive.Title className="text-lg font-normal md:text-xl">
									Shopping Bag
								</DialogPrimitive.Title>
								<DialogPrimitive.Close className="-mr-1 inline-flex min-h-6 items-center p-1 leading-none hover:italic">
									Close
								</DialogPrimitive.Close>
							</div>
							<DialogPrimitive.Description className="sr-only">
								Review the items in your bag and check out.
							</DialogPrimitive.Description>

							{items.map((item) => (
								<CartItem key={item.productVariant.id} item={item} />
							))}
						</div>

						{items.length === 0 ? (
							<div className="flex flex-1 flex-col justify-end gap-4 py-3 md:py-4 lg:py-5">
								<p className="font-serif text-3xl italic md:text-5xl">Your bag is empty.</p>
								<p>
									<button
										type="button"
										onClick={closeCart}
										className="text-lg underline underline-offset-4 hover:italic md:text-xl"
									>
										Keep shopping
									</button>
								</p>
							</div>
						) : (
							<div className="space-y-4 py-3 md:py-4 lg:py-5">
								<div className="max-w-md">
									<DiscountCodeField />
								</div>
								<div className="flex flex-wrap items-center justify-between gap-3">
									<div>
										<p className="text-lg md:text-xl">
											Total: {formatMoney({ amount: total, currency, locale })}, {itemCount}{" "}
											{itemCount === 1 ? "item" : "items"}
										</p>
										<p className="text-sm text-muted-foreground">
											{discount
												? `Includes ${formatMoney({ amount: discount, currency, locale })} off. `
												: ""}
											{taxBehavior === "inclusive"
												? "Shipping calculated at checkout."
												: "Shipping and taxes calculated at checkout."}
										</p>
									</div>
									{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
									    different Next.js zone. While a cart write is in flight, block the link so
									    checkout never loads before the item is committed server-side. */}
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
											"rounded bg-white-rock px-1.5 py-0.5 text-lg leading-normal transition hover:rounded-none md:px-3.5 md:text-xl",
											isMutating && "pointer-events-none opacity-60",
										)}
									>
										{isMutating ? "Updating…" : "Check Out"}
									</a>
								</div>
							</div>
						)}
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
