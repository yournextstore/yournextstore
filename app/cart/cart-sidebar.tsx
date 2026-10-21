"use client";

import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { QuickAddIconButton, type QuickAddVariant } from "@/components/quick-add-button";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export type CartSuggestion = {
	id: string;
	name: string;
	slug: string;
	images: string[];
	price: string;
	variant: QuickAddVariant;
};

/** The original's free-shipping progress bar, only when the store has set a threshold. */
function ShippingProgress({ subtotal, threshold }: { subtotal: bigint; threshold: number }) {
	const { currency, locale } = useStoreConfig();
	const left = BigInt(threshold) - subtotal;
	const percent = Math.min(100, Math.round((Number(subtotal) / threshold) * 100));
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between gap-3 text-sm">
				<span className="font-semibold text-ink">
					{formatMoney({ amount: subtotal, currency, locale })} spent
				</span>
				<span className="text-xs text-steel">
					{left > 0n
						? `${formatMoney({ amount: left, currency, locale })} away from free shipping`
						: "Free shipping unlocked"}
				</span>
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-tile">
				<div className="h-full bg-main transition-[width] duration-300" style={{ width: `${percent}%` }} />
			</div>
		</div>
	);
}

function Suggestions({ suggestions, inCart }: { suggestions: CartSuggestion[]; inCart: Set<string> }) {
	const { closeCart } = useCart();
	const shown = suggestions.filter((s) => !inCart.has(s.variant.id)).slice(0, 3);
	if (shown.length === 0) return null;
	return (
		<section aria-labelledby="cart-suggestions" className="space-y-3">
			<h3 id="cart-suggestions" className="font-montserrat text-base font-bold uppercase text-ink">
				You may also like
			</h3>
			<ul className="space-y-3">
				{shown.map((s) => (
					<li key={s.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-2">
						<Link
							href={`/product/${s.slug}`}
							onClick={closeCart}
							className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-tile"
						>
							{s.images[0] && (
								<YNSMedia src={s.images[0]} alt="" fill sizes="56px" className="object-cover" />
							)}
						</Link>
						<div className="min-w-0 flex-1">
							<Link
								href={`/product/${s.slug}`}
								onClick={closeCart}
								className="line-clamp-1 text-sm font-semibold text-ink hover:underline"
							>
								{s.name}
							</Link>
							<p className="text-sm font-semibold text-main">{s.price}</p>
						</div>
						<QuickAddIconButton
							variant={s.variant}
							product={{ id: s.id, name: s.name, slug: s.slug, images: s.images }}
						/>
					</li>
				))}
			</ul>
		</section>
	);
}

export function CartSidebar({
	suggestions = [],
	freeShippingAmount = null,
}: {
	suggestions?: CartSuggestion[];
	freeShippingAmount?: number | null;
}) {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);
	const inCart = new Set(items.map((item) => item.productVariant.id));

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				hideClose
				className="flex w-full flex-col gap-0 bg-card p-0 sm:max-w-[34rem] lg:max-w-[40%]"
			>
				<div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
					<SheetTitle className="text-xl font-bold text-ink">
						Your Cart
						{itemCount > 0 && (
							<span className="ml-2 text-sm font-normal text-steel">({itemCount} items)</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<SheetClose
						className="group rounded-full p-2 text-ink transition hover:bg-secondary"
						aria-label="Close cart"
					>
						<X className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
					</SheetClose>
				</div>

				{items.length === 0 ? (
					<div className="flex-1 space-y-6 overflow-y-auto p-6">
						{freeShippingAmount ? <ShippingProgress subtotal={0n} threshold={freeShippingAmount} /> : null}
						<div className="py-12 text-center">
							<p className="mb-6 text-sm font-medium text-steel">Your cart is empty</p>
							<Link href="/products" onClick={closeCart} className="text-ink underline underline-offset-4">
								Explore our products.
							</Link>
						</div>
						<Suggestions suggestions={suggestions} inCart={inCart} />
					</div>
				) : (
					<>
						<div className="flex-1 space-y-6 overflow-y-auto p-6">
							{freeShippingAmount ? (
								<ShippingProgress subtotal={subtotal} threshold={freeShippingAmount} />
							) : null}
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
							<Suggestions suggestions={suggestions} inCart={inCart} />
						</div>

						<div className="shrink-0 space-y-3 border-t border-border bg-card px-6 py-5">
							<DiscountCodeField />
							{discount ? (
								<div className="space-y-1">
									<div className="flex items-center justify-between text-sm text-steel">
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
								<span className="text-lg font-bold text-ink">{discount ? "Total:" : "Subtotal:"}</span>
								<span className="text-lg font-bold text-main">
									{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
								</span>
							</div>
							{/* Tax is already inside the shown subtotal on an inclusive store — promising to
							    "calculate taxes at checkout" there would read as an extra charge to come. */}
							<p className="text-xs text-steel">
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
									"flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-main font-semibold text-page transition-colors hover:bg-main-hover",
									isMutating && "pointer-events-none opacity-60",
								)}
							>
								{isMutating ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Updating…
									</>
								) : (
									"Proceed to Checkout"
								)}
							</a>
							<button
								type="button"
								onClick={closeCart}
								className="h-12 w-full rounded-lg border border-input font-semibold text-ink transition-colors hover:bg-secondary"
							>
								Continue Shopping
							</button>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
