"use client";

import { Loader2, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";

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
			<SheetContent className="store-sheet cart-sheet" showClose={false}>
				<div className="cart-sheet-heading">
					<SheetTitle>
						Your bag <span className="muted">{itemCount}</span>
					</SheetTitle>
					<SheetClose className="icon-button" aria-label="Close bag">
						<X size={20} aria-hidden />
					</SheetClose>
				</div>
				<SheetDescription className="sr-only">Review your items before checkout.</SheetDescription>

				{items.length === 0 ? (
					<div className="cart-sheet-body">
						<div className="empty-cart">
							<ShoppingBag size={36} strokeWidth={1.25} aria-hidden />
							<h2>Your bag is empty</h2>
							<p className="muted">Find something you will use every day.</p>
							<Link href="/products" className="button primary" onClick={closeCart}>
								Browse the shop
							</Link>
						</div>
					</div>
				) : (
					<>
						<div className="cart-sheet-body">
							<ul className="cart-lines" aria-busy={isMutating}>
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</ul>
						</div>

						<div className="cart-sheet-footer">
							<div className="cart-summary">
								<DiscountCodeField />
								<dl className="checkout-totals">
									<div>
										<dt>Subtotal</dt>
										<dd>{formatMoney({ amount: subtotal, currency, locale })}</dd>
									</div>
									{discount ? (
										<>
											<div className="coupon-line">
												<dt>Discount</dt>
												<dd>−{formatMoney({ amount: discount, currency, locale })}</dd>
											</div>
											<div className="after-coupon">
												<dt>Total</dt>
												<dd>{formatMoney({ amount: subtotal - discount, currency, locale })}</dd>
											</div>
										</>
									) : null}
								</dl>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="muted cart-note">
									{taxBehavior === "inclusive"
										? "Delivery calculated at checkout."
										: "Delivery and taxes calculated at checkout."}
								</p>
								{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
								    different Next.js zone (yns.store). A soft RSC nav 500s the cross-zone request.
								    While a cart write is in flight, block the link: a full navigation now would
								    load /checkout before the item is committed server-side and show an empty cart. */}
								<a
									href={checkoutUrl}
									aria-disabled={isMutating || undefined}
									tabIndex={isMutating ? -1 : undefined}
									onClick={(e) => {
										if (isMutating) {
											e.preventDefault();
										}
									}}
									className="button primary lg"
								>
									{isMutating ? (
										<>
											<Loader2 className="spin" size={16} aria-hidden />
											Checking your bag…
										</>
									) : (
										"Checkout"
									)}
								</a>
							</div>
							<button type="button" onClick={closeCart} className="text-link continue-link">
								Continue shopping
							</button>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
