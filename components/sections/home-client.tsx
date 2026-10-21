"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";

type BuyVariant = {
	id: string;
	price: string;
	priceGross?: string;
	originalPrice: string;
	originalPriceGross?: string | null;
	sku: string | null;
	images: string[];
	stock: number | null;
	combinations: {
		variantValue: {
			value: string;
			colorValue: string | null;
			variantType: { label: string; type: "string" | "color" };
		};
	}[];
};

/**
 * Featured product's inline buy box: price, option chips, the grey quantity stepper and
 * "Add to cart". Keeps the chosen variant in local state so the home URL stays clean.
 */
export function FeaturedBuyBox({
	product,
	variants,
}: {
	product: { id: string; name: string; slug: string; images: string[] };
	variants: BuyVariant[];
}) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const { openCart, dispatch, startMutation, syncCart, reconcile } = useCart();
	const [selectedId, setSelectedId] = useState(variants.find((v) => v.stock !== 0)?.id ?? variants[0]?.id);
	const [quantity, setQuantity] = useState(1);
	const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
	if (!selected) return null;

	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const price = BigInt(displayPrice(selected, taxBehavior));
	const list = BigInt(
		displayPrice(selected, taxBehavior, "originalPrice") ?? displayPrice(selected, taxBehavior),
	);
	const outOfStock = selected.stock === 0;
	const max = Math.max(1, Math.min(99, selected.stock ?? 99));
	const optionLabel = selected.combinations[0]?.variantValue.variantType.label;

	const add = () => {
		if (outOfStock) return;
		const qty = Math.min(quantity, max);
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
					product,
				},
			},
		});
		startMutation(async () => {
			const result = await addToCart(selected.id, qty);
			if (result.success && result.cart) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<div className="space-y-6">
			<p className="flex items-baseline gap-2 font-serif text-2xl tabular-nums">
				{list > price && (
					<span className="text-muted-foreground line-through">
						<span className="sr-only">Was </span>
						{fmt(list)}
					</span>
				)}
				<span>{fmt(price)}</span>
			</p>
			{variants.length > 1 && optionLabel && (
				<fieldset>
					<legend className="mb-2 text-sm font-semibold">
						{optionLabel}:
						<span className="font-normal">
							{" "}
							{selected.combinations.map((c) => c.variantValue.value).join(" / ")}
						</span>
					</legend>
					<div className="flex flex-wrap gap-x-4 gap-y-2">
						{variants.map((v) => {
							const value = v.combinations.map((c) => c.variantValue.value).join(" / ");
							// a dot only identifies a variant when colour is its only option
							const color =
								v.combinations.length === 1
									? v.combinations.find((c) => c.variantValue.variantType.type === "color")?.variantValue
											.colorValue
									: undefined;
							const isSelected = v.id === selected.id;
							return color ? (
								<button
									key={v.id}
									type="button"
									aria-pressed={isSelected}
									aria-label={value}
									title={value}
									onClick={() => setSelectedId(v.id)}
									className={cn(
										"h-8 w-8 rounded-full border p-0.5 transition-colors",
										isSelected ? "border-foreground" : "border-line-subtle hover:border-foreground",
									)}
								>
									<span className="block h-full w-full rounded-full" style={{ backgroundColor: color }} />
								</button>
							) : (
								<button
									key={v.id}
									type="button"
									aria-pressed={isSelected}
									onClick={() => setSelectedId(v.id)}
									className={cn(
										"py-1 text-sm underline-offset-[6px] transition-colors",
										isSelected ? "underline" : "text-muted-foreground hover:text-foreground",
									)}
								>
									{value}
								</button>
							);
						})}
					</div>
				</fieldset>
			)}
			<div className="flex flex-col gap-4">
				<p className="-mb-2 text-sm font-semibold">Quantity</p>
				<div className="inline-flex h-12 w-fit items-center rounded-md border border-line">
					<button
						type="button"
						aria-label="Decrease quantity"
						disabled={quantity <= 1}
						onClick={() => setQuantity((q) => Math.max(1, q - 1))}
						className="flex h-full w-11 items-center justify-center disabled:opacity-40"
					>
						<Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
					</button>
					<span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
						<span className="sr-only">Quantity </span>
						{quantity}
					</span>
					<button
						type="button"
						aria-label="Increase quantity"
						disabled={quantity >= max}
						onClick={() => setQuantity((q) => Math.min(max, q + 1))}
						className="flex h-full w-11 items-center justify-center disabled:opacity-40"
					>
						<Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
					</button>
				</div>
				<button type="button" onClick={add} disabled={outOfStock} className="btn btn-primary w-full">
					{outOfStock ? "Sold out" : "Add to cart"}
				</button>
			</div>
		</div>
	);
}
