"use client";

import { Loader2, ShoppingBag } from "lucide-react";
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
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex w-full flex-col gap-0 border-l-0 p-0 sm:max-w-md [&>button:last-child]:top-5 [&>button:last-child]:right-4 [&>button:last-child]:opacity-100 [&>button:last-child>svg]:size-5">
				<SheetHeader className="px-4 pt-5 pb-4">
					<SheetTitle className="font-serif text-heading-sm font-normal">Cart ({itemCount})</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
						<ShoppingBag aria-hidden className="size-10 text-muted-foreground" strokeWidth={1.25} />
						<div>
							<p className="font-serif text-heading-sm">Your cart is empty</p>
							<p className="mt-1 text-body-sm text-muted-foreground">
								Looks like you haven&apos;t added anything yet.
							</p>
						</div>
						<Button className="h-11 rounded-md px-6" onClick={closeCart}>
							Start shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-4">
							<div className="space-y-5 py-2">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto gap-0 px-4 pt-0 pb-5">
							<div className="w-full space-y-4 border-t border-border pt-4">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1 text-body-sm">
										<div className="flex items-center justify-between text-muted-foreground">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-success">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
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
										"flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-body text-primary-foreground transition-colors hover:bg-primary/85",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 aria-hidden className="size-4 animate-spin" />
											Updating…
										</>
									) : (
										<>
											Continue to Checkout
											<span aria-hidden>·</span>
											<span className="tabular-nums">
												{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
											</span>
										</>
									)}
								</a>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-body-xs text-muted-foreground">
									{taxBehavior === "inclusive"
										? "* Discounts and shipping calculated at checkout."
										: "* Taxes, discounts and shipping calculated at checkout."}
								</p>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
