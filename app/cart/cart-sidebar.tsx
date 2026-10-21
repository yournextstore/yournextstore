"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { CartIcon, CloseIcon } from "@/components/icons";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/** The original's cart modal: a 38rem white panel, serif title over a black rule, tinted footer. */
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
			<SheetContent className="w-full gap-0 border-0 p-0 shadow-none sm:max-w-[38rem] [&>button:last-child]:hidden">
				<div className="px-6 md:px-12">
					<div className="flex items-center justify-between border-b border-black pt-6 pb-4">
						<SheetTitle className="font-serif text-subheader font-normal">Shopping Cart</SheetTitle>
						<SheetClose
							aria-label="Close cart"
							className="inline-flex size-8 items-center justify-center transition-opacity hover:opacity-70"
						>
							<CloseIcon className="size-6" />
						</SheetClose>
					</div>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</div>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center bg-tint p-6 md:p-12">
						<div className="relative mb-3">
							<CartIcon className="size-8" />
							<span className="absolute -top-1 -right-1 text-tiny font-semibold" aria-hidden="true">
								0
							</span>
						</div>
						<p className="text-center font-medium">Your cart is empty</p>
						<Link href="/products" onClick={closeCart} className="arrow-link mt-6">
							Continue shopping
						</Link>
					</div>
				) : (
					<>
						<div className="flex-1 overflow-y-auto px-6 pt-6 md:px-12">
							{items.map((item) => (
								<CartItem key={item.productVariant.id} item={item} />
							))}
						</div>

						<div className="border-t border-black bg-tint px-6 py-6 md:px-12 md:pb-10">
							<div className="mb-4">
								<DiscountCodeField />
							</div>
							{discount ? (
								<div className="mb-1 flex gap-2">
									<p className="text-ink-soft">Discount:</p>
									<p className="tabular-nums">−{formatMoney({ amount: discount, currency, locale })}</p>
								</div>
							) : null}
							<div className="mb-1 flex gap-2">
								<p className="text-ink-soft">{discount ? "Total:" : "Subtotal:"}</p>
								<p className="tabular-nums">
									{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
								</p>
							</div>
							{/* Tax is already inside the shown subtotal on an inclusive store — promising to
							    "calculate taxes at checkout" there would read as an extra charge to come. */}
							<p className="mb-4 text-caption text-ink-soft">
								{taxBehavior === "inclusive"
									? "Shipping calculated at checkout"
									: "Shipping and taxes calculated at checkout"}
							</p>
							<div className="grid gap-4 md:grid-cols-2">
								<button
									type="button"
									onClick={closeCart}
									className="hidden h-14 items-center justify-center border border-black bg-white px-4 font-medium md:flex"
								>
									Continue Shopping
								</button>
								{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
								    different Next.js zone. A soft RSC nav 500s the cross-zone request. While a
								    cart write is in flight, block the link: a full navigation now would load
								    /checkout before the item is committed server-side and show an empty cart. */}
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
										"flex h-14 items-center justify-center gap-2 bg-black px-4 font-medium text-white",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="size-4 animate-spin" />
											Updating…
										</>
									) : (
										"Checkout"
									)}
								</a>
							</div>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
