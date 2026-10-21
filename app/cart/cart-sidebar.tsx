"use client";

import { Loader2, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button, buttonVariants } from "@/components/ui/button";
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
			<SheetContent
				hideClose
				overlayClassName="bg-black/10 supports-backdrop-filter:backdrop-blur-none"
				className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md"
			>
				<SheetHeader className="flex h-16 shrink-0 flex-row items-center justify-between gap-2 border-b border-border px-4 py-0">
					<SheetTitle className="flex items-center gap-2 text-base font-medium">
						<ShoppingBag className="size-6 text-gray-600" aria-hidden />
						<span>Cart</span>
						{itemCount > 0 && (
							<span className="font-normal text-ink-soft">
								({itemCount} {itemCount === 1 ? "item" : "items"})
							</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<SheetClose render={<Button variant="ghost" size="icon" aria-label="Close cart" />}>
						<X className="size-6" aria-hidden />
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
						<ShoppingBag className="mb-4 size-16 text-gray-300" strokeWidth={1} aria-hidden />
						<p className="mb-4 text-ink-soft">Your cart is empty</p>
						<Link href="/products" onClick={closeCart} className="font-medium text-ink hover:underline">
							Continue Shopping
						</Link>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<ul className="divide-y divide-gray-200">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</ul>
						</ScrollArea>

						<SheetFooter className="mt-0 shrink-0 gap-4 border-t border-gray-200 p-4">
							<DiscountCodeField />
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span>Subtotal</span>
									<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
								</div>
								{discount ? (
									<div className="flex items-center justify-between text-sm text-green-700">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								) : null}
								<div className="flex items-center justify-between">
									<span>Shipping</span>
									<span className="text-ink-soft">Calculated at checkout</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store. */}
								{taxBehavior !== "inclusive" && (
									<div className="flex items-center justify-between">
										<span>Taxes</span>
										<span className="text-ink-soft">Calculated at checkout</span>
									</div>
								)}
							</div>
							<div className="space-y-2">
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
										buttonVariants({ size: "lg" }),
										"w-full",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="size-4 animate-spin" aria-hidden />
											Updating…
										</>
									) : (
										"Checkout"
									)}
								</a>
								<Button variant="link" size="lg" className="w-full text-ink" onClick={closeCart}>
									Continue Shopping
								</Button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
