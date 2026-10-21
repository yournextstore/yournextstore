"use client";

import { Loader2 } from "lucide-react";
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
				showClose={false}
				className="flex w-full flex-col gap-0 overflow-hidden border-0 sm:max-w-none md:w-[470px] md:rounded-l-xl"
			>
				<SheetHeader className="flex h-header-sm flex-row items-center justify-between px-4 py-0 md:px-8 lg:h-header-lg">
					<SheetTitle className="text-ui-xl font-bold">Cart ({itemCount})</SheetTitle>
					<SheetClose className="-mr-2 p-2 duration-200 hover:opacity-50" aria-label="Close cart">
						<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" />
						</svg>
					</SheetClose>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 pb-24 text-center">
						<p className="text-ui-xl font-bold">Your cart is empty</p>
						<button
							type="button"
							onClick={closeCart}
							className="flex h-10 items-center rounded-full bg-offblack px-4 text-ui-sm font-bold text-white duration-200 hover:opacity-80"
						>
							Continue shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<ul className="px-4 md:px-8">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</ul>
						</ScrollArea>

						<div className="mt-auto text-ui-sm">
							<div className="border-t border-gray px-4 py-4">
								<DiscountCodeField />
							</div>
							<div className="flex justify-between gap-4 border-t border-gray p-4">
								<span className="text-darkgray">Subtotal</span>
								<span className="font-bold">{formatMoney({ amount: subtotal, currency, locale })}</span>
							</div>
							{discount ? (
								<div className="flex justify-between gap-4 border-t border-gray p-4">
									<span className="text-darkgray">Discount</span>
									<span className="font-bold tabular-nums">
										−{formatMoney({ amount: discount, currency, locale })}
									</span>
								</div>
							) : null}
							<div className="flex justify-between gap-4 border-t border-gray p-4">
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<span className="text-darkgray">
									{taxBehavior === "inclusive" ? "Shipping" : "Shipping & taxes"}
								</span>
								<span className="text-right font-bold uppercase">Calculated at checkout</span>
							</div>
							<div className="border-t border-gray p-4">
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
										"flex h-10 w-full items-center justify-center gap-2 rounded-full bg-offblack p-4 font-bold text-white duration-200 hover:opacity-80",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating…
										</>
									) : (
										<>
											Checkout
											<span className="sr-only">
												, total {formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
											</span>
										</>
									)}
								</a>
							</div>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
