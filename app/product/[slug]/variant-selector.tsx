"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type VariantValue = {
	id: string;
	value: string;
	colorValue: string | null;
	position?: number | null;
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
	position: number;
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

	// Track seen option IDs per label for O(1) deduplication
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
					position: variantValue.position ?? 0,
				});
			}

			return acc;
		},
		{} as Record<string, VariantGroup>,
	);

	return Object.values(groupedByLabel).map((group) => ({
		...group,
		options: [...group.options].sort((a, b) => a.position - b.position),
	}));
}

export function VariantSelector({ variants }: VariantSelectorProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
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
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	// Auto-redirect to first variant when no URL params exist (for multi-variant products)
	useEffect(() => {
		if (variants.length <= 1 || searchParams.size > 0) return;

		const firstVariant = variants[0];
		if (!firstVariant) return;
		const params = new URLSearchParams();
		firstVariant.combinations.forEach((c) => {
			params.set(c.variantValue.variantType.label, c.variantValue.value);
		});
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}, [variants, searchParams.size, pathname]);

	const groupsWithChoices = variantGroups.filter((group) => group.options.length > 1);

	if (groupsWithChoices.length === 0) {
		return null;
	}

	// The original's compact pickers: a small outlined native select per option group, or a
	// row of swatches for colour groups, inline beside the price.
	return (
		<div className="flex flex-wrap items-center gap-2">
			{groupsWithChoices.map((group) => {
				const selectedOptionId = selectedOptions[group.label];
				const selectId = `variant-${group.label.replace(/\W+/g, "-").toLowerCase()}`;

				if (group.type === "color") {
					return (
						<fieldset key={group.label} className="m-0 flex items-center gap-1 border-0 p-0">
							<legend className="sr-only">{group.label}</legend>
							{group.options.map((option) => {
								const isSelected = selectedOptionId === option.id;
								return (
									<button
										key={option.id}
										type="button"
										onClick={() => handleOptionSelect(group.label, option.id)}
										aria-pressed={isSelected}
										aria-label={option.value}
										title={option.value}
										className="inline-flex h-7 w-7 items-center justify-center rounded-full"
									>
										<span
											aria-hidden="true"
											className={cn(
												"block h-5 w-5 rounded-full border border-ink/30",
												isSelected && "ring-1 ring-ink ring-offset-2 ring-offset-background",
											)}
											style={{ backgroundColor: option.colorValue ?? "#fff" }}
										/>
									</button>
								);
							})}
						</fieldset>
					);
				}

				return (
					<div key={group.label} className="relative w-32 overflow-hidden rounded border border-ink">
						<label htmlFor={selectId} className="sr-only">
							{group.label}
						</label>
						<select
							id={selectId}
							value={selectedOptionId ?? ""}
							onChange={(e) => handleOptionSelect(group.label, e.currentTarget.value)}
							className="block w-full appearance-none bg-transparent py-1 pr-6 pl-2 leading-none"
						>
							{!selectedOptionId && (
								<option value="" disabled>
									{group.label}
								</option>
							)}
							{group.options.map((option) => (
								<option key={option.id} value={option.id}>
									{option.value}
								</option>
							))}
						</select>
						<svg
							aria-hidden="true"
							viewBox="0 0 10 6"
							className="pointer-events-none absolute top-1/2 right-2 h-1.5 w-2.5 -translate-y-1/2"
						>
							<path d="M0 0h10L5 6z" fill="currentColor" />
						</svg>
					</div>
				);
			})}
		</div>
	);
}
