"use client";

import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { pad2 } from "@/lib/pad";

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
				className="w-full gap-0 border-l border-border bg-background shadow-none duration-500 data-[state=open]:duration-500 sm:max-w-[27rem]"
			>
				<div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-[1.375rem]">
					<SheetTitle className="wordmark font-semibold">
						Cart{" "}
						<span className="mono text-[0.6875rem] font-normal text-muted-foreground">{pad2(itemCount)}</span>
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review the pieces in your cart and check out.
					</SheetDescription>
					<SheetClose className="relative z-10 -mr-2 inline-flex size-10 items-center justify-center transition-colors hover:text-walnut">
						<span className="sr-only">Close cart</span>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.25"
							aria-hidden="true"
						>
							<path d="M5 5l14 14" />
							<path d="M19 5L5 19" />
						</svg>
					</SheetClose>
				</div>

				<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6">
					{items.length === 0 ? (
						<div className="py-14 text-center">
							<p className="type-body text-[0.9375rem]">Nothing selected yet.</p>
							<Link href="/products" onClick={closeCart} className="btn btn-outline mt-6 w-full">
								Browse the catalogue
							</Link>
						</div>
					) : (
						<ul>
							{items.map((item) => (
								<CartItem key={item.productVariant.id} item={item} />
							))}
						</ul>
					)}
				</div>

				{items.length > 0 && (
					<div className="shrink-0 border-t border-border px-6 py-[1.375rem]">
						<DiscountCodeField />
						{discount ? (
							<div className="mono mt-5 space-y-1 text-[0.75rem]">
								<div className="flex items-center justify-between text-muted-foreground">
									<span>Subtotal</span>
									<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
								</div>
								<div className="flex items-center justify-between gap-3 text-walnut">
									<span>Discount</span>
									<span>−{formatMoney({ amount: discount, currency, locale })}</span>
								</div>
							</div>
						) : null}
						<div className="mt-5 flex items-baseline justify-between gap-4">
							<span className="label">{discount ? "Total" : "Subtotal"}</span>
							<span className="mono text-lg">
								{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
							</span>
						</div>
						{/* Tax is already inside the shown subtotal on an inclusive store. */}
						<p className="mono mt-2 text-[0.625rem] uppercase tracking-[0.05em] text-muted-foreground">
							{taxBehavior === "inclusive"
								? "Delivery calculated at checkout"
								: "Delivery and taxes calculated at checkout"}
						</p>
						{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
						    different Next.js zone. While a cart write is in flight, block the link: a full
						    navigation now would load /checkout before the item is committed server-side. */}
						<a
							href={checkoutUrl}
							aria-disabled={isMutating}
							tabIndex={isMutating ? -1 : undefined}
							onClick={(e) => {
								if (isMutating) e.preventDefault();
							}}
							className="btn btn-primary mt-5 w-full"
						>
							{isMutating ? "Updating…" : "Checkout"}
						</a>
						<button
							type="button"
							onClick={closeCart}
							className="link link-mono mx-auto mt-4 block min-h-6 text-muted-foreground"
						>
							Continue browsing
						</button>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
