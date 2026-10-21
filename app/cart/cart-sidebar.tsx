"use client";

import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { BagIcon } from "@/components/icons";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
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
			<SheetContent className="flex flex-col gap-0 bg-card data-[side=right]:w-full data-[side=right]:border-0 data-[side=right]:sm:max-w-[436px]">
				<SheetHeader className="mx-6 border-b border-border px-0 pt-6 pb-5">
					<SheetTitle className="flex items-baseline gap-2 font-heading text-[22px] font-normal">
						Cart
						{itemCount > 0 && (
							<span className="font-sans text-sm text-muted-foreground">
								({itemCount} {itemCount === 1 ? "item" : "items"})
							</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-subtle">
							<BagIcon className="h-9 w-9 text-secondary-foreground" />
						</div>
						<div className="text-center">
							<p className="font-heading text-title-sm">Your cart is empty</p>
							<p className="text-sm text-muted-foreground mt-1">Add some products to get started</p>
						</div>
						<Button onClick={closeCart} className="h-12 rounded-md px-8">
							Continue shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-6">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mx-6 mt-auto border-t border-border px-0 pt-5 pb-6">
							<div className="w-full space-y-4">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1">
										<div className="flex items-center justify-between text-sm text-muted-foreground">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-sm font-medium text-green-700">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between text-base">
									<span className="font-semibold">{discount ? "Total" : "Subtotal"}</span>
									<span className="font-bold">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-sm text-muted-foreground">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout"
										: "Shipping and taxes calculated at checkout"}
								</p>
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
										buttonVariants(),
										"h-12 w-full rounded-md text-base font-medium",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating…
										</>
									) : (
										"Continue to checkout"
									)}
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-foreground underline-offset-4 hover:underline"
								>
									Continue shopping
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
