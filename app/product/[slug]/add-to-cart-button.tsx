"use client";

import { useSearchParams } from "next/navigation";
import { startTransition, useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { QuantitySelector } from "@/app/product/[slug]/quantity-selector";
import { TrustBadges } from "@/app/product/[slug]/trust-badges";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

type Variant = {
	id: string;
	price: string;
	images: string[];
	stock: number | null;
	combinations: {
		variantValue: {
			id: string;
			value: string;
			colorValue: string | null;
			variantType: {
				id: string;
				type: "string" | "color";
				label: string;
			};
		};
	}[];
};

type AddToCartButtonProps = {
	variants: Variant[];
	product: {
		id: string;
		name: string;
		slug: string;
		images: string[];
	};
	volumePricingTiers?: VolumeTier[];
};

export function AddToCartButton({ variants, product, volumePricingTiers = [] }: AddToCartButtonProps) {
	const searchParams = useSearchParams();
	const [quantity, setQuantity] = useState(1);
	const { items, openCart, dispatch } = useCart();

	const selectedVariant = useMemo(() => {
		if (variants.length === 1) {
			return variants[0];
		}

		if (searchParams.size === 0) {
			return undefined;
		}

		const paramsOptions: Record<string, string> = {};
		searchParams.forEach((valueName, key) => {
			paramsOptions[key] = valueName;
		});

		return variants.find((variant) =>
			variant.combinations.every(
				(combination) =>
					paramsOptions[combination.variantValue.variantType.label] === combination.variantValue.value,
			),
		);
	}, [variants, searchParams]);

	// stock === null means stock isn't tracked for this variant (unlimited)
	const isOutOfStock = selectedVariant?.stock === 0;
	const maxQuantity = selectedVariant?.stock ?? 99;
	const effectiveQuantity = isOutOfStock ? 1 : Math.min(quantity, maxQuantity);

	const { resolvedTiers, volumePrice } = useVolumePricing(
		volumePricingTiers,
		selectedVariant?.id,
		effectiveQuantity,
	);

	const unitPrice = volumePrice ?? selectedVariant?.price;
	const totalPrice = unitPrice ? BigInt(unitPrice) * BigInt(effectiveQuantity) : null;

	const buttonText = useMemo(() => {
		if (!selectedVariant) return "Select options";
		if (isOutOfStock) return "Out of stock";
		if (totalPrice) {
			return `Add to Cart — ${formatMoney({ amount: totalPrice, currency: CURRENCY, locale: LOCALE })}`;
		}
		return "Add to Cart";
	}, [selectedVariant, isOutOfStock, totalPrice]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedVariant || isOutOfStock) return;

		const variantId = selectedVariant.id;
		const addedQuantity = effectiveQuantity;
		const previousQuantity = items.find((item) => item.productVariant.id === variantId)?.quantity ?? 0;

		openCart();
		setQuantity(1);

		startTransition(async () => {
			dispatch({
				type: "ADD_ITEM",
				item: {
					quantity: addedQuantity,
					productVariant: {
						id: variantId,
						price: selectedVariant.price,
						images: selectedVariant.images,
						product,
					},
				},
			});

			// The server clamps line quantities to available stock and still responds
			// with the updated cart — compare against what we asked for so the
			// optimistic item doesn't silently vanish on revert.
			const result = await addToCart(variantId, addedQuantity);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === variantId);
			if (!result.success || !line) {
				toast.error("This item is out of stock");
			} else if (line.quantity < previousQuantity + addedQuantity) {
				toast.warning(`Only ${line.quantity} in stock — quantity adjusted`);
			}
		});
	};

	return (
		<div className="space-y-8">
			{variants.length > 1 && <VariantSelector variants={variants} selectedVariantId={selectedVariant?.id} />}

			<QuantitySelector
				quantity={effectiveQuantity}
				onQuantityChange={setQuantity}
				max={Math.max(1, Math.min(99, maxQuantity))}
				disabled={isOutOfStock}
			/>

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			<form onSubmit={handleSubmit}>
				<button
					type="submit"
					disabled={!selectedVariant || isOutOfStock}
					className="w-full h-14 bg-foreground text-primary-foreground py-4 px-8 rounded-full text-base font-medium tracking-wide hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{buttonText}
				</button>
			</form>

			<TrustBadges />
		</div>
	);
}
