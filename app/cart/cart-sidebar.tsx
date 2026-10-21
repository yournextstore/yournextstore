"use client";

import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
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
				hideClose
				className="flex w-full flex-col gap-0 border-0 bg-sun px-6 pb-7 pt-6 sm:max-w-[440px] sm:rounded-l-3xl"
			>
				<SheetHeader className="flex-row items-center justify-between gap-4 border-b-2 border-ink/15 p-0 pb-5">
					<SheetTitle className="display flex items-baseline gap-2.5 text-[2.6rem] leading-none text-ink">
						Your cart
						<span className="text-lg font-bold tracking-normal text-flame">{itemCount}</span>
					</SheetTitle>
					<SheetDescription className="sr-only">Review your cart and continue to checkout.</SheetDescription>
					<SheetClose
						className="-mr-2 inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/10"
						aria-label="Close cart"
					>
						<X className="size-6" strokeWidth={2.5} aria-hidden="true" />
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
						<p className="display text-[3.4rem] text-flame">
							Still
							<br />
							empty
						</p>
						<p className="mb-7 mt-4 max-w-[26ch] text-lg text-ink">
							Nothing in here yet. Pick a favourite and it will land right here.
						</p>
						<Link href="/products" onClick={closeCart} className="btn">
							Shop now
						</Link>
					</div>
				) : (
					<>
						<ScrollArea className="-mx-6 min-h-0 flex-1 px-6">
							<div className="pt-[18px]">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<div className="space-y-4 border-t-2 border-ink/15 pt-5">
							<DiscountCodeField />
							{discount ? (
								<div className="space-y-1">
									<div className="flex items-center justify-between text-sm text-muted-foreground">
										<span>Subtotal</span>
										<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
									</div>
									<div className="flex items-center justify-between gap-3 text-sm font-medium text-orange">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								</div>
							) : null}
							<div>
								<div className="flex items-center justify-between">
									<span className="text-sm font-bold uppercase tracking-[0.16em] text-ink">
										{discount ? "Total" : "Subtotal"}
									</span>
									<strong className="text-[1.4rem] tabular-nums">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</strong>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="mt-1 text-sm text-ink-soft">
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
								className={cn("btn w-full", isMutating && "pointer-events-none opacity-60")}
							>
								{isMutating ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										Updating…
									</>
								) : (
									<>Checkout</>
								)}
							</a>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
