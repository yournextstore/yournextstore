"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useMemo, useState } from "react";
import { formatMoney } from "../../../src/money";
import { addToCart } from "./actions";
import { QuantitySelector } from "./quantity-selector";
import { TrustBadges } from "./trust-badges";
import { VariantSelector } from "./variant-selector";

type Variant = {
	id: string;
	price: string;
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

const currency = "USD";
const locale = "en-US";

export function AddToCartButton({ variants }: { variants: Variant[] }) {
	const searchParams = useSearchParams();
	const [quantity, setQuantity] = useState(1);

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

	const [, formAction, isPending] = useActionState(async () => {
		if (selectedVariant) {
			await addToCart(selectedVariant.id, quantity);
		}
		return null;
	}, null);

	const totalPrice = selectedVariant ? BigInt(selectedVariant.price) * BigInt(quantity) : null;

	const buttonText = useMemo(() => {
		if (isPending) return "Adding...";
		if (!selectedVariant) return "Select options";
		if (totalPrice) {
			return `Add to Cart — ${formatMoney({ amount: totalPrice, currency, locale })}`;
		}
		return "Add to Cart";
	}, [isPending, selectedVariant, totalPrice]);

	return (
		<div className="space-y-8">
			{variants.length > 1 && <VariantSelector variants={variants} selectedVariantId={selectedVariant?.id} />}

			<QuantitySelector quantity={quantity} onQuantityChange={setQuantity} disabled={isPending} />

			<form action={formAction}>
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
