"use client";

import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { EmptyBasket } from "@/components/gf/icons";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { gfGreenPill, gfIconButton } from "@/lib/gf-styles";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

// The original folds long carts after three lines behind a "Show N more" rule.
const SHOW_DEFAULT_ITEMS = 3;

/** The Grofresh cart screen as a bottom sheet in the app column. */
export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();
	const [showAll, setShowAll] = useState(false);
	const discount = cartDiscountOf(cart, taxBehavior);
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";
	const visible = showAll ? items : items.slice(0, SHOW_DEFAULT_ITEMS);
	const hidden = items.length - SHOW_DEFAULT_ITEMS;

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				side="bottom"
				hideClose
				className="mx-auto block max-h-[92svh] w-full max-w-[40rem] overflow-y-auto rounded-t-[30px] border-0 px-6 pt-6 pb-8"
			>
				<div className="flex items-center gap-3">
					<span className="size-[50px] shrink-0" />
					<SheetTitle className="flex-1 text-center text-gf-h3 font-bold">Cart</SheetTitle>
					<SheetClose className={gfIconButton} aria-label="Close cart">
						<X className="size-5" />
					</SheetClose>
				</div>
				<SheetDescription className="sr-only">
					Review items in your cart and proceed to checkout.
				</SheetDescription>

				<p className="mt-[22px] text-gf-h4 font-bold">
					{itemCount} {itemCount === 1 ? "item" : "items"} here
				</p>

				{items.length === 0 ? (
					<div className="flex flex-col items-center py-8">
						<EmptyBasket />
						<p className="mt-4 text-gf-h5 text-muted-foreground">Your cart is empty</p>
						<button
							type="button"
							onClick={closeCart}
							className={cn(gfGreenPill, "mt-6 h-[50px] w-auto px-8")}
						>
							Browse the catalog
						</button>
					</div>
				) : (
					<>
						<ul className="mt-[18px] flex flex-col gap-2.5">
							{visible.map((item) => (
								<li key={item.productVariant.id}>
									<CartItem item={item} />
								</li>
							))}
						</ul>

						{hidden > 0 && (
							<button
								type="button"
								onClick={() => setShowAll((value) => !value)}
								className="mt-[22px] flex w-full items-center gap-[18px] text-gf-sm"
							>
								<span aria-hidden="true" className="h-px flex-1 bg-light-silver" />
								<span className="shrink-0">{showAll ? "Less items" : `Show ${hidden} more`}</span>
								<span aria-hidden="true" className="h-px flex-1 bg-light-silver" />
							</button>
						)}

						<div className="mt-6">
							<DiscountCodeField />
						</div>

						<div className="mt-6 flex flex-col gap-[5px]">
							{discount ? <p className="text-gf-h6 text-green-500">Discount −{fmt(discount)}</p> : null}
							<p className="text-gf-h3 font-bold">Total : {fmt(subtotal - (discount ?? 0n))}</p>
							{/* Tax is already inside the shown total on an inclusive store — promising to
							    "calculate taxes at checkout" there would read as an extra charge to come. */}
							<p className="text-gf-h6">
								{taxBehavior === "inclusive"
									? "Shipping calculated at checkout"
									: "Shipping and taxes calculated at checkout"}
							</p>
						</div>

						{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
						    different Next.js zone. While a cart write is in flight, block the link: a
						    full navigation now would load /checkout before the item is committed. */}
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
								gfGreenPill,
								"mt-[19px] h-[65px]",
								isMutating && "pointer-events-none opacity-60",
							)}
						>
							{isMutating ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									Updating…
								</>
							) : (
								"Proceed to checkout"
							)}
						</a>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
