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
				className="gap-0 bg-panel p-0 shadow-drawer duration-[420ms] data-[side=right]:w-full data-[side=right]:border-0 data-[side=right]:sm:max-w-[460px]"
			>
				<SheetHeader className="flex-row items-start justify-between gap-4 p-6 pb-4">
					<SheetTitle className="font-display text-[64px] font-black leading-[0.8]">
						Bag
						{itemCount > 0 && (
							<span className="ml-2 align-top text-[22px] font-extrabold tabular-nums opacity-65">
								{String(itemCount).padStart(2, "0")}
							</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review the pieces in your bag and check out.
					</SheetDescription>
					<SheetClose
						aria-label="Close bag"
						className="press grid size-11 shrink-0 place-items-center rounded-full border border-line transition-colors hover:border-foreground"
					>
						<X className="size-[18px]" aria-hidden="true" />
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-start gap-4 px-6 py-8">
						<p className="font-display text-[44px] leading-[0.9]">Your bag is empty</p>
						<p className="text-muted-foreground">Pieces you add show up here.</p>
						<SheetClose
							nativeButton={false}
							render={
								<Link
									href="/products"
									className="press mt-2 flex h-12 items-center rounded-full border border-foreground px-[22px] font-medium transition-colors hover:bg-foreground hover:text-background"
								/>
							}
						>
							See what&apos;s new
						</SheetClose>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-6">
							<div className="flex flex-col divide-y divide-line border-t border-line">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto gap-0 border-t border-line p-6">
							<div className="flex w-full flex-col gap-4">
								<DiscountCodeField />
								{discount ? (
									<div className="flex flex-col gap-1 text-sm">
										<div className="flex items-center justify-between text-muted-foreground">
											<span>Subtotal</span>
											<span className="tabular-nums">
												{formatMoney({ amount: subtotal, currency, locale })}
											</span>
										</div>
										<div className="flex items-center justify-between gap-3 font-medium">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-baseline justify-between">
									<span className="font-medium">{discount ? "Total" : "Subtotal"}</span>
									<span className="text-[22px] font-medium tabular-nums">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store. */}
								<p className="-mt-2 text-[13px] text-muted-foreground">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout"
										: "Shipping and taxes calculated at checkout"}
								</p>
								{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
								    different Next.js zone. While a cart write is in flight, block the link: a full
								    navigation now would load /checkout before the item is committed. */}
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
										"press flex h-[60px] w-full items-center justify-center gap-2 rounded-full bg-foreground text-base font-semibold text-background transition-colors hover:bg-ink-hover",
										isMutating && "pointer-events-none opacity-65",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="size-4 animate-spin" aria-hidden="true" />
											Updating…
										</>
									) : (
										"Checkout"
									)}
								</a>
								<SheetClose className="text-sm underline underline-offset-[3px]">Keep shopping</SheetClose>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
