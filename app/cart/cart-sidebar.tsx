"use client";

import { Loader2, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { squareButton } from "@/components/bento/styles";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const row =
	"mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700";

export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				showCloseButton={false}
				overlayClassName="bg-black/30 backdrop-blur-[.5px]"
				className="gap-0 border-l border-neutral-200 bg-white/80 p-6 text-black shadow-none backdrop-blur-xl data-[side=right]:w-full data-[side=right]:sm:max-w-none data-[side=right]:md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white"
			>
				<div className="flex items-center justify-between">
					<SheetTitle className="text-lg font-semibold">My Cart</SheetTitle>
					<SheetDescription className="sr-only">
						Review the items in your cart and check out.
					</SheetDescription>
					<SheetClose aria-label="Close cart" className={squareButton}>
						<X className="h-6 w-6 transition-all ease-in-out hover:scale-110" aria-hidden="true" />
					</SheetClose>
				</div>

				{items.length === 0 ? (
					<div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
						<ShoppingCart className="h-16 w-16" strokeWidth={1.25} aria-hidden="true" />
						<p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
					</div>
				) : (
					<div className="flex h-full min-h-0 flex-col justify-between overflow-hidden p-1">
						<ul className="grow overflow-auto py-4">
							{items.map((item) => (
								<CartItem key={itemKey(item)} item={item} />
							))}
						</ul>
						<div className="py-4 text-sm text-muted-foreground">
							<div className="mb-4">
								<DiscountCodeField />
							</div>
							<div className={row}>
								<p>Subtotal</p>
								<p className="text-right text-base text-black dark:text-white">{fmt(subtotal)}</p>
							</div>
							{discount ? (
								<div className={row}>
									<p>Discount</p>
									<p className="text-right text-base text-black tabular-nums dark:text-white">
										−{fmt(discount)}
									</p>
								</div>
							) : null}
							<div className={row}>
								<p>Taxes</p>
								<p className="text-right">
									{taxBehavior === "inclusive" ? "Included" : "Calculated at checkout"}
								</p>
							</div>
							<div className={row}>
								<p>Shipping</p>
								<p className="text-right">Calculated at checkout</p>
							</div>
							<div className={row}>
								<p>Total</p>
								<p className="text-right text-base text-black dark:text-white">
									{fmt(subtotal - (discount ?? 0n))}
								</p>
							</div>
						</div>
						{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
						    different Next.js zone. A soft RSC nav 500s the cross-zone request. While a cart
						    write is in flight, block the link: a full navigation now would load /checkout
						    before the item is committed server-side and show an empty cart. */}
						<a
							href={checkoutUrl}
							aria-disabled={isMutating}
							tabIndex={isMutating ? -1 : undefined}
							onClick={(e) => {
								if (isMutating) e.preventDefault();
							}}
							className={cn(
								"flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100",
								isMutating && "pointer-events-none opacity-60",
							)}
						>
							{isMutating ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
									Updating…
								</>
							) : (
								"Proceed to Checkout"
							)}
						</a>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
