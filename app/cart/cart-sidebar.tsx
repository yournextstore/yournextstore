"use client";

import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
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
			<SheetContent className="flex w-full flex-col gap-0 border-l-0 bg-background p-0 shadow-none sm:max-w-[420px]">
				<SheetHeader className="shrink-0 border-b border-border px-5 pt-6 pb-5">
					<SheetTitle className="font-display text-heading-lg font-semibold leading-[1.1]">
						Your cart
					</SheetTitle>
					<SheetDescription className="text-body-sm text-muted-foreground">
						{itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "item" : "items"}` : "Nothing added yet"}
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-start justify-center gap-5 px-5 py-12">
						<p className="font-display text-heading-md font-semibold">Your cart is empty</p>
						<p className="text-body-sm text-muted-foreground">
							Add something you like and it will wait for you here.
						</p>
						<button
							type="button"
							onClick={closeCart}
							className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-body-md font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
						>
							Browse the shop
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-5">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="shrink-0 gap-4 border-t border-border bg-card px-5 pt-5 pb-6">
							<DiscountCodeField />
							<dl className="rounded-card border border-border p-4 text-label-sm text-muted-foreground">
								<div className="flex justify-between gap-4">
									<dt>Subtotal</dt>
									<dd>{formatMoney({ amount: subtotal, currency, locale })}</dd>
								</div>
								{discount ? (
									<div className="mt-2 flex justify-between gap-4 text-primary">
										<dt>Discount</dt>
										<dd className="tabular-nums">−{formatMoney({ amount: discount, currency, locale })}</dd>
									</div>
								) : null}
								<div className="mt-3 flex justify-between gap-4 border-t border-border pt-3 text-body-md font-semibold text-foreground">
									<dt>Total</dt>
									<dd>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</dd>
								</div>
							</dl>
							{/* Tax is already inside the shown subtotal on an inclusive store — promising to
							    "calculate taxes at checkout" there would read as an extra charge to come. */}
							<p className="text-label-sm text-muted-foreground">
								{taxBehavior === "inclusive"
									? "Delivery is calculated at checkout."
									: "Delivery and taxes are calculated at checkout."}
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
									"inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-body-md font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
									isMutating && "pointer-events-none opacity-60",
								)}
							>
								{isMutating ? (
									<>
										<Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
										Updating…
									</>
								) : (
									"Go to checkout"
								)}
							</a>
							<button
								type="button"
								onClick={closeCart}
								className="text-body-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
							>
								Keep browsing
							</button>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
