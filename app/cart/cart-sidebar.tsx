"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { DrawerShell } from "@/components/maison/drawer-shell";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/** The acquisition bag: the original's printed drawer, with a real checkout at the end. */
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
		<Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<DrawerShell
				kicker="Acquisition bag"
				title="Your bag"
				description="Review the pieces in your bag and proceed to checkout."
			>
				{items.length === 0 ? (
					<div className="flex flex-col items-start gap-5">
						<p className="py-4 text-[14px] leading-[1.7] text-dim">
							The bag is empty. Add a piece and it will wait for you here.
						</p>
						<Link href="/products" onClick={closeCart} className="link-rule text-acc">
							Browse the archive
						</Link>
					</div>
				) : (
					<>
						<ul className="flex flex-col">
							{items.map((item) => (
								<CartItem key={itemKey(item)} item={item} />
							))}
						</ul>

						<div className="flex flex-col gap-[18px] border-t border-rule pt-[18px]">
							<DiscountCodeField />
							{discount ? (
								<div className="flex flex-col gap-1.5 font-mono text-[12px] text-soft">
									<div className="flex justify-between">
										<span>Subtotal</span>
										<span>{fmt(subtotal)}</span>
									</div>
									<div className="flex justify-between text-acc">
										<span>Discount</span>
										<span>−{fmt(discount)}</span>
									</div>
								</div>
							) : null}
							<div className="flex flex-wrap items-center gap-x-4 gap-y-3">
								<span className="eti text-faint">{discount ? "Total" : "Subtotal"}</span>
								<span className="flex-1" />
								<span className="font-mono text-[17px]">{fmt(subtotal - (discount ?? BigInt(0)))}</span>
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
									"btn-keeper flex items-center justify-center gap-2 px-5 py-3.5 text-center",
									isMutating && "pointer-events-none",
								)}
							>
								{isMutating ? (
									<>
										<Loader2 aria-hidden className="size-3.5 animate-spin" />
										Updating the bag
									</>
								) : (
									"Proceed to checkout"
								)}
							</a>
							{/* Tax is already inside the shown subtotal on an inclusive store. */}
							<p className="text-[12.5px] leading-[1.7] text-dim">
								{taxBehavior === "inclusive"
									? "Taxes included. Shipping is calculated at checkout."
									: "Shipping and taxes are calculated at checkout."}
							</p>
						</div>
					</>
				)}
			</DrawerShell>
		</Dialog.Root>
	);
}
