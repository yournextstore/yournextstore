"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { getLineItemUnitPrice, useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
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
			<SheetContent className="flex w-full flex-col gap-0 overflow-y-auto border-0 bg-background sm:max-w-md">
				<SheetHeader className="px-5 pt-5 pb-2">
					<SheetTitle className="text-2xl font-bold">Bag{itemCount > 0 ? ` (${itemCount})` : ""}</SheetTitle>
					<SheetDescription className="sr-only">Review the items in your bag and check out.</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-12">
						<EmptyBag />
						<div className="text-center">
							<p className="text-2xl font-bold">Hey, it feels so light!</p>
							<p className="text-sm text-muted-foreground">
								There&apos;s nothing in your bag. Let&apos;s add some items.
							</p>
						</div>
						<Link href="/products" onClick={closeCart} className="btn-rounded-secondary mt-5 text-sm">
							Explore
						</Link>
					</div>
				) : (
					<>
						<div className="shrink-0 space-y-2 px-5 pb-2">
							{items.map((item) => (
								<CartItem key={item.productVariant.id} item={item} />
							))}
						</div>

						<SheetFooter className="mt-auto shrink-0 p-5 pt-3">
							<section className="flex w-full flex-col gap-4 rounded-md bg-white/70 p-5 shadow-sm">
								<h2 className="text-xl">Price Details</h2>
								<ul className="space-y-1">
									{items.map((item) => (
										<li key={item.productVariant.id} className="flex justify-between gap-3">
											<span className="min-w-0 flex-1 text-gray-600">
												{item.productVariant.product.name} ({item.quantity}) item
											</span>
											<span className="text-lg">
												{formatMoney({
													amount: getLineItemUnitPrice(item, taxBehavior) * BigInt(item.quantity),
													currency,
													locale,
												})}
											</span>
										</li>
									))}
								</ul>
								<DiscountCodeField />
								{discount ? (
									<div className="flex items-center justify-between gap-3 text-sm font-medium text-green-700">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								) : null}
								<hr />
								<div className="flex items-center justify-between">
									<p className="text-gray-600">Total</p>
									<p className="text-2xl">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</p>
								</div>
								{/* Tax is already inside the shown total on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="-mt-2 text-xs text-muted-foreground">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout"
										: "Shipping and taxes calculated at checkout"}
								</p>
								{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
								    different Next.js zone. A soft RSC nav 500s the cross-zone request.
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
										"btn-rounded-primary self-start py-2",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" aria-hidden />
											Updating…
										</>
									) : (
										"Proceed to Checkout"
									)}
								</a>
							</section>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}

/** The original's empty-bag sticker: a tilted yellow shopping bag, drawn here as SVG. */
function EmptyBag() {
	return (
		<svg viewBox="0 0 120 140" className="mt-5 h-36 -rotate-12 drop-shadow-lg" aria-hidden>
			<path
				d="M38 44 C38 18 82 18 82 44"
				fill="none"
				stroke="#3f3f46"
				strokeWidth="4"
				strokeLinecap="round"
			/>
			<path
				d="M14 40 L106 40 L98 128 L22 128 Z"
				fill="#fde047"
				stroke="#3f3f46"
				strokeWidth="4"
				strokeLinejoin="round"
			/>
			<path d="M24 108 L96 108 L95 126 L23 126 Z" fill="#facc15" />
			<path d="M24 108 L96 108" stroke="#3f3f46" strokeWidth="3" strokeLinecap="round" />
			<circle cx="38" cy="54" r="4" fill="none" stroke="#3f3f46" strokeWidth="3" />
			<circle cx="82" cy="54" r="4" fill="none" stroke="#3f3f46" strokeWidth="3" />
			<path d="M88 46 L100 44" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
		</svg>
	);
}
