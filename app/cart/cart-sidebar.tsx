"use client";

import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { XMarkIcon } from "@/components/mandala/icons";
import { useStoreConfig } from "@/components/store-config-provider";
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
	const { cart, isOpen, closeCart, items, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	// The original's slide-over: white panel, "Shopping cart" with a grey cross, bordered thumbnails,
	// subtotal row, indigo Checkout bar and "or Continue shopping →" underneath.
	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				showCloseButton={false}
				className="gap-0 bg-white p-0 shadow-xl data-[side=right]:w-full data-[side=right]:border-l-0 data-[side=right]:sm:max-w-md"
			>
				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6">
					<SheetHeader className="flex-row items-start justify-between gap-3 p-0">
						<SheetTitle className="text-lg font-medium text-[#111827]">Shopping cart</SheetTitle>
						<SheetDescription className="sr-only">
							Review items in your cart and proceed to checkout.
						</SheetDescription>
						<SheetClose
							aria-label="Close panel"
							className="-m-2 flex size-11 shrink-0 items-center justify-center text-[#9ca3af] hover:text-[#6b7280]"
						>
							<XMarkIcon className="size-6" />
						</SheetClose>
					</SheetHeader>

					{items.length === 0 ? (
						<div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
							<p className="text-base font-medium text-[#111827]">Your cart is empty</p>
							<p className="text-sm text-muted-foreground">Add a pair or two and they will show up here.</p>
							<button
								type="button"
								onClick={closeCart}
								className="mt-4 text-sm font-medium text-indigo hover:text-indigo-hover"
							>
								Continue shopping<span aria-hidden> &rarr;</span>
							</button>
						</div>
					) : (
						<ul className="mt-8 divide-y divide-border">
							{items.map((item) => (
								<li key={itemKey(item)}>
									<CartItem item={item} />
								</li>
							))}
						</ul>
					)}
				</div>

				{items.length > 0 ? (
					<div className="shrink-0 border-t border-border px-4 py-6 sm:px-6">
						<DiscountCodeField />
						{discount ? (
							<div className="mt-4 space-y-1">
								<div className="flex items-center justify-between text-sm text-muted-foreground">
									<span>Subtotal</span>
									<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
								</div>
								<div className="flex items-center justify-between gap-3 text-sm font-medium text-green-700">
									<span>Discount</span>
									<span className="tabular-nums">−{formatMoney({ amount: discount, currency, locale })}</span>
								</div>
							</div>
						) : null}
						<div className="mt-4 flex justify-between text-base font-medium text-[#111827]">
							<p>{discount ? "Total" : "Subtotal"}</p>
							<p>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</p>
						</div>
						{/* Tax is already inside the shown subtotal on an inclusive store — promising to
						    "calculate taxes at checkout" there would read as an extra charge to come. */}
						<p className="mt-1 text-sm text-muted-foreground">
							{taxBehavior === "inclusive"
								? "Shipping will be calculated at checkout."
								: "Shipping and taxes will be calculated at checkout."}
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
								"mt-6 flex h-12 items-center justify-center gap-2 bg-indigo px-6 text-base font-medium text-white shadow-xs transition-colors hover:bg-indigo-hover",
								isMutating && "pointer-events-none opacity-60",
							)}
						>
							{isMutating ? (
								<>
									<Loader2 aria-hidden className="size-4 animate-spin" />
									Updating…
								</>
							) : (
								"Checkout"
							)}
						</a>
						<p className="mt-6 text-center text-sm text-muted-foreground">
							or{" "}
							<button
								type="button"
								onClick={closeCart}
								className="font-medium text-indigo hover:text-indigo-hover"
							>
								Continue shopping<span aria-hidden> &rarr;</span>
							</button>
						</p>
					</div>
				) : null}
			</SheetContent>
		</Sheet>
	);
}
