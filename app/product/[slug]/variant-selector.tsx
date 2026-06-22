"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { setUrlQuery, useUrlQuery } from "@/lib/url-query";
import { cn } from "@/lib/utils";

type VariantValue = {
	id: string;
	value: string;
	colorValue: string | null;
	variantType: {
		id: string;
		type: "string" | "color";
		label: string;
	};
};

type Combination = {
	variantValue: VariantValue;
};

type Variant = {
	id: string;
	combinations: Combination[];
};

type VariantOption = {
	id: string;
	value: string;
	colorValue: string | null;
};

type VariantGroup = {
	label: string;
	type: "string" | "color";
	options: VariantOption[];
};

type VariantSelectorProps = {
	variants: Variant[];
};

function processVariants(variants: Variant[]) {
	const allCombinations = variants.flatMap((variant) =>
		variant.combinations.map((combination) => ({
			variantValue: combination.variantValue,
		})),
	);

	const seenOptionIds = new Map<string, Set<string>>();

	const groupedByLabel = allCombinations.reduce(
		(acc, { variantValue }) => {
			const { label, type } = variantValue.variantType;

			if (!acc[label]) {
				acc[label] = {
					label,
					type,
					options: [],
				};
				seenOptionIds.set(label, new Set());
			}

			const seenIds = seenOptionIds.get(label);
			if (seenIds && !seenIds.has(variantValue.id)) {
				seenIds.add(variantValue.id);
				acc[label].options.push({
					id: variantValue.id,
					value: variantValue.value,
					colorValue: variantValue.colorValue,
				});
			}

			return acc;
		},
		{} as Record<string, VariantGroup>,
	);

	return Object.values(groupedByLabel);
}

export function VariantSelector({ variants }: VariantSelectorProps) {
	const searchParams = useUrlQuery();
	const pathname = usePathname();
	const variantGroups = processVariants(variants);

	// Maps for O(1) lookups; the React Compiler memoizes them on `variants`.
	const optionsByValue = new Map(
		variantGroups.map((g) => [g.label, new Map(g.options.map((o) => [o.value, o]))]),
	);
	const optionsById = new Map(variantGroups.map((g) => [g.label, new Map(g.options.map((o) => [o.id, o]))]));

	const selectedOptions = Object.fromEntries(
		[...searchParams].flatMap(([key, valueName]) => {
			const option = optionsByValue.get(key)?.get(valueName);
			return option ? [[key, option.id]] : [];
		}),
	);

	const handleOptionSelect = (label: string, optionId: string) => {
		const newSelectedOptions = { ...selectedOptions, [label]: optionId };

		const params = Object.entries(newSelectedOptions).reduce((acc, [key, value]) => {
			const option = optionsById.get(key)?.get(value);
			if (option) {
				acc.set(key, option.value);
			}
			return acc;
		}, new URLSearchParams());
		// History API instead of router.push: the page doesn't depend on the query, so no server round trip.
		setUrlQuery(`${pathname}?${params.toString()}`);
	};

	// Auto-redirect to first variant when no URL params exist (for multi-variant products). Checks the live address:
	// the hydration render reads an empty query, and this effect runs before the re-render that sees the real one.
	useEffect(() => {
		if (variants.length <= 1 || searchParams.size > 0 || window.location.search.length > 1) return;

		const firstVariant = variants[0];
		if (!firstVariant) return;
		const params = new URLSearchParams();
		firstVariant.combinations.forEach((c) => {
			params.set(c.variantValue.variantType.label, c.variantValue.value);
		});
		setUrlQuery(`${pathname}?${params.toString()}`, { replace: true });
	}, [variants, searchParams.size, pathname]);

	if (variantGroups.length === 0) {
		return null;
	}

	return (
		<div className="space-y-6">
			{variantGroups.map((group) => {
				const selectedOptionId = selectedOptions[group.label];
				const selectedOption = selectedOptionId
					? optionsById.get(group.label)?.get(selectedOptionId)
					: undefined;

				return (
					<fieldset key={group.label} className="border-0 p-0 m-0">
						<div className="mb-3 flex items-center justify-between">
							<legend className="label-caps">{group.label}</legend>
							{selectedOption && (
								<span className="text-sm text-[var(--color-on-surface-variant)]">{selectedOption.value}</span>
							)}
						</div>
						{group.type === "color" ? (
							<div className="flex flex-wrap gap-3">
								{group.options.map((option) => {
									const isSelected = selectedOptions[group.label] === option.id;
									return (
										<button
											key={option.id}
											type="button"
											onClick={() => handleOptionSelect(group.label, option.id)}
											className={cn(
												"relative h-11 w-11 neo-border transition-all",
												isSelected
													? "neo-shadow translate-x-[-2px] translate-y-[-2px]"
													: "hover:neo-shadow-sm",
											)}
											style={{ backgroundColor: option.colorValue ?? "#fff" }}
											aria-label={option.value}
											aria-pressed={isSelected}
											title={option.value}
										/>
									);
								})}
							</div>
						) : (
							<div className="flex flex-wrap gap-2">
								{group.options.map((option) => {
									const isSelected = selectedOptions[group.label] === option.id;
									return (
										<button
											key={option.id}
											type="button"
											onClick={() => handleOptionSelect(group.label, option.id)}
											aria-pressed={isSelected}
											className={cn(
												"label-caps neo-border px-4 h-11 inline-flex items-center transition-colors",
												isSelected
													? "bg-foreground text-background"
													: "bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)]",
											)}
										>
											{option.value}
										</button>
									);
								})}
							</div>
						)}
					</fieldset>
				);
			})}
		</div>
	);
}
