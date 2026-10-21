"use client";

import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { squareButton } from "@/components/bento/styles";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import type { CartSuggestion } from "@/lib/cart-suggestions";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

const row = "mb-3 flex items-center justify-between border-b border-white/10 pb-2";

export function CartSidebar({
	freeShippingMinor,
	suggestions,
}: {
	/** The store's free-shipping threshold in minor units; the progress card hides without one. */
	freeShippingMinor: number | null;
	suggestions: CartSuggestion[];
}) {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";
	const inCart = new Set(items.map((item) => item.productVariant.id));
	const addOns = suggestions.filter((s) => !inCart.has(s.variantId)).slice(0, 3);

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				hideClose
				overlayClassName="bg-black/50 backdrop-blur-[.5px]"
				className="w-full gap-0 border-l border-white/10 bg-deep/95 p-6 text-bone shadow-none backdrop-blur-xl sm:max-w-none md:w-[420px]"
			>
				<div className="flex flex-none items-center justify-between">
					<SheetTitle className="text-lg font-semibold text-bone">Your cart</SheetTitle>
					<SheetDescription className="sr-only">
						Review the items in your cart and check out.
					</SheetDescription>
					<SheetClose asChild>
						<button type="button" aria-label="Close cart" className={squareButton}>
							<X className="h-6 w-6 transition-all ease-in-out hover:scale-110" aria-hidden="true" />
						</button>
					</SheetClose>
				</div>

				{items.length === 0 ? (
					<div className="mt-24 flex w-full flex-col items-center justify-center">
						<span
							aria-hidden="true"
							className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-amber/30 bg-amber/[0.07]"
						>
							<span className="h-7 w-7 rounded-full bg-amber shadow-[0_0_36px_8px_rgba(242,169,59,.45)]" />
						</span>
						<p className="mt-8 text-center text-2xl font-semibold">Your cart is empty.</p>
						<Link
							href="/products"
							onClick={closeCart}
							className="mt-6 rounded-full bg-amber px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
						>
							Shop the catalog
						</Link>
					</div>
				) : (
					<div className="flex h-full min-h-0 flex-col overflow-hidden">
						{freeShippingMinor ? (
							<FreeShippingBar subtotal={subtotal} threshold={BigInt(freeShippingMinor)} fmt={fmt} />
						) : null}
						<ul className="min-h-0 grow overflow-auto py-2">
							{items.map((item) => (
								<CartItem key={item.productVariant.id} item={item} />
							))}
						</ul>

						{addOns.length > 0 ? (
							<div className="flex-none border-t border-white/10 pt-4">
								<p className="text-[11px] font-semibold tracking-[0.18em] text-[#8a9a9c] uppercase">
									Add-ons
								</p>
								<ul className="mt-3 space-y-2">
									{addOns.slice(0, 2).map((suggestion) => (
										<AddOn key={suggestion.variantId} suggestion={suggestion} />
									))}
								</ul>
							</div>
						) : null}

						<div className="flex-none py-4 text-sm text-[#a3a3a3]">
							<div className="mb-4">
								<DiscountCodeField />
							</div>
							{discount ? (
								<div className={row}>
									<p>Discount</p>
									<p className="aq-spec text-right text-bone">−{fmt(discount)}</p>
								</div>
							) : null}
							<div className={row}>
								<p>Shipping</p>
								<p className="text-right text-[#d4d4d4]">
									{freeShippingMinor && subtotal >= BigInt(freeShippingMinor)
										? "Free"
										: "Calculated at checkout"}
								</p>
							</div>
							<div className={cn(row, "text-base font-semibold text-bone")}>
								<p>Subtotal</p>
								<p className="aq-spec text-right">{fmt(subtotal - (discount ?? 0n))}</p>
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
								"flex w-full flex-none items-center justify-center gap-2 rounded-full bg-amber p-3.5 text-center text-sm font-semibold tracking-wide text-black uppercase transition hover:brightness-110",
								isMutating && "pointer-events-none opacity-70",
							)}
						>
							{isMutating ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
									Updating…
								</>
							) : (
								"Secure checkout"
							)}
						</a>
						<p className="mt-3 flex-none text-center text-xs text-[#8a9a9c]">
							Encrypted checkout · {taxBehavior === "inclusive" ? "Taxes included" : "Taxes at checkout"}
						</p>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}

function FreeShippingBar({
	subtotal,
	threshold,
	fmt,
}: {
	subtotal: bigint;
	threshold: bigint;
	fmt: (amount: bigint) => string;
}) {
	const remaining = threshold - subtotal;
	const pct = threshold > 0n ? Math.min(100, Number((subtotal * 100n) / threshold)) : 100;
	return (
		<div className="mt-4 mb-2 flex-none rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
			<p className="text-center text-xs font-medium text-[#d4d4d4]">
				{remaining <= 0n ? (
					<span className="text-amber">You&apos;ve unlocked free shipping</span>
				) : (
					<>
						Add <span className="aq-spec font-semibold text-bone">{fmt(remaining)}</span> more for free
						shipping
					</>
				)}
			</p>
			<div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
				<div
					className="h-full rounded-full bg-amber transition-all duration-500"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

function AddOn({ suggestion }: { suggestion: CartSuggestion }) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const { openCart, dispatch, syncCart, reconcile, startMutation } = useCart();
	const price = BigInt(
		displayPrice({ price: suggestion.price, priceGross: suggestion.priceGross }, taxBehavior),
	);

	const add = () => {
		trackAddToCart(
			{ id: suggestion.variantId, sku: suggestion.sku, price: suggestion.price },
			suggestion.product.name,
			1,
		);
		openCart();
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: 1,
				productVariant: {
					id: suggestion.variantId,
					price: suggestion.price,
					priceGross: suggestion.priceGross,
					images: suggestion.images,
					product: suggestion.product,
				},
			},
		});
		startMutation(async () => {
			const result = await addToCart(suggestion.variantId, 1);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === suggestion.variantId);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<li className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-2">
			<div className="relative h-10 w-10 flex-none overflow-hidden rounded-md bg-panel-2">
				{suggestion.image ? (
					<YNSMedia src={suggestion.image} alt="" fill sizes="40px" className="object-cover" />
				) : null}
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate text-xs text-bone">{suggestion.product.name}</p>
				<p className="aq-spec text-xs text-amber">{formatMoney({ amount: price, currency, locale })}</p>
			</div>
			<button
				type="button"
				onClick={add}
				aria-label={`Add ${suggestion.product.name}`}
				className="flex-none rounded-full border border-white/15 px-3 py-1.5 text-xs text-bone transition hover:border-amber/50 hover:text-amber"
			>
				Add
			</button>
		</li>
	);
}
