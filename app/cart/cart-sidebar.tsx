"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { BagIcon, CloseIcon } from "@/components/icons";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

	// Solace's cart dropdown: a 460px panel with a black hairline that hangs under the header's
	// cart button from 640px; a full-height sheet on phones.
	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				hideClose
				overlayClassName="bg-black/20"
				className="flex w-full flex-col gap-0 border-foreground p-0 shadow-none sm:inset-y-auto sm:top-22 sm:h-auto sm:right-4 sm:max-h-[calc(100svh-6.5rem)] sm:w-[28.75rem] sm:max-w-[28.75rem] sm:border md:right-14"
			>
				<SheetHeader className="flex-row items-center justify-between gap-2 border-b border-border p-5">
					<SheetTitle className="text-heading-sm font-normal">
						Shopping Cart
						{itemCount > 0 && <span className="sr-only">, {itemCount} items</span>}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<button
						type="button"
						onClick={closeCart}
						aria-label="Close cart"
						className="-mr-2 inline-flex size-10 items-center justify-center rounded-full hover:bg-hover"
					>
						<CloseIcon className="size-5" />
					</button>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="my-6 flex flex-1 flex-col items-center justify-center gap-y-6 px-10 py-5 sm:flex-none">
						<BagIcon className="size-14" />
						<div className="flex flex-col items-center gap-y-2 text-center">
							<p className="text-heading-sm">Your shopping cart is empty</p>
							<p className="text-copy text-muted-foreground">Are you looking for inspiration?</p>
						</div>
						<Link href="/products" onClick={closeCart} className="pill w-full">
							Explore the shop
						</Link>
					</div>
				) : (
					<>
						<div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-5 sm:max-h-[25.125rem]">
							<div className="flex flex-col gap-y-3 py-5">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</div>

						<div className="flex flex-col gap-y-4 border-t border-border p-5">
							<DiscountCodeField />
							{discount ? (
								<div className="flex flex-col gap-1">
									<div className="flex items-center justify-between text-copy text-muted-foreground">
										<span>Subtotal</span>
										<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
									</div>
									<div className="flex items-center justify-between gap-3 text-copy text-foreground">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								</div>
							) : null}
							<div className="flex items-center justify-between">
								<span className="text-copy text-muted-foreground">Total</span>
								<span className="text-lead font-semibold">
									{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
								</span>
							</div>
							{/* Tax is already inside the shown subtotal on an inclusive store — promising to
							    "calculate taxes at checkout" there would read as an extra charge to come. */}
							<p className="text-caption text-muted-foreground">
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
								className={cn("pill w-full", isMutating && "pointer-events-none opacity-60")}
							>
								{isMutating ? (
									<>
										<Loader2 className="size-4 animate-spin" aria-hidden="true" />
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
