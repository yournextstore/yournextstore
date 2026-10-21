"use client";

import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { SheetMark } from "@/components/brand-mark";
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
				className="paper flex flex-col gap-0 bg-sheet py-6 pl-8 pr-6 [clip-path:var(--deckle-left)] data-[side=right]:w-full data-[side=right]:border-l-0 data-[side=right]:sm:max-w-[440px]"
			>
				<span className="margin-line left-[3.4rem]" aria-hidden="true" />
				<SheetHeader className="relative flex-row items-start justify-between gap-4 border-b border-dashed border-line p-0 pb-4">
					<div className="min-w-0">
						<SheetTitle className="font-display text-[1.6rem] font-[480] leading-none text-ink">
							Your basket{" "}
							<span className="mono align-middle text-[0.75rem] font-normal text-faint">({itemCount})</span>
						</SheetTitle>
						<SheetDescription className="label-mono mt-2 text-[0.66rem] tracking-[0.18em]">
							the counter · till no. 1
						</SheetDescription>
					</div>
					<SheetClose className="icon-btn" aria-label="Close basket">
						<X className="size-4" strokeWidth={1.75} />
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="relative flex flex-1 flex-col items-center justify-center px-4 text-center">
						<SheetMark className="size-12" />
						<p className="mb-2 mt-4 font-display text-[1.7rem] leading-[1.15] text-ink">
							A blank page, for now.
						</p>
						<p className="mono mb-5 text-[0.72rem] text-faint">nothing rung up yet</p>
						<Link href="/products" onClick={closeCart} className="btn btn-ghost">
							Feel the range <span aria-hidden="true">→</span>
						</Link>
					</div>
				) : (
					<>
						<ScrollArea className="relative -mr-6 min-h-0 flex-1 pr-6">
							<div className="pt-4">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<div className="relative space-y-4 border-t border-dashed border-line pt-4">
							<DiscountCodeField />
							{discount ? (
								<div className="mono space-y-1 text-[0.78rem]">
									<div className="flex items-center justify-between text-dim">
										<span>Subtotal</span>
										<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
									</div>
									<div className="flex items-center justify-between gap-3 text-tag-ok">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								</div>
							) : null}
							<div className="border-y border-dashed border-line py-3">
								<div className="flex items-baseline justify-between gap-4">
									<span className="label-mono tracking-[0.16em]">{discount ? "Total" : "Subtotal"}</span>
									<strong className="font-display text-[1.6rem] font-[480]">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</strong>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="mono mt-1 text-[0.68rem] text-faint">
									{taxBehavior === "inclusive"
										? "delivery worked out at checkout"
										: "delivery and taxes worked out at checkout"}
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
								className={cn("btn btn-primary w-full", isMutating && "pointer-events-none")}
							>
								{isMutating ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										Ringing it up…
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
