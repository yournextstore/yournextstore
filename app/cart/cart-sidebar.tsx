"use client";

import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
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

	// The original's cart: an inverted ink drawer — "YOUR CART 2 / DONE", ruled line items,
	// a subtotal row and one big paper pill to checkout.
	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				showCloseButton={false}
				className="hull-inverted flex flex-col gap-0 border-l border-border p-0 text-foreground shadow-none data-[side=right]:w-full data-[side=right]:sm:max-w-[42rem]"
			>
				<SheetHeader className="relative flex-row items-center gap-0 px-4 py-3 after:absolute after:inset-x-0 after:bottom-0 after:border-t after:border-border md:px-8 md:py-6">
					<SheetTitle className="mr-auto flex h-12 items-center text-nav font-semibold uppercase">
						Your Cart <span className="ml-2 opacity-60">{itemCount}</span>
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<SheetClose className="-mr-2 cursor-pointer p-2 text-nav font-semibold uppercase">Done</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="my-auto px-4 pb-28 text-center">
						<p className="text-body">Your cart is empty</p>
						<button type="button" onClick={closeCart} className="hull-btn mt-6">
							Keep shopping
						</button>
					</div>
				) : (
					<>
						<div className="flex-1 overflow-y-auto p-4 md:p-8">
							{items.map((item) => (
								<CartItem key={itemKey(item)} item={item} />
							))}
						</div>

						<div className="relative px-4 pb-4 md:px-8 md:pb-8">
							<div className="mb-4 border-t border-border pt-4">
								<DiscountCodeField />
							</div>
							{discount ? (
								<div className="flex justify-between border-t border-border px-4 pt-4 text-body">
									<span>Discount</span>
									<span className="tabular-nums">−{formatMoney({ amount: discount, currency, locale })}</span>
								</div>
							) : null}
							<div className="flex justify-between border-t border-border px-4 py-4 text-body font-semibold md:py-8">
								<span>{discount ? "Total" : "Subtotal"}</span>
								<span className="tabular-nums">
									{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
								</span>
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
									"hull-btn hull-btn-primary hull-btn-large flex w-full",
									isMutating && "pointer-events-none",
								)}
							>
								{isMutating ? (
									<>
										<Loader2 className="h-5 w-5 animate-spin" />
										Updating…
									</>
								) : (
									"Checkout"
								)}
							</a>
							{/* Tax is already inside the shown subtotal on an inclusive store — promising to
							    "calculate taxes at checkout" there would read as an extra charge to come. */}
							<p className="mt-4 text-center text-micro font-semibold md:text-nav">
								{taxBehavior === "inclusive"
									? "Shipping calculated at checkout"
									: "Shipping and taxes calculated at checkout"}
							</p>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
