"use client";

import { Loader2, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button } from "@/components/ui/button";
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
			<SheetContent
				showCloseButton={false}
				className="flex flex-col gap-4 data-[side=right]:w-[88vw] data-[side=right]:sm:max-w-sm"
			>
				<SheetHeader className="gap-1.5 p-4 pb-0">
					<div className="flex items-center justify-between">
						<SheetTitle className="font-semibold">
							Cart
							{itemCount > 0 && (
								<span className="ms-1.5 text-sm font-normal text-muted-foreground">({itemCount})</span>
							)}
						</SheetTitle>
						<SheetClose
							aria-label="Close cart"
							className="-me-2 inline-flex size-8 items-center justify-center rounded-sm opacity-70 transition-opacity hover:text-red-500 hover:opacity-100"
						>
							<X className="size-4" aria-hidden="true" />
						</SheetClose>
					</div>
					<SheetDescription className="text-sm text-muted-foreground">
						Review your items before heading to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-col items-center gap-3 px-4 pt-6 text-center">
						<ShoppingCart className="size-12 text-(--rose)" strokeWidth={1.25} aria-hidden="true" />
						<p className="text-2xl font-bold">Your cart is empty</p>
						<Button variant="outline" onClick={closeCart} className="mt-2">
							Continue shopping
						</Button>
					</div>
				) : (
					<div className="flex min-h-0 grow flex-col px-4">
						<ul className="min-h-0 grow overflow-y-auto">
							{items.map((item) => (
								<CartItem key={itemKey(item)} item={item} />
							))}
						</ul>

						<div className="space-y-3 py-4">
							<DiscountCodeField />
							{discount ? (
								<div className="space-y-1">
									<div className="flex items-center justify-between text-sm text-muted-foreground">
										<span>Subtotal</span>
										<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
									</div>
									<div className="flex items-center justify-between gap-3 text-sm font-medium text-green-700 dark:text-green-400">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								</div>
							) : null}
							<div className="flex items-center justify-between border-b border-border pb-2">
								<p className="text-sm text-muted-foreground">Total</p>
								<p className="text-base">
									{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
								</p>
							</div>
							{/* Tax is already inside the shown subtotal on an inclusive store — promising to
							    "calculate taxes at checkout" there would read as an extra charge to come. */}
							<p className="text-xs text-muted-foreground">
								{taxBehavior === "inclusive"
									? "Shipping calculated at checkout"
									: "Shipping and taxes calculated at checkout"}
							</p>
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
									"inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-(--pink) px-4 text-sm font-medium text-(--pink-foreground) transition-colors hover:bg-(--pink-hover)",
									isMutating && "pointer-events-none opacity-60",
								)}
							>
								{isMutating ? (
									<>
										<Loader2 className="size-4 animate-spin" aria-hidden="true" />
										Updating…
									</>
								) : (
									"Proceed to checkout"
								)}
							</a>
						</div>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
