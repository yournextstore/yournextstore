"use client";

import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { IconClose, LeafGlyph } from "@/components/garden/icons";
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
				className="gap-0 border-[var(--line-2)] bg-[var(--paper)] p-0 shadow-[-30px_0_70px_-50px_rgba(40,30,16,0.8)] data-[side=right]:w-full data-[side=right]:sm:max-w-[420px]"
			>
				<div className="panel__head">
					<SheetTitle className="panel__title font-normal">
						Your Basket
						{itemCount > 0 && (
							<span className="ml-2 font-sans text-sm text-[var(--ink-3)]">
								({itemCount} {itemCount === 1 ? "item" : "items"})
							</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your basket and proceed to checkout.
					</SheetDescription>
					<SheetClose className="close-x" aria-label="Close basket">
						<IconClose className="h-[18px] w-[18px]" />
					</SheetClose>
				</div>

				{items.length === 0 ? (
					<div className="panel__body">
						<div className="panel-empty">
							<LeafGlyph width={18} height={18} />
							<p className="hand text-[1.4rem]">Your basket is empty.</p>
							<p className="text-sm">Have a look around the shop.</p>
							<button type="button" className="btn btn-ghost btn-sm mt-5" onClick={closeCart}>
								Browse the collection
							</button>
						</div>
					</div>
				) : (
					<>
						<div className="panel__body">
							{items.map((item) => (
								<CartItem key={itemKey(item)} item={item} />
							))}
						</div>

						<div className="panel__foot">
							<DiscountCodeField />
							<div className="mt-4">
								<div className="sum-row">
									<span>Subtotal</span>
									<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
								</div>
								{discount ? (
									<div className="sum-row text-[var(--forest)]">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								) : null}
								<div className="sum-row text-[var(--ink-3)]">
									<span>Shipping</span>
									<span>Calculated at checkout</span>
								</div>
								<div className="sum-row sum-row--total">
									<span>Total</span>
									<span>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</span>
								</div>
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
								className={cn("btn mt-4 w-full", isMutating && "pointer-events-none opacity-60")}
							>
								{isMutating ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Updating…
									</>
								) : (
									<>
										Checkout <span className="arw">&rarr;</span>
									</>
								)}
							</a>
							{/* Tax is already inside the shown subtotal on an inclusive store — promising to
							    "calculate taxes at checkout" there would read as an extra charge to come. */}
							<p className="panel-note">
								{taxBehavior === "inclusive" ? "Taxes included." : "Taxes calculated at checkout."}
							</p>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
