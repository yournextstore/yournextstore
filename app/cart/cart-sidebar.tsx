"use client";

import { Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
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
			<SheetContent className="flex flex-col gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
				<SheetHeader className="gap-2.5 p-6 pb-0">
					<SheetTitle>Cart {itemCount > 0 && `(${itemCount})`}</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<div className="h-px w-full bg-border" />
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center space-y-1 px-6">
						<ShoppingCart aria-hidden="true" className="mb-4 size-16 text-muted-foreground" />
						<p className="text-xl font-medium text-muted-foreground">Your cart is empty</p>
						<Link
							href="/products"
							onClick={closeCart}
							className="text-sm text-muted-foreground underline-offset-4 hover:underline"
						>
							Add products to continue
						</Link>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<div className="flex w-full flex-col gap-4 px-6 py-4">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto p-6 pt-0">
							<div className="w-full space-y-4">
								<div className="h-px w-full bg-border" />
								<DiscountCodeField />
								<div className="space-y-1.5 text-sm">
									<div className="flex">
										<span className="flex-1">Shipping</span>
										<span className="text-muted-foreground">Calculated at checkout</span>
									</div>
									{taxBehavior !== "inclusive" ? (
										<div className="flex">
											<span className="flex-1">Taxes</span>
											<span className="text-muted-foreground">Calculated at checkout</span>
										</div>
									) : null}
									{discount ? (
										<>
											<div className="flex">
												<span className="flex-1">Subtotal</span>
												<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
											</div>
											<div className="flex">
												<span className="flex-1">Discount</span>
												<span className="tabular-nums">
													−{formatMoney({ amount: discount, currency, locale })}
												</span>
											</div>
										</>
									) : null}
									<div className="flex font-medium">
										<span className="flex-1">Total</span>
										<span>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</span>
									</div>
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
										"inline-flex h-8 w-full items-center justify-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 aria-hidden="true" className="size-4 animate-spin" />
											Updating…
										</>
									) : (
										"Proceed to checkout"
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
