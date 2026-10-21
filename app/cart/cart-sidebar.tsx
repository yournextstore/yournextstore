"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/**
 * Photon's cart: not a drawer but the whole viewport turned to white paper, lines laid out in
 * the same edge-to-edge grid as the shop, totals flush right, "Close" where "Cart" was.
 */
export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<SheetPrimitive.Root open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetPrimitive.Portal>
				<SheetPrimitive.Content
					className="fixed inset-0 z-50 overflow-y-auto bg-white text-black data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
					aria-describedby={undefined}
				>
					<div className="photon-inset flex h-10 items-center justify-between">
						<SheetPrimitive.Title className="inline-flex items-center">
							Cart{itemCount > 0 ? ` ${itemCount}` : ""}
						</SheetPrimitive.Title>
						<SheetPrimitive.Close className="inline-flex h-6 cursor-pointer items-center hover:underline">
							Close
						</SheetPrimitive.Close>
					</div>

					{items.length === 0 ? (
						<div className="photon-inset py-[calc(var(--main-padding)*2)]">
							<p>Your cart is empty.</p>
							<button
								type="button"
								onClick={closeCart}
								className="mt-2 inline-flex h-6 cursor-pointer items-center underline"
							>
								Continue shopping
							</button>
						</div>
					) : (
						<>
							<ul className="photon-grid py-[calc(var(--main-padding)*2)]">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</ul>

							<div className="ml-auto flex max-w-sm flex-col gap-3 px-[var(--main-gap)] py-[calc(var(--main-padding)*2)] text-right">
								<DiscountCodeField />
								<div className="grid grid-cols-[1fr_auto] gap-x-4">
									{discount ? (
										<>
											<span>Subtotal</span>
											<span className="tabular-nums">
												{formatMoney({ amount: subtotal, currency, locale })}
											</span>
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</>
									) : null}
									<p className="col-span-2 text-muted-foreground">
										{taxBehavior === "inclusive"
											? "Shipping calculated at checkout"
											: "Shipping and taxes calculated at checkout"}
									</p>
									<span>Total</span>
									<span className="tabular-nums">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Plain <a>, never <Link>: /checkout is proxied to another Next.js zone. Blocked
								    while a cart write is in flight, or checkout would load before the item lands. */}
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
										"flex h-10 items-center justify-between bg-black px-[1ch] text-white",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									<span>{isMutating ? "Updating…" : "Proceed to Checkout"}</span>
									<span aria-hidden>↗</span>
								</a>
							</div>
						</>
					)}
				</SheetPrimitive.Content>
			</SheetPrimitive.Portal>
		</SheetPrimitive.Root>
	);
}
