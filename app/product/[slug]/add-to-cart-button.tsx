"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
<<<<<<< HEAD:src/app/product/[slug]/add-to-cart-button.tsx
<<<<<<< HEAD:app/product/[slug]/add-to-cart-button.tsx
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { QuantitySelector } from "@/app/product/[slug]/quantity-selector";
import { TrustBadges } from "@/app/product/[slug]/trust-badges";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
=======
import { formatMoney } from "../../../money";
=======
import { formatMoney } from "../../../src/money";
>>>>>>> 1f54d19 (refactor: app/ in root for v0):app/product/[slug]/add-to-cart-button.tsx
import { addToCart } from "../../cart/actions";
import { useCart } from "../../cart/cart-context";
import { QuantitySelector } from "./quantity-selector";
import { TrustBadges } from "./trust-badges";
import { VariantSelector } from "./variant-selector";
>>>>>>> 74ad60e (feat: optimistic update):src/app/product/[slug]/add-to-cart-button.tsx

type Variant = {
	id: string;
	price: string;
	images: string[];
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
<<<<<<< HEAD:app/product/[slug]/add-to-cart-button.tsx
	volumePricingTiers?: VolumeTier[];
};

export function AddToCartButton({ variants, product, volumePricingTiers = [] }: AddToCartButtonProps) {
=======
};

const currency = "USD";
const locale = "en-US";

export function AddToCartButton({ variants, product }: AddToCartButtonProps) {
>>>>>>> 74ad60e (feat: optimistic update):src/app/product/[slug]/add-to-cart-button.tsx
	const searchParams = useSearchParams();
	const [quantity, setQuantity] = useState(1);
	const [isPending, startTransition] = useTransition();
	const { openCart, dispatch } = useCart();

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

<<<<<<< HEAD:app/product/[slug]/add-to-cart-button.tsx
	const { resolvedTiers, volumePrice } = useVolumePricing(volumePricingTiers, selectedVariant?.id, quantity);

	const unitPrice = volumePrice ?? selectedVariant?.price;
	const totalPrice = unitPrice ? BigInt(unitPrice) * BigInt(quantity) : null;
=======
	const totalPrice = selectedVariant ? BigInt(selectedVariant.price) * BigInt(quantity) : null;
>>>>>>> 74ad60e (feat: optimistic update):src/app/product/[slug]/add-to-cart-button.tsx

	const buttonText = useMemo(() => {
		if (isPending) return "Adding...";
		if (!selectedVariant) return "Select options";
		if (totalPrice) {
			return `Add to Cart — ${formatMoney({ amount: totalPrice, currency: CURRENCY, locale: LOCALE })}`;
		}
		return "Add to Cart";
	}, [isPending, selectedVariant, totalPrice]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedVariant) return;

<<<<<<< HEAD:app/product/[slug]/add-to-cart-button.tsx
		openCart();

		startTransition(async () => {
=======
		// Open cart sidebar
		openCart();

		// Execute server action with optimistic update
		startTransition(async () => {
			// Dispatch inside transition for optimistic update
>>>>>>> 74ad60e (feat: optimistic update):src/app/product/[slug]/add-to-cart-button.tsx
			dispatch({
				type: "ADD_ITEM",
				item: {
					quantity,
					productVariant: {
						id: selectedVariant.id,
						price: selectedVariant.price,
						images: selectedVariant.images,
						product,
					},
				},
			});

			await addToCart(selectedVariant.id, quantity);
<<<<<<< HEAD:app/product/[slug]/add-to-cart-button.tsx
=======
			// Reset quantity after add
>>>>>>> 74ad60e (feat: optimistic update):src/app/product/[slug]/add-to-cart-button.tsx
			setQuantity(1);
		});
	};

	return (
		<div className="space-y-8">
			{variants.length > 1 && <VariantSelector variants={variants} selectedVariantId={selectedVariant?.id} />}

			<QuantitySelector quantity={quantity} onQuantityChange={setQuantity} disabled={isPending} />

<<<<<<< HEAD:app/product/[slug]/add-to-cart-button.tsx
			<VolumePricingDisplay tiers={resolvedTiers} quantity={quantity} volumePrice={volumePrice} />

=======
>>>>>>> 74ad60e (feat: optimistic update):src/app/product/[slug]/add-to-cart-button.tsx
			<form onSubmit={handleSubmit}>
				<button
					type="submit"
					disabled={isPending || !selectedVariant}
					className="w-full h-14 bg-foreground text-primary-foreground py-4 px-8 rounded-full text-base font-medium tracking-wide hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{buttonText}
				</button>
			</form>

			<TrustBadges />
		</div>
	);
}
