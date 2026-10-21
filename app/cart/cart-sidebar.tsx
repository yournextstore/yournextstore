"use client";

import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { WaveMark } from "@/components/brand-mark";
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
				className="flex flex-col gap-0 border-0 border-l border-line bg-foam px-6 pb-7 pt-6 data-[side=right]:w-full data-[side=right]:sm:max-w-[430px]"
			>
				<SheetHeader className="flex-row items-center justify-between gap-4 border-b border-line p-0 pb-5">
					<div>
						<p className="kicker mb-2 text-[0.66rem]">[ The bag ]</p>
						<SheetTitle className="display flex items-baseline gap-2 text-[2.4rem] font-normal leading-none text-ink">
							Your bag
							<span className="mono text-[0.8rem] tracking-normal text-faint">({itemCount})</span>
						</SheetTitle>
					</div>
					<SheetDescription className="sr-only">Review your bag and continue to checkout.</SheetDescription>
					<SheetClose
						className="-mr-2 inline-flex size-10 items-center justify-center text-ink transition-colors hover:text-denim-deep"
						aria-label="Close bag"
					>
						<X className="size-6" strokeWidth={1.75} aria-hidden="true" />
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
						<WaveMark className="size-14 text-denim" />
						<p className="display mb-2 mt-4 text-[2.4rem] leading-[0.95] text-ink">
							Flat calm. <span className="text-coral-deep">Nothing yet.</span>
						</p>
						<p className="label-mono mb-6 text-faint">the bag is waiting for the next wave</p>
						<Link href="/products" onClick={closeCart} className="btn">
							See the goods
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
									<div className="flex items-center justify-between text-sm text-muted-foreground">
										<span>Subtotal</span>
										<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
									</div>
									<div className="flex items-center justify-between gap-3 text-sm font-medium text-coral-text">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								</div>
							) : null}
							<div>
								<div className="flex items-center justify-between">
									<span className="label-mono tracking-[0.2em] text-denim-deep">
										{discount ? "Total" : "Subtotal"}
									</span>
									<strong className="mono text-[1.15rem] tabular-nums">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</strong>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="label-mono mt-2 text-[0.62rem] tracking-[0.1em] text-faint">
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
									<>
										Continue to checkout <span aria-hidden="true">→</span>
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
