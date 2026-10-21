"use client";

import { Loader2, ShoppingBag, XIcon } from "lucide-react";
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

export function CartSidebar({ freeShippingThreshold = null }: { freeShippingThreshold?: number | null }) {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const total = subtotal - (discount ?? 0n);
	const threshold = freeShippingThreshold ? BigInt(freeShippingThreshold) : null;

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				showCloseButton={false}
				className="flex flex-col gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-[490px]"
			>
				<SheetHeader className="flex-row items-start justify-between gap-4 border-b border-gray-300 p-4">
					<div>
						<SheetTitle className="text-fc-md font-semibold text-gray-800">Shop Cart</SheetTitle>
						<SheetDescription className="text-fc-base text-gray-600">
							{itemCount > 0
								? `${itemCount} ${itemCount === 1 ? "item" : "items"} in your basket`
								: "Your basket is empty"}
						</SheetDescription>
					</div>
					<SheetClose
						className="-m-1 p-1 text-gray-700 transition hover:text-gray-900"
						aria-label="Close cart"
					>
						<XIcon className="size-6" />
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
						<ShoppingBag className="size-12 text-green-500" strokeWidth={1.5} aria-hidden />
						<div>
							<p className="text-fc-md text-gray-800">Your cart is empty</p>
							<p className="mt-1">Add some products to get started.</p>
						</div>
						<button type="button" onClick={closeCart} className="fc-btn fc-btn-green">
							Continue Shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<div className="p-4">
								{threshold ? (
									<p role="status" className="mb-3 rounded-lg bg-red-500/25 p-4 text-red-800">
										{total >= threshold ? (
											<>You&rsquo;ve got FREE delivery. Start checkout now!</>
										) : (
											<>Add {fmt(threshold - total)} more to get FREE delivery.</>
										)}
									</p>
								) : null}
								<ul className="border-b border-gray-300">
									{items.map((item) => (
										<CartItem key={itemKey(item)} item={item} />
									))}
								</ul>
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto gap-4 border-t border-gray-300 p-4">
							<DiscountCodeField />
							<div className="space-y-1">
								{discount ? (
									<>
										<div className="flex items-center justify-between">
											<span>Subtotal</span>
											<span className="tabular-nums">{fmt(subtotal)}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-green-700">
											<span>Discount</span>
											<span className="tabular-nums">−{fmt(discount)}</span>
										</div>
									</>
								) : null}
								<div className="flex items-center justify-between text-fc-md">
									<span className="font-semibold text-gray-800">{discount ? "Total" : "Subtotal"}</span>
									<span className="font-bold text-gray-900 tabular-nums">{fmt(total)}</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-fc-sm">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout"
										: "Shipping and taxes calculated at checkout"}
								</p>
							</div>
							<div className="flex justify-between gap-3">
								<button type="button" onClick={closeCart} className="fc-btn fc-btn-green">
									Continue Shopping
								</button>
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
									className={cn("fc-btn fc-btn-dark", isMutating && "pointer-events-none opacity-60")}
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
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
