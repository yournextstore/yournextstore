"use client";

import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { CloseIcon } from "@/components/njx/icons";
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

export function CartSidebar({ freeShippingNote }: { freeShippingNote?: string | null }) {
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
				hideClose
				className="inset-y-4 right-4 h-auto w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-2xl border border-line bg-paper p-0 shadow-2xl sm:max-w-md"
			>
				<SheetHeader className="flex-row items-center justify-between gap-2 border-b border-line px-6 py-5">
					<SheetTitle className="flex items-center gap-2 font-display text-xl font-bold">
						Your cart
						{itemCount > 0 && (
							<span className="font-sans text-[14px] font-normal text-muted-foreground">
								({itemCount} {itemCount === 1 ? "item" : "items"})
							</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<SheetClose
						className="rounded-md p-2 text-muted-foreground hover:bg-tile hover:text-ink"
						aria-label="Close cart"
					>
						<CloseIcon size={18} />
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
						<p className="text-[15px] text-muted-foreground">
							Your cart is empty.
							<br />
							{freeShippingNote ?? "Good things are one click away."}
						</p>
						<button
							type="button"
							onClick={closeCart}
							className="mt-6 rounded-md border border-ink px-6 py-3 text-[15px] font-semibold hover:bg-tile"
						>
							Keep browsing
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-6">
							<div className="py-2">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<div className="space-y-4 border-t border-line px-6 py-5">
							<DiscountCodeField />
							<div className="space-y-1">
								{discount ? (
									<>
										<div className="flex items-center justify-between text-[14px] text-muted-foreground">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-[14px] font-medium text-pine-ink">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</>
								) : null}
								<div className="flex items-center justify-between text-[15px]">
									<span className="text-muted-foreground">{discount ? "Total" : "Subtotal"}</span>
									<span className="font-semibold">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-[13px] text-muted-foreground">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout."
										: "Shipping and taxes calculated at checkout."}
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
								className={cn(
									"flex w-full items-center justify-center gap-2 rounded-md bg-pine py-3.5 text-[15px] font-semibold text-white hover:bg-pine-deep",
									isMutating && "pointer-events-none opacity-60",
								)}
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
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
