"use client";

import { Loader2, ShoppingCartIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const ROW = "flex items-center justify-between border-b border-border pb-1";

/**
 * Commerceplate's cart: a 390px panel that hangs from the top right and is only as tall as its
 * contents, with Taxes / Shipping / Total rows over a full-width black checkout button.
 */
export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				hideClose
				className="top-0 bottom-auto block h-auto max-h-svh w-full gap-0 overflow-y-auto rounded-bl-md border-b border-l border-border p-6 text-ink shadow-lg sm:max-w-none md:w-[390px]"
			>
				<div className="flex items-center justify-between pb-5">
					<SheetTitle className="text-lg font-semibold text-ink">Your Cart</SheetTitle>
					<SheetClose aria-label="Close cart" className="text-ink transition-opacity hover:opacity-70">
						<XIcon aria-hidden className="size-6" strokeWidth={2.5} />
					</SheetClose>
				</div>
				<SheetDescription className="sr-only">
					Review items in your cart and proceed to checkout.
				</SheetDescription>
				<div aria-hidden className="absolute top-16 left-0 h-px w-full bg-ink" />

				{items.length === 0 ? (
					<div className="flex flex-col items-center gap-6 pt-12 pb-4 text-center md:pt-16">
						<ShoppingCartIcon aria-hidden className="size-[76px] fill-current" strokeWidth={1.5} />
						<p>Oops. Your bag is empty.</p>
						<Link href="/products" onClick={closeCart} className="cp-btn w-full">
							Don&apos;t Miss Out: Add Product
						</Link>
					</div>
				) : (
					<div className="flex flex-col p-1">
						<ul className="py-4">
							{items.map((item) => (
								<CartItem key={item.productVariant.id} item={item} />
							))}
						</ul>
						<div className="space-y-3 py-4 text-sm text-soft-text">
							<DiscountCodeField />
							<div className={ROW}>
								<p>Subtotal</p>
								<p className="text-base text-ink tabular-nums">{fmt(subtotal)}</p>
							</div>
							{discount ? (
								<div className={ROW}>
									<p>Discount</p>
									<p className="text-base text-green-700 tabular-nums dark:text-green-400">
										−{fmt(discount)}
									</p>
								</div>
							) : null}
							<div className={cn(ROW, "pt-1")}>
								<p>Taxes</p>
								<p className="text-right">
									{taxBehavior === "inclusive" ? "Included" : "Calculated at checkout"}
								</p>
							</div>
							<div className={cn(ROW, "pt-1")}>
								<p>Shipping</p>
								<p className="text-right">Calculated at checkout</p>
							</div>
							<div className={cn(ROW, "pt-1")}>
								<p>Total</p>
								<p className="text-base text-ink tabular-nums">{fmt(subtotal - (discount ?? 0n))}</p>
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
							className={cn(
								"flex w-full items-center justify-center gap-2 rounded-md bg-cta p-3 text-center text-sm font-medium text-cta-foreground transition-opacity hover:opacity-90",
								isMutating && "pointer-events-none opacity-60",
							)}
						>
							{isMutating ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									Updating…
								</>
							) : (
								"Proceed to Checkout"
							)}
						</a>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
