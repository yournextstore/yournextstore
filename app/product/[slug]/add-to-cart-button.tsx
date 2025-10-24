"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useMemo } from "react";
import { addToCart } from "./actions";
import { VariantSelector } from "./variant-selector";

type Variant = {
	id: string;
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

export function AddToCartButton({ variants }: { variants: Variant[] }) {
	const searchParams = useSearchParams();

	const selectedVariantId = useMemo(() => {
		if (variants.length === 1) {
			return variants[0].id;
		}

		if (searchParams.size === 0) {
			return undefined;
		}

		const paramsOptions: Record<string, string> = {};
		searchParams.forEach((valueName, key) => {
			paramsOptions[key] = valueName;
		});

		const matchingVariant = variants.find((variant) =>
			variant.combinations.every(
				(combination) =>
					paramsOptions[combination.variantValue.variantType.label] === combination.variantValue.value,
			),
		);

		return matchingVariant?.id;
	}, [variants, searchParams]);

	const [, formAction, isPending] = useActionState(async () => {
		if (selectedVariantId) {
			await addToCart(selectedVariantId);
		}
		return null;
	}, null);

	return (
		<div className="space-y-6">
			{variants.length > 1 && <VariantSelector variants={variants} selectedVariantId={selectedVariantId} />}

			<form action={formAction}>
				<button
					type="submit"
					disabled={isPending || !selectedVariantId}
					className="w-full bg-black text-white py-4 px-8 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isPending ? "Adding..." : "Add to Cart"}
				</button>
			</form>
		</div>
	);
}
