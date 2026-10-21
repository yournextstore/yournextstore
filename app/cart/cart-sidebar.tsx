"use client";

import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { BagIcon, CloseIcon } from "@/components/icons";
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
				className="flex size-full flex-col gap-0 rounded-l-lg border-0 bg-white p-0 sm:max-w-md"
			>
				<SheetHeader className="flex shrink-0 flex-row items-center justify-between p-4 pb-0">
					<SheetTitle className="flex items-center text-lg font-medium text-ink">
						Review your cart
						{isMutating ? <Loader2 className="ml-4 size-4 animate-spin" aria-hidden /> : null}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<SheetClose className="rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100">
						<CloseIcon className="size-4" />
						<span className="sr-only">Close</span>
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-2 text-[21px] text-ink">
						<BagIcon className="mb-6 size-24" />
						<p>Your cart is empty</p>
						<button
							type="button"
							onClick={closeCart}
							className="mt-4 text-sm underline underline-offset-2 hover:no-underline"
						>
							Continue shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<ul className="flex flex-col gap-4 p-4 pt-2">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</ul>
						</ScrollArea>

						<SheetFooter className="shrink-0 border-t border-ink p-4">
							<div className="w-full space-y-4 bg-white text-sm text-neutral-600">
								<DiscountCodeField />
								<div>
									<div className="flex items-center justify-between border-b border-neutral-200 pb-4">
										<p>Subtotal{itemCount > 0 ? ` (${itemCount})` : ""}</p>
										<p className="text-right text-base text-ink">
											{formatMoney({ amount: subtotal, currency, locale })}
										</p>
									</div>
									{discount ? (
										<div className="flex items-center justify-between border-b border-neutral-200 py-4 text-green-700">
											<p>Discount</p>
											<p className="text-right tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</p>
										</div>
									) : null}
									<div className="flex items-center justify-between border-b border-neutral-200 py-4">
										<p>Shipping</p>
										<p className="text-right">Calculated at checkout</p>
									</div>
									<div className="flex items-center justify-between py-4">
										<p>Total</p>
										<p className="text-right text-base text-ink">
											{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
										</p>
									</div>
									{/* Tax is already inside the shown subtotal on an inclusive store. */}
									{taxBehavior !== "inclusive" && (
										<p className="pb-4 text-xs">Taxes calculated at checkout</p>
									)}
									{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
									    different Next.js zone. While a cart write is in flight, block the link: a full
									    navigation now would load /checkout before the item is committed server-side. */}
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
											"inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-secondary px-8 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white",
											isMutating && "pointer-events-none opacity-60",
										)}
									>
										{isMutating ? (
											<>
												<Loader2 className="size-4 animate-spin" />
												Updating…
											</>
										) : (
											"Proceed to Checkout"
										)}
									</a>
								</div>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
