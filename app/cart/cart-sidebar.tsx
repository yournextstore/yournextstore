"use client";

import { Loader2, Lock, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { buttonClass } from "@/components/deckle";
import { useStoreConfig } from "@/components/store-config-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetClose,
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
			<SheetContent
				showCloseButton={false}
				className="flex flex-col gap-0 bg-background p-0 data-[side=right]:w-full data-[side=right]:border-l-0 data-[side=right]:sm:max-w-[30rem]"
			>
				<SheetHeader className="flex-row items-center justify-between gap-4 border-b border-border px-6 py-0">
					<div className="flex min-h-16 items-baseline gap-2">
						<SheetTitle className="self-center text-title-3">Your cart</SheetTitle>
						{itemCount > 0 && (
							<span className="self-center text-sm text-muted-foreground">
								{itemCount === 1 ? "1 item" : `${itemCount} items`}
							</span>
						)}
					</div>
					<SheetClose
						aria-label="Close cart"
						className="-mr-2.5 grid size-11 place-items-center rounded-full transition-colors hover:bg-secondary"
					>
						<X aria-hidden="true" className="size-5" strokeWidth={1.75} />
					</SheetClose>
					<SheetDescription className="sr-only">
						Review the items in your cart and check out.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="grid flex-1 content-center justify-items-center gap-6 px-6 py-12 text-center">
						<span className="grid size-16 place-items-center rounded-full bg-copper-wash text-copper">
							<ShoppingBag aria-hidden="true" className="size-7" strokeWidth={1.75} />
						</span>
						<div className="grid gap-1">
							<p className="text-title-3">Your cart is empty</p>
							<p className="text-sm text-muted-foreground">What you add shows up here, ready to check out.</p>
						</div>
						<button type="button" onClick={closeCart} className={buttonClass("primary", "min-h-12 px-6")}>
							Keep browsing
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-6">
							<ul>
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</ul>
						</ScrollArea>

						<SheetFooter className="mt-auto gap-0 p-4 sm:p-6">
							{/* What the order comes to, on the band's paper, as the original's summary. */}
							<div className="grid w-full gap-4 rounded-frame bg-band p-5 sm:p-6">
								<DiscountCodeField />
								<dl className="grid gap-2 text-[0.9375rem]">
									{discount ? (
										<>
											<div className="flex justify-between gap-4">
												<dt className="text-muted-foreground">Subtotal</dt>
												<dd className="tabular-nums">
													{formatMoney({ amount: subtotal, currency, locale })}
												</dd>
											</div>
											<div className="flex justify-between gap-4">
												<dt className="text-muted-foreground">Discount</dt>
												<dd className="tabular-nums text-copper-ink">
													−{formatMoney({ amount: discount, currency, locale })}
												</dd>
											</div>
										</>
									) : null}
									<div className="mt-1 flex justify-between gap-4 border-t border-input pt-3 text-lg font-semibold">
										<dt>{discount ? "Total" : "Subtotal"}</dt>
										<dd className="tabular-nums">
											{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
										</dd>
									</div>
								</dl>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-[0.8125rem] text-muted-foreground">
									{taxBehavior === "inclusive"
										? "Taxes included. Shipping is worked out at checkout."
										: "Shipping and taxes are worked out at checkout."}
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
									className={buttonClass(
										"primary",
										cn("w-full", isMutating && "pointer-events-none opacity-60"),
									)}
								>
									{isMutating ? (
										<>
											<Loader2 aria-hidden="true" className="size-4 animate-spin" />
											Updating…
										</>
									) : (
										<>
											<Lock aria-hidden="true" className="size-4" />
											Check out
										</>
									)}
								</a>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
