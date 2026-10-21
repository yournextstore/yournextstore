"use client";

import { Loader2, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
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

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			{/* The original's header cart dropdown: a floating panel under the header on wide screens,
			    a full-height side panel on phones. */}
			<SheetContent
				hideClose
				className="flex w-full flex-col gap-0 border-l-0 bg-background p-4 sm:inset-y-auto sm:top-24 sm:right-[max(1rem,calc((100vw-72rem)/2+2rem))] sm:h-auto sm:max-h-[calc(100svh-7rem)] sm:w-[24rem] sm:max-w-none sm:rounded-sm sm:border sm:border-shelf"
			>
				<SheetHeader className="relative mb-2 p-0">
					<SheetTitle className="text-center font-serif text-base font-semibold">
						My Shopping Cart
						{itemCount > 0 ? <span className="sr-only"> ({itemCount} items)</span> : null}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<SheetClose
						aria-label="Close cart"
						className="absolute -top-1 right-0 p-1 opacity-75 hover:opacity-100"
					>
						<X aria-hidden="true" className="h-5 w-5" />
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex h-36 flex-col items-center justify-center gap-2">
						<ShoppingCart aria-hidden="true" className="h-12 w-12" strokeWidth={1.25} />
						<p className="text-center">Cart is empty!</p>
					</div>
				) : (
					<div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 sm:max-h-80 sm:flex-none">
						{items.map((item) => (
							<CartItem key={item.productVariant.id} item={item} />
						))}
					</div>
				)}

				<div className="mt-2 space-y-3 border-t border-rule pt-3">
					{items.length > 0 ? <DiscountCodeField /> : null}
					{discount ? (
						<div className="space-y-1 text-sm">
							<div className="flex items-center justify-between">
								<span>Subtotal :</span>
								<span className="tabular-nums">{formatMoney({ amount: subtotal, currency, locale })}</span>
							</div>
							<div className="flex items-center justify-between gap-3 font-medium text-mint-ink">
								<span>Discount :</span>
								<span className="tabular-nums">−{formatMoney({ amount: discount, currency, locale })}</span>
							</div>
						</div>
					) : null}
					<div className="flex items-baseline justify-between">
						<span>Total Price :</span>
						<span className="font-semibold tabular-nums">
							{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
						</span>
					</div>
					<div className="flex items-baseline justify-between gap-4">
						<span>Shipping :</span>
						{/* Tax is already inside the shown total on an inclusive store — promising to
						    "calculate taxes at checkout" there would read as an extra charge to come. */}
						<span className="w-44 text-right text-xs italic text-muted-foreground">
							{taxBehavior === "inclusive"
								? "Shipping fee will be calculated at checkout"
								: "Taxes and shipping fee will be calculated at checkout"}
						</span>
					</div>
					<div className="flex gap-x-2">
						{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
						    different Next.js zone. While a cart write is in flight, block the link: a full
						    navigation now would load /checkout before the item is committed server-side. */}
						{items.length > 0 ? (
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
									"btn-shelf h-9 flex-1 rounded-sm font-normal",
									isMutating && "pointer-events-none opacity-60",
								)}
							>
								{isMutating ? (
									<>
										<Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
										Updating…
									</>
								) : (
									"Checkout"
								)}
							</a>
						) : (
							<span
								aria-disabled="true"
								className="btn-shelf h-9 flex-1 cursor-not-allowed rounded-sm font-normal opacity-70"
							>
								Checkout
							</span>
						)}
						<button type="button" onClick={closeCart} className="btn-outline-shelf h-9 flex-1 rounded-sm">
							Keep Browsing
						</button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
