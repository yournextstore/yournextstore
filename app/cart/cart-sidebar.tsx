"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { CloseIcon } from "@/components/icons";
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

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				showCloseButton={false}
				className="flex flex-col gap-0 border-0 px-6 pt-10 shadow-none data-[side=right]:w-full data-[side=right]:max-w-100 data-[side=right]:border-l-0 data-[side=right]:sm:max-w-139 sm:px-12"
			>
				<SheetHeader className="mb-2 flex-row items-center justify-between space-y-0 p-0">
					<SheetTitle className="text-title-md font-normal">
						Cart
						{itemCount > 0 && <span className="sr-only"> ({itemCount} items)</span>}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<button
						type="button"
						onClick={closeCart}
						aria-label="Close cart"
						className="inline-flex size-8 items-center justify-center"
					>
						<CloseIcon className="size-6" />
					</button>
				</SheetHeader>

				{items.length === 0 ? (
					<div>
						<p className="mt-2 mb-6 max-sm:mr-10 md:text-body-lg">
							You don&apos;t have anything in your cart. Let&apos;s change that, use the link below to start
							browsing our products.
						</p>
						<Link href="/products" onClick={closeCart} className="hover:underline">
							Explore products
						</Link>
					</div>
				) : (
					<>
						<div className="-mr-3 min-h-0 flex-1 overflow-y-auto pr-3 pb-8 sm:-mr-4 sm:pr-4">
							{items.map((item) => (
								<CartItem key={itemKey(item)} item={item} />
							))}
						</div>

						<div className="mt-auto border-t border-grayscale-200 bg-background pt-4 pb-6">
							<div className="flex flex-col gap-2">
								<div className="flex justify-between">
									<span className="text-grayscale-500">Subtotal:</span>
									<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
								</div>
								{discount ? (
									<div className="flex justify-between">
										<span className="text-grayscale-500">Discount:</span>
										<span className="tabular-nums">
											− {formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								) : null}
								<div className="flex justify-between">
									<span className="text-grayscale-500">Shipping:</span>
									<span>Calculated at checkout</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    add it at checkout there would read as an extra charge to come. */}
								<div className="flex justify-between">
									<span className="text-grayscale-500">Taxes:</span>
									<span>{taxBehavior === "inclusive" ? "Included" : "Calculated at checkout"}</span>
								</div>
							</div>
							<hr className="my-4 border-grayscale-200" />
							<div className="flex justify-between text-title-md font-semibold">
								<span>Total:</span>
								<span>{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}</span>
							</div>
							<div className="mt-6">
								<DiscountCodeField />
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
									"mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xs bg-foreground px-6 text-background transition-colors hover:bg-grayscale-800",
									isMutating && "pointer-events-none bg-grayscale-500",
								)}
							>
								{isMutating ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Updating…
									</>
								) : (
									"Proceed to checkout"
								)}
							</a>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
