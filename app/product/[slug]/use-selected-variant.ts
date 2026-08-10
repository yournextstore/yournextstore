"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type VariantLike = {
	combinations: {
		variantValue: {
			value: string;
			variantType: {
				label: string;
			};
		};
	}[];
};

/**
 * Derives the currently-selected variant from the URL search params: the single
 * variant when there is only one, otherwise the variant whose combinations all
 * match the `?<variantType.label>=<value>` params (or undefined when none match).
 */
export function useSelectedVariant<T extends VariantLike>(variants: T[]): T | undefined {
	const searchParams = useSearchParams();

	return useMemo(() => {
		if (variants.length === 1) {
			return variants[0];
		}

		if (searchParams.size === 0) {
			return undefined;
		}

		return variants.find((variant) =>
			variant.combinations.every(
				(combination) =>
					searchParams.get(combination.variantValue.variantType.label) === combination.variantValue.value,
			),
		);
	}, [variants, searchParams]);
}
