"use client";

import { useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";

type Variant = {
	id: string;
	price: string;
	priceGross?: string;
	sku?: string | null;
	images: string[];
	stock: number | null;
	combinations?: { variantValue: { value: string } }[];
};

/**
 * The original's centred purchase card (name, price, finish, quantity, pre-order), wired to the
 * cart for the featured product.
 */
export function PurchaseCard({
	product,
	variants,
	perks,
}: {
	product: { id: string; name: string; slug: string; images: string[]; summary: string | null };
	variants: Variant[];
	perks: string[];
}) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const { openCart, dispatch, syncCart, reconcile, startMutation } = useCart();
	const [selectedId, setSelectedId] = useState(variants.find((v) => v.stock !== 0)?.id ?? variants[0]?.id);
	const [quantity, setQuantity] = useState(1);
	const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
	if (!selected) return null;

	const soldOut = selected.stock === 0;
	const max = Math.max(1, Math.min(10, selected.stock ?? 10));
	const qty = Math.min(quantity, max);
	const label = (variant: Variant, index: number) =>
		variant.combinations?.map((c) => c.variantValue.value).join(" · ") || `Option ${index + 1}`;

	const add = () => {
		if (soldOut) return;
		trackAddToCart(selected, product.name, qty);
		openCart();
		setQuantity(1);
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: qty,
				productVariant: {
					id: selected.id,
					price: selected.price,
					priceGross: selected.priceGross,
					images: selected.images,
					product: { id: product.id, name: product.name, slug: product.slug, images: product.images },
				},
			},
		});
		startMutation(async () => {
			const result = await addToCart(selected.id, qty);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === selected.id);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<div className="reveal mx-auto max-w-2xl border border-hairline-strong bg-gradient-to-b from-[var(--panel-from)] to-transparent px-6 py-12 shadow-[inset_0_1px_0_var(--frame-inset)] sm:px-8 md:px-14 md:py-16">
			<p className="text-center text-kicker font-medium uppercase tracking-[0.4em] text-muted-foreground">
				{product.name}
			</p>
			<h2 className="mt-4 text-center font-display text-4xl font-light text-ink md:text-5xl">
				{formatMoney({ amount: displayPrice(selected, taxBehavior), currency, locale })}
			</h2>
			{product.summary && (
				<p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
					{product.summary}
				</p>
			)}

			{variants.length > 1 && (
				<fieldset className="mt-12">
					<legend className="text-micro font-medium uppercase tracking-[0.28em] text-muted-foreground">
						Finish
					</legend>
					<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
						{variants.map((variant, index) => (
							<button
								key={variant.id}
								type="button"
								aria-pressed={variant.id === selected.id}
								onClick={() => setSelectedId(variant.id)}
								className={cn(
									"min-h-[60px] w-full border px-5 py-4 text-left text-sm font-medium tracking-wide transition-all duration-300",
									variant.id === selected.id
										? "border-[var(--ghost-hover-border)] bg-[var(--premium-bg)] text-ink"
										: "border-hairline-strong text-muted-foreground hover:text-foreground",
								)}
							>
								{label(variant, index)}
								{variant.stock === 0 && (
									<span className="mt-1 block text-[11px] text-muted-foreground">Sold out</span>
								)}
							</button>
						))}
					</div>
				</fieldset>
			)}

			<div className="mt-10 flex flex-col gap-8 border-t border-hairline-strong pt-10 md:flex-row md:items-end md:justify-between">
				<div>
					<span className="text-micro font-medium uppercase tracking-[0.28em] text-muted-foreground">
						Quantity
					</span>
					<div className="mt-4 grid w-full grid-cols-[1fr_auto_1fr] items-stretch border border-hairline-strong md:w-auto">
						<button
							type="button"
							aria-label="Decrease quantity"
							disabled={qty <= 1}
							className="px-4 py-3 text-muted-foreground transition-colors hover:bg-[var(--premium-bg)] hover:text-foreground disabled:opacity-40"
							onClick={() => setQuantity(Math.max(1, qty - 1))}
						>
							−
						</button>
						<span className="flex min-w-10 items-center justify-center px-4 text-center text-sm tabular-nums text-foreground">
							{qty}
						</span>
						<button
							type="button"
							aria-label="Increase quantity"
							disabled={qty >= max}
							className="px-4 py-3 text-muted-foreground transition-colors hover:bg-[var(--premium-bg)] hover:text-foreground disabled:opacity-40"
							onClick={() => setQuantity(Math.min(max, qty + 1))}
						>
							+
						</button>
					</div>
				</div>
				<button
					type="button"
					onClick={add}
					disabled={soldOut}
					className="btn-premium w-full [--btn-fs:12px] [--btn-px:2.5rem] [--btn-py:1rem] md:w-auto"
				>
					{soldOut ? "Sold out" : "Add to cart"}
				</button>
			</div>

			{perks.length > 0 && (
				<ul className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-3 border-t border-hairline pt-10 text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
					{perks.map((perk) => (
						<li key={perk}>{perk}</li>
					))}
				</ul>
			)}
		</div>
	);
}
