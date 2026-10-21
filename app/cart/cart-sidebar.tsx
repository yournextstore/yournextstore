"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/** Cart as a popup: a centred white card over the near-black blurred overlay (the quick-view language). */
export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<SheetPrimitive.Root open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetPrimitive.Portal>
				<SheetPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/[.92] backdrop-blur-[5px] data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0" />
				<SheetPrimitive.Popup className="light-section fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-5rem)] w-[calc(100%-2.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden text-foreground outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-2 data-open:duration-300">
					<div className="flex shrink-0 items-center justify-between gap-4 py-7 pr-[68px] pl-6 sm:pl-8">
						<SheetPrimitive.Title className="text-[15px] font-semibold uppercase tracking-[0.24em]">
							Shopping cart
							{itemCount > 0 && (
								<span className="ml-2 font-normal tracking-normal text-muted-foreground">({itemCount})</span>
							)}
						</SheetPrimitive.Title>
						<SheetPrimitive.Description className="sr-only">
							Review items in your cart and proceed to checkout.
						</SheetPrimitive.Description>
						<SheetPrimitive.Close
							className="absolute top-0 right-0 z-10 grid h-[52px] w-[52px] place-items-center bg-black text-white transition hover:bg-[#333]"
							aria-label="Close cart"
						>
							<svg
								aria-hidden
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							>
								<path d="M6 6l12 12M18 6L6 18" />
							</svg>
						</SheetPrimitive.Close>
					</div>

					<div className="min-h-0 flex-1 overflow-y-auto px-6 sm:px-8">
						{items.length === 0 ? (
							<div className="py-16 text-center">
								<p className="text-[15px] text-muted-foreground">
									Your cart is empty.
									<br />
									The shop is fully open.
								</p>
								<button
									type="button"
									onClick={closeCart}
									className="mt-6 border border-foreground/30 px-8 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition hover:border-foreground"
								>
									Keep browsing
								</button>
							</div>
						) : (
							items.map((item) => <CartItem key={itemKey(item)} item={item} />)
						)}
					</div>

					{items.length > 0 && (
						<div className="shrink-0 space-y-4 border-t border-border px-6 py-6 sm:px-8">
							<DiscountCodeField />
							<div>
								{discount ? (
									<div className="mb-1 space-y-1 text-[14px] text-muted-foreground">
										<div className="flex items-center justify-between">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 font-medium text-brand">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between text-[15px]">
									<span className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
										{discount ? "Total" : "Subtotal"}
									</span>
									<span className="font-semibold">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="mt-1 text-[13px] text-muted-foreground">
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
									"flex w-full items-center justify-center gap-2 bg-black py-3.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#333]",
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
					)}
				</SheetPrimitive.Popup>
			</SheetPrimitive.Portal>
		</SheetPrimitive.Root>
	);
}
