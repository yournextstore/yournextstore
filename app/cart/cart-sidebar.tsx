"use client";

import { Loader2, Plus, ShoppingBag, X } from "lucide-react";
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
				className="flex flex-col gap-0 p-0 data-[side=right]:w-full data-[side=right]:border-0 data-[side=right]:sm:max-w-[28rem]"
			>
				<SheetHeader className="mx-6 flex-row items-center justify-between gap-4 border-b border-ink/40 px-0 pb-4 pt-5">
					<SheetTitle className="caps flex items-center gap-4 text-base font-semibold text-ink">
						<ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.75} aria-hidden />
						Your bag ({itemCount})
					</SheetTitle>
					<SheetDescription className="sr-only">Review the items in your bag and check out.</SheetDescription>
					<SheetClose
						className="-mr-2 inline-flex size-10 items-center justify-center text-ink"
						aria-label="Close bag"
					>
						<X className="h-6 w-6" strokeWidth={1.5} />
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 px-6 pt-6">
						<p className="text-copy text-plum">Your bag is empty.</p>
						<AddMore onNavigate={closeCart} label="Start shopping" />
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<div className="space-y-4 px-6 pt-4 pb-6">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
								<AddMore onNavigate={closeCart} label="Add more products" />
							</div>
						</ScrollArea>

						<SheetFooter className="mt-0 gap-0 px-6 pb-6 pt-5 shadow-[0_-12px_24px_-12px_rgba(0,0,0,0.08)]">
							<div className="w-full space-y-4">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1 text-copy">
										<div className="flex items-center justify-between text-plum">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 font-semibold text-[#1d6b4f]">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between">
									<span className="caps text-copy font-semibold text-ink">Total</span>
									<span className="text-copy font-semibold text-ink">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-fine text-plum">
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
									className={cn("btn-ink w-full text-base", isMutating && "pointer-events-none")}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating…
										</>
									) : (
										"Checkout"
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

/** Horizon's dashed butter tile that sends the shopper back to the shelf. */
function AddMore({ onNavigate, label }: { onNavigate: () => void; label: string }) {
	return (
		<Link
			href="/products"
			onClick={onNavigate}
			className="mt-4 flex h-32 items-center gap-10 rounded-xl border border-dashed border-[#e2c47c] px-10 transition-colors hover:bg-sand"
		>
			<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-butter text-ink">
				<Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
			</span>
			<span className="text-copy font-semibold text-ink">{label}</span>
		</Link>
	);
}
