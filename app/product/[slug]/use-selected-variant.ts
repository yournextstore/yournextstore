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

/** Derives the selected variant from `?<variantType.label>=<value>` params; partial links still resolve. */
export function useSelectedVariant<T extends VariantLike>(variants: T[]): T | undefined {
	const searchParams = useSearchParams();

	return useMemo(() => {
		if (variants.length === 1) {
			return variants[0];
		}

		if (searchParams.size === 0) {
			return undefined;
		}

		// Labels present in the URL must match; absent ones are wildcards. Score = matched labels,
		// so a full match outranks a partial one and a variant matching nothing is dropped.
		const score = (variant: T) => {
			let matched = 0;
			for (const { variantValue } of variant.combinations) {
				const param = searchParams.get(variantValue.variantType.label);
				if (param === null) continue;
				if (param !== variantValue.value) return 0;
				matched += 1;
			}
			return matched;
		};

		return variants
			.map((variant) => ({ variant, score: score(variant) }))
			.filter(({ score }) => score > 0)
			.sort((a, b) => b.score - a.score)[0]?.variant;
	}, [variants, searchParams]);
}
