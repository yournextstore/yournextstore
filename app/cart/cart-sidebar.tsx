"use client";

import { Loader2, XIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { pill } from "@/components/munch/styles";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/**
 * "My Bag": the original's cream side panel with a tomato rule down its edge, serif title,
 * bordered line items and a big tomato checkout pill.
 */
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
				hideClose
				overlayClassName="bg-transparent"
				className="w-full max-w-[26.875rem] gap-0 border-l border-brand bg-background p-0 shadow-none sm:max-w-[26.875rem]"
			>
				<div className="relative flex min-h-[60px] shrink-0 items-center px-4 lg:min-h-[76px]">
					<SheetTitle className="font-serif text-d-lg leading-[1.2] font-normal tracking-[-0.8px] text-brand lg:text-d-2xl lg:tracking-[-1.12px]">
						My Bag ({itemCount})
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your bag and go to checkout.
					</SheetDescription>
					<SheetClose
						aria-label="Close"
						className="absolute top-2.5 right-2.5 inline-flex size-10 items-center justify-center text-brand"
					>
						<XIcon aria-hidden="true" className="size-9" strokeWidth={1.25} />
					</SheetClose>
				</div>
				<div className="h-px w-full shrink-0 bg-brand" />

				<div className="flex flex-1 flex-col overflow-y-auto">
					<div className="flex flex-col gap-4 p-4">
						{items.length === 0 ? (
							<p className="text-b-md">Your bag is currently empty.</p>
						) : (
							items.map((item) => <CartItem key={item.productVariant.id} item={item} />)
						)}
					</div>
				</div>

				{items.length > 0 && (
					<>
						<div className="h-px w-full shrink-0 bg-brand" />
						<div className="flex w-full shrink-0 flex-col gap-4 p-s">
							<DiscountCodeField />
							{discount ? (
								<div className="flex items-center justify-between gap-3 text-b-sm">
									<span>Discount</span>
									<span className="tabular-nums">−{formatMoney({ amount: discount, currency, locale })}</span>
								</div>
							) : null}
							<div className="flex w-full justify-between gap-4">
								<div>
									<p className="text-b-md font-semibold">{discount ? "Total" : "Subtotal"}</p>
									{/* Tax is already inside the shown subtotal on an inclusive store — promising to
									    "calculate taxes at checkout" there would read as an extra charge to come. */}
									<p className="text-b-sm">
										{taxBehavior === "inclusive"
											? "Shipping calculated at checkout"
											: "Taxes and shipping calculated at checkout"}
									</p>
								</div>
								<p className="text-b-md tabular-nums">
									{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
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
									pill({ size: "lg", variant: "primary", className: "w-full gap-3" }),
									isMutating && "pointer-events-none opacity-60",
								)}
							>
								{isMutating ? (
									<>
										<Loader2 aria-hidden="true" className="size-6 animate-spin" />
										Updating…
									</>
								) : (
									"Go to checkout"
								)}
							</a>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
