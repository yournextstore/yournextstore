"use client";

import { Loader2 } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { Separator } from "@/components/separator";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="block overflow-y-auto p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
				<SheetHeader className="px-4 pt-6 pb-0">
					<SheetTitle className="text-3xl font-bold tracking-tight">Cart</SheetTitle>
					<SheetDescription>
						{items.length === 0
							? "Your cart is empty for now."
							: "Below is a list of products you have in your cart."}
					</SheetDescription>
				</SheetHeader>

				<div className="space-y-3 p-4">
					{items.length === 0 ? (
						<div className="rounded-lg border bg-card p-4 shadow-sm">
							<p>Your cart is empty...</p>
							<Button variant="outline" onClick={closeCart} className="mt-4">
								Continue shopping
							</Button>
						</div>
					) : (
						<>
							{items.map((item) => (
								<CartItem key={itemKey(item)} item={item} />
							))}

							{/* The original's "Receipt" card. Shipping and tax come from the hosted checkout. */}
							<section
								aria-labelledby="cart-receipt"
								className="rounded-lg border bg-card text-card-foreground shadow-sm"
							>
								<h2 id="cart-receipt" className="p-4 pb-0 font-bold tracking-tight">
									Receipt
								</h2>
								<div className="p-4 text-sm">
									<dl className="space-y-[1vh]">
										<div className="flex justify-between gap-4">
											<dt>Total Amount</dt>
											<dd className="tabular-nums">{fmt(subtotal)}</dd>
										</div>
										<div className="flex justify-between gap-4">
											<dt>Discount Amount</dt>
											<dd className="tabular-nums">{discount ? `−${fmt(discount)}` : fmt(0n)}</dd>
										</div>
										<div className="flex justify-between gap-4">
											<dt>{taxBehavior === "inclusive" ? "Shipping" : "Shipping & tax"}</dt>
											<dd className="text-muted-foreground">At checkout</dd>
										</div>
									</dl>
									<Separator className="my-4" />
									<div className="flex justify-between gap-4">
										<p>Payable Amount</p>
										<p className="font-medium tabular-nums">{fmt(subtotal - (discount ?? 0n))}</p>
									</div>
									<div className="mt-4">
										<DiscountCodeField />
									</div>
								</div>
								<Separator className="my-0" />
								<div className="p-6">
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
										className={cn(buttonVariants(), "w-full", isMutating && "pointer-events-none opacity-60")}
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
							</section>
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
