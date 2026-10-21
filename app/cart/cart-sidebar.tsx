"use client";

import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { Arrow } from "@/components/bakery/arrow";
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
import { buttonClass } from "@/lib/ui";
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
				overlayClassName="bg-background/20 backdrop-blur-md"
				className="flex flex-col gap-0 border-l border-line-soft bg-background p-0 text-foreground data-[side=right]:w-full data-[side=right]:sm:max-w-md"
			>
				<SheetHeader className="flex-row items-center justify-between gap-4 border-b border-line-soft px-6 py-6">
					<SheetTitle className="font-serif text-heading-2xl font-bold text-foreground">
						Your Basket{" "}
						{itemCount > 0 && (
							<span className="font-sans text-body-md font-normal text-muted-foreground">
								({itemCount} {itemCount === 1 ? "item" : "items"})
							</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review the items in your basket and go to checkout.
					</SheetDescription>
					<button
						type="button"
						onClick={closeCart}
						aria-label="Close basket"
						className="-mr-2 rounded-md p-2 text-foreground hover:text-brand-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-hover"
					>
						<X aria-hidden="true" className="h-6 w-6" />
					</button>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
						<p className="font-brand text-heading-3xl text-brand">Still empty.</p>
						<p className="font-sans text-body-md text-muted-foreground">
							Your basket is waiting for something lovely. Have a look around the shop.
						</p>
						<Link href="/products" onClick={closeCart} className={buttonClass({ variant: "secondary" })}>
							<span>See the shop</span>
							<Arrow />
						</Link>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-6">
							<div className="divide-y divide-line-soft">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<div aria-hidden="true" className="relative h-2 w-full shrink-0 overflow-hidden bg-surface">
							<div className="zigzag-edge absolute inset-x-0 -top-px h-full bg-background" />
						</div>
						<SheetFooter className="mt-0 bg-surface px-6 pt-5 pb-6">
							<div className="w-full space-y-4 font-sans">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1">
										<div className="flex items-center justify-between text-body-sm text-muted-foreground">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-body-sm font-bold text-fill">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between font-serif text-heading-xl">
									<span className="font-bold">{discount ? "Total" : "Subtotal"}</span>
									<span className="font-bold text-brand tabular-nums">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-body-xs text-muted-foreground">
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
									className={buttonClass({
										className: cn("w-full", isMutating && "pointer-events-none opacity-60"),
									})}
								>
									{isMutating ? (
										<>
											<Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
											<span>Updating…</span>
										</>
									) : (
										<>
											<span>Checkout</span>
											<Arrow />
										</>
									)}
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="w-full font-sans text-body-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
								>
									Continue shopping
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
