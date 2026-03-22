"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState, useTransition } from "react";
import { addToCart } from "@/app/[locale]/cart/actions";
import { useCart } from "@/app/[locale]/cart/cart-context";
import { QuantitySelector } from "@/app/[locale]/product/[slug]/quantity-selector";
import { TrustBadges } from "@/app/[locale]/product/[slug]/trust-badges";
import { VariantSelector } from "@/app/[locale]/product/[slug]/variant-selector";
import {
	useVolumePricing,
	VolumePricingDisplay,
	type VolumeTier,
} from "@/app/[locale]/product/[slug]/volume-pricing";

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
	volumePricingTiers?: VolumeTier[];
	priceDisplay?: string;
};

export function AddToCartButton({
	variants,
	product,
	volumePricingTiers = [],
	priceDisplay,
}: AddToCartButtonProps) {
	const searchParams = useSearchParams();
	const [quantity, setQuantity] = useState(1);
	const [isPending, startTransition] = useTransition();
	const { openCart, dispatch } = useCart();
	const t = useTranslations("Product");

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

	const { resolvedTiers, volumePrice } = useVolumePricing(volumePricingTiers, selectedVariant?.id, quantity);

	const buttonText = useMemo(() => {
		if (isPending) return t("adding");
		if (!selectedVariant) return t("selectOptions");
		if (priceDisplay && quantity === 1) {
			return t("addToCartWithPrice", { price: priceDisplay });
		}
		return t("addToCart");
	}, [isPending, selectedVariant, priceDisplay, quantity, t]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedVariant) return;

		openCart();

		startTransition(async () => {
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
			setQuantity(1);
		});
	};

	return (
		<div className="space-y-8">
			{variants.length > 1 && <VariantSelector variants={variants} selectedVariantId={selectedVariant?.id} />}

			<QuantitySelector quantity={quantity} onQuantityChange={setQuantity} disabled={isPending} />

			<VolumePricingDisplay tiers={resolvedTiers} quantity={quantity} volumePrice={volumePrice} />

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
