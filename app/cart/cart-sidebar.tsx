"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/** Floating cart card: inset 16px from the viewport edges, rounded, slides in from the right. */
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
				<SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/45 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
				<SheetPrimitive.Content className="fixed top-4 right-4 bottom-4 z-50 flex w-[calc(100%-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-2xl data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=closed]:slide-out-to-right-[calc(100%+1.5rem)] data-[state=open]:animate-in data-[state=open]:duration-300 data-[state=open]:slide-in-from-right-[calc(100%+1.5rem)]">
					<div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-5">
						<SheetPrimitive.Title className="font-display text-xl font-bold">
							Your cart
							{itemCount > 0 && (
								<span className="ml-2 text-[14px] font-normal text-muted-foreground">({itemCount})</span>
							)}
						</SheetPrimitive.Title>
						<SheetPrimitive.Description className="sr-only">
							Review items in your cart and proceed to checkout.
						</SheetPrimitive.Description>
						<SheetPrimitive.Close
							className="rounded-md p-2 text-muted-foreground transition hover:bg-card hover:text-foreground"
							aria-label="Close cart"
						>
							<svg
								aria-hidden
								width="16"
								height="16"
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

					<div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
						{items.length === 0 ? (
							<div className="py-16 text-center">
								<p className="text-[15px] text-muted-foreground">
									Your cart is empty.
									<br />
									Something good is waiting on the shelves.
								</p>
								<button
									type="button"
									onClick={closeCart}
									className="mt-6 rounded-md border border-border px-6 py-3 text-[14px] font-semibold transition hover:border-brass hover:text-brass"
								>
									Keep browsing
								</button>
							</div>
						) : (
							items.map((item) => <CartItem key={item.productVariant.id} item={item} />)
						)}
					</div>

					{items.length > 0 && (
						<div className="shrink-0 space-y-4 border-t border-border px-6 py-5">
							<DiscountCodeField />
							<div>
								{discount ? (
									<div className="mb-1 space-y-1 text-[14px] text-muted-foreground">
										<div className="flex items-center justify-between">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 font-medium text-brass">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between text-[15px]">
									<span className="text-muted-foreground">{discount ? "Total" : "Subtotal"}</span>
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
									"flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-[15px] font-semibold text-primary-foreground transition hover:brightness-110",
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
				</SheetPrimitive.Content>
			</SheetPrimitive.Portal>
		</SheetPrimitive.Root>
	);
}
