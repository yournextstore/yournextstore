"use client";

import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
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
				className="flex flex-col gap-0 border-l border-line bg-page px-6 pb-7 pt-6 data-[side=right]:w-full data-[side=right]:sm:max-w-[440px]"
			>
				<SheetHeader className="flex-row items-center justify-between gap-4 border-b border-line p-0 pb-5">
					<div>
						<p className="kicker mb-2">The current account</p>
						<SheetTitle className="serif flex items-baseline gap-2.5 text-[2.1rem] font-medium leading-none text-cream">
							Your cart
							<span className="mono text-[0.78rem] font-normal tracking-[0.06em] text-gold-2">
								({itemCount})
							</span>
						</SheetTitle>
					</div>
					<SheetDescription className="sr-only">Review your cart and continue to checkout.</SheetDescription>
					<SheetClose
						className="-mr-2 inline-flex size-10 items-center justify-center text-cream transition-colors hover:text-gold-2"
						aria-label="Close cart"
					>
						<X className="size-6" strokeWidth={1.75} />
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
						<p className="serif mb-6 text-[1.9rem] leading-[1.2] text-cream">
							The page is open, <em className="text-gold italic">the page is blank.</em>
						</p>
						<Link href="/products" onClick={closeCart} className="btn">
							Read the ledger <span aria-hidden="true">→</span>
						</Link>
					</div>
				) : (
					<>
						<ScrollArea className="-mx-6 min-h-0 flex-1 px-6">
							<div className="pt-[18px]">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<div className="space-y-4 border-t border-line pt-5">
							<DiscountCodeField />
							{discount ? (
								<div className="space-y-1">
									<div className="flex items-center justify-between text-sm text-dim">
										<span>Subtotal</span>
										<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
									</div>
									<div className="flex items-center justify-between gap-3 text-sm font-medium text-gold-2">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								</div>
							) : null}
							<div>
								<div className="flex items-center justify-between">
									<span className="ledger text-[0.66rem] tracking-[0.2em] text-faint">
										{discount ? "Total" : "Subtotal"}
									</span>
									<strong className="serif text-[1.9rem] font-medium leading-none text-cream">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</strong>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="mt-2 text-[0.75rem] text-dim">
									{taxBehavior === "inclusive"
										? "Delivery calculated at checkout"
										: "Delivery and taxes calculated at checkout"}
								</p>
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
								className={cn("btn btn-primary w-full", isMutating && "pointer-events-none opacity-60")}
							>
								{isMutating ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										Updating…
									</>
								) : (
									<>
										Proceed to checkout <span aria-hidden="true">→</span>
									</>
								)}
							</a>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
