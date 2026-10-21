"use client";

import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
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
			<SheetContent hideClose className="flex w-full flex-col gap-0 p-6 sm:max-w-md">
				<SheetHeader className="flex-row items-start justify-between gap-4 p-0">
					<SheetTitle className="font-display text-3xl font-normal">
						Your cart
						{itemCount > 0 && (
							<span className="ml-2 align-middle font-sans text-xs text-muted-foreground">
								({itemCount} {itemCount === 1 ? "item" : "items"})
							</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<button
						type="button"
						onClick={closeCart}
						aria-label="Close cart"
						className="-mt-1 -mr-2 flex h-9 w-9 shrink-0 items-center justify-center text-foreground transition-colors hover:text-muted-foreground"
					>
						<X className="h-4 w-4" aria-hidden="true" />
					</button>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-4">
						<p className="text-muted-foreground">Your cart is empty</p>
						<Link
							href="/products"
							onClick={closeCart}
							className="text-sm font-medium text-primary underline underline-offset-4 hover:text-foreground"
						>
							Continue shopping
						</Link>
					</div>
				) : (
					<>
						<ScrollArea className="-mx-6 min-h-0 flex-1 px-6 py-4">
							<ul className="divide-y">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</ul>
						</ScrollArea>

						<SheetFooter className="mt-0 gap-0 border-t p-0 pt-5">
							<div className="w-full space-y-4">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1">
										<div className="flex items-center justify-between text-sm text-muted-foreground">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-sm font-medium text-primary">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">{discount ? "Total" : "Subtotal"}</span>
									<span className="text-lg font-semibold">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
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
										"flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
											Updating…
										</>
									) : (
										"Checkout"
									)}
								</a>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-center text-xs text-muted-foreground">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout."
										: "Shipping and taxes calculated at checkout."}
								</p>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
