"use client";

import { Loader2, ShoppingBag, XIcon } from "lucide-react";
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
			<SheetContent hideClose className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-[26rem]">
				<SheetHeader className="flex shrink-0 flex-row items-center justify-between gap-2 border-b border-border px-4 py-3">
					<SheetTitle className="ed-display flex items-baseline gap-1.5 text-lg font-medium">
						Your bag
						<span className="font-sans text-sm font-normal text-muted-foreground">({itemCount})</span>
					</SheetTitle>
					<SheetClose className="grid h-9 w-9 place-items-center rounded-full text-foreground transition-colors hover:bg-muted">
						<XIcon className="h-5 w-5" />
						<span className="sr-only">Close</span>
					</SheetClose>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex h-20 w-20 items-center justify-center rounded-full border border-border">
							<ShoppingBag className="h-8 w-8 text-foreground" strokeWidth={1.5} />
						</div>
						<div className="text-center">
							<p className="ed-display text-xl font-medium">Your bag is empty</p>
							<p className="mt-1 text-sm text-muted-foreground">Add a few products to get started.</p>
						</div>
						<button type="button" className="ed-btn ed-btn--ghost" onClick={closeCart}>
							Continue shopping
						</button>
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

						<SheetFooter className="mt-auto border-t border-border p-4">
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
								<div className="flex items-center justify-between">
									<span className="text-[0.9375rem] font-medium">{discount ? "Total" : "Subtotal"}</span>
									<span className="text-xl font-semibold tabular-nums">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-xs text-muted-foreground">
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
										"ed-btn h-12 w-full text-[0.9375rem]",
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
								<button
									type="button"
									onClick={closeCart}
									className="ed-label min-h-10 w-full text-muted-foreground transition-colors hover:text-foreground"
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
