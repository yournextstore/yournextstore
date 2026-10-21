"use client";

import { ArrowRightIcon, Loader2, XIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/** GoCart's "My Cart" page as a drawer: item rows on top, the bordered Payment Summary card below. */
export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				showCloseButton={false}
				className="block overflow-y-auto p-0 text-slate-800 data-[side=right]:w-full data-[side=right]:sm:max-w-md"
			>
				<div className="flex items-start justify-between gap-4 px-6 pt-6">
					<div>
						<SheetTitle className="text-2xl font-semibold text-slate-800">My Cart</SheetTitle>
						<SheetDescription className="text-base text-slate-600">
							{itemCount} {itemCount === 1 ? "item" : "items"} in your cart
						</SheetDescription>
					</div>
					<SheetClose className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200">
						<XIcon className="size-4" aria-hidden />
						<span className="sr-only">Close</span>
					</SheetClose>
				</div>

				{items.length === 0 ? (
					<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
						<p className="text-2xl font-semibold text-slate-400">Your cart is empty</p>
						<button
							type="button"
							onClick={closeCart}
							className="flex items-center gap-1 text-sm text-go-green-ink hover:gap-2"
						>
							Start shopping <ArrowRightIcon className="size-3.5" aria-hidden />
						</button>
					</div>
				) : (
					<>
						<div className="px-6">
							<button
								type="button"
								onClick={closeCart}
								className="flex items-center gap-1 text-sm text-go-green-ink hover:gap-2"
							>
								Add more <ArrowRightIcon className="size-3.5" aria-hidden />
							</button>
							<div className="mt-4 divide-y divide-slate-100">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</div>

						<div className="m-6 rounded-xl border border-slate-200 bg-slate-50/30 p-6 text-sm text-slate-600">
							<h2 className="text-xl font-medium text-slate-700">Payment Summary</h2>
							<div className="mt-4 border-y border-slate-200 py-4">
								<DiscountCodeField />
							</div>
							<dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-slate-200 py-4">
								<dt className="text-slate-600">Subtotal:</dt>
								<dd className="text-right font-medium tabular-nums">{fmt(subtotal)}</dd>
								{discount ? (
									<>
										<dt className="text-go-green-ink">Discount:</dt>
										<dd className="text-right font-medium text-go-green-ink tabular-nums">
											−{fmt(discount)}
										</dd>
									</>
								) : null}
								<dt className="text-slate-600">Shipping:</dt>
								<dd className="text-right font-medium">At checkout</dd>
							</dl>
							<div className="flex justify-between py-4 text-base">
								<p>Total:</p>
								<p className="font-medium text-slate-800 tabular-nums">{fmt(subtotal - (discount ?? 0n))}</p>
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
								className={cn(
									"flex w-full items-center justify-center gap-2 rounded bg-slate-700 py-2.5 text-white transition-all hover:bg-slate-900 active:scale-95",
									isMutating && "pointer-events-none opacity-60",
								)}
							>
								{isMutating ? (
									<>
										<Loader2 className="size-4 animate-spin" aria-hidden />
										Updating…
									</>
								) : (
									"Checkout"
								)}
							</a>
							<p className="mt-3 text-center text-xs text-slate-600">
								{taxBehavior === "inclusive"
									? "Shipping calculated at checkout"
									: "Shipping and taxes calculated at checkout"}
							</p>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
