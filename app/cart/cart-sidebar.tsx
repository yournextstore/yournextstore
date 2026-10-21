"use client";

import { ChevronDown, Loader2, X } from "lucide-react";
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

export function CartSidebar({ freeShippingThreshold = null }: { freeShippingThreshold?: string | null }) {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	// The original's free-shipping meter above the lines, when the store sets a threshold.
	const threshold = freeShippingThreshold ? BigInt(freeShippingThreshold) : null;
	const remaining = threshold !== null ? threshold - subtotal : null;
	const progress = threshold && threshold > 0n ? Math.min(100, Number((subtotal * 100n) / threshold)) : 0;

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex w-[calc(100vw-1.25rem)] flex-col gap-0 rounded-l-xl border-0 bg-background p-0 sm:max-w-[26rem] [&>button]:hidden">
				<SheetHeader className="flex-row items-center justify-between px-5 pt-6 pb-4">
					<SheetTitle className="font-sans text-sm font-medium tracking-[0.02em] uppercase">
						Cart
						{itemCount > 0 && <span className="sr-only"> ({itemCount} items)</span>}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<SheetClose className="-mr-2 inline-flex h-10 w-10 items-center justify-center">
						<X className="h-5 w-5" strokeWidth={1.25} />
						<span className="sr-only">Close cart</span>
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-12 text-center">
						<p className="font-serif text-2xl uppercase">Your cart is empty</p>
						<p className="text-sm text-muted-foreground">Find a piece to make yourself at home.</p>
						<button
							type="button"
							onClick={closeCart}
							className="mt-2 h-12 rounded-xs bg-primary px-8 text-[13px] font-medium tracking-[0.02em] text-primary-foreground uppercase transition-colors hover:bg-[#6d6966]"
						>
							Continue shopping
						</button>
					</div>
				) : (
					<>
						{threshold !== null && remaining !== null && (
							<div className="px-5 pb-2">
								<div className="h-1 overflow-hidden rounded-full bg-muted">
									<div
										className="h-full bg-[#7a7672] transition-[width] duration-500"
										style={{ width: `${progress}%` }}
									/>
								</div>
								<p className="mt-3 text-[15px]">
									{remaining > 0n ? (
										<>
											You&rsquo;re{" "}
											<strong className="font-semibold">
												{formatMoney({ amount: remaining, currency, locale })}
											</strong>{" "}
											away from free shipping!
										</>
									) : (
										"Your order ships free."
									)}
								</p>
							</div>
						)}
						<ScrollArea className="min-h-0 flex-1">
							<div className="px-5">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<div className="mx-5 space-y-4 border-t border-border pt-5 pb-6">
							<div className="flex items-center justify-between text-base font-medium">
								<span>Subtotal</span>
								<span className="tabular-nums">{formatMoney({ amount: subtotal, currency, locale })}</span>
							</div>
							{discount ? (
								<div className="flex items-center justify-between gap-3 text-[15px] text-[#047857]">
									<span>Discount</span>
									<span className="tabular-nums">−{formatMoney({ amount: discount, currency, locale })}</span>
								</div>
							) : null}
							<p className="text-[13px] text-muted-foreground">
								{taxBehavior === "inclusive" ? "Tax included. " : ""}Shipping
								{taxBehavior === "inclusive" ? "" : " and taxes"} will be calculated at checkout
							</p>
							<details className="group">
								<summary className="ml-auto flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-xs bg-muted px-3 py-2 text-[13px] font-medium [&::-webkit-details-marker]:hidden">
									Discount code
									<ChevronDown
										aria-hidden="true"
										className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
										strokeWidth={1.5}
									/>
								</summary>
								<div className="pt-3">
									<DiscountCodeField />
								</div>
							</details>
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
									"flex h-12 w-full items-center justify-center gap-2 rounded-xs bg-primary text-[13px] font-medium tracking-[0.02em] text-primary-foreground uppercase transition-colors hover:bg-[#6d6966]",
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
