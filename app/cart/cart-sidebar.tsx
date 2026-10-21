"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button } from "@/components/ui/button";
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
	const { cart, isOpen, closeCart, items, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-[460px] [&>button:last-child]:top-5">
				<SheetHeader className="border-b border-border p-4">
					<SheetTitle className="text-heading font-medium uppercase">Shopping cart</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col justify-center px-8 py-12">
						<p className="text-center text-heading font-medium uppercase">Your shopping cart is empty</p>
						<p className="py-4 text-center text-label-lg font-light">Are you looking for inspiration?</p>
						<Button asChild className="h-12 w-full rounded-sm text-label font-normal">
							<Link href="/products" onClick={closeCart}>
								Explore
							</Link>
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-4">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto gap-0 border-t border-border p-4">
							<div className="w-full space-y-1">
								<DiscountCodeField />
								<div className="flex items-center justify-between pt-3 text-label text-muted-foreground">
									Items{" "}
									<span className="text-foreground">
										{formatMoney({ amount: subtotal, currency, locale })}
									</span>
								</div>
								{discount ? (
									<div className="flex items-center justify-between text-label text-muted-foreground">
										Discount
										<span className="tabular-nums text-foreground">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								) : null}
								<div className="flex items-center justify-between text-label text-muted-foreground">
									Delivery <span className="text-foreground">At checkout</span>
								</div>
								<div className="flex items-center justify-between text-label text-muted-foreground">
									Total
									<span className="text-subheading font-semibold text-foreground">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{taxBehavior === "inclusive" ? null : (
									<p className="text-label-sm text-muted-foreground">Taxes calculated at checkout</p>
								)}
								{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
								    different Next.js zone (yns.store). A soft RSC nav 500s the cross-zone request.
								    While a cart write is in flight, block the link: a full navigation now would
								    load /checkout before the item is committed server-side and show an empty cart. */}
								<Button asChild className="mt-4 h-12 w-full rounded-sm text-label font-normal">
									<a
										href={checkoutUrl}
										aria-disabled={isMutating}
										tabIndex={isMutating ? -1 : undefined}
										onClick={(e) => {
											if (isMutating) {
												e.preventDefault();
											}
										}}
										className={cn(isMutating && "pointer-events-none opacity-60")}
									>
										{isMutating ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin" />
												Updating…
											</>
										) : (
											"Go to checkout"
										)}
									</a>
								</Button>
								<button
									type="button"
									onClick={closeCart}
									className="mt-2 h-10 w-full rounded-sm bg-tonal text-label transition-colors hover:bg-tonal-hover"
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
