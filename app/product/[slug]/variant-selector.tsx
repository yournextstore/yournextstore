"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { sentenceCase } from "@/lib/display";
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

	return (
		<div className="flex flex-col gap-6">
			{groupsWithChoices.map((group) => {
				const selectedOptionId = selectedOptions[group.label];
				const selectedOption = selectedOptionId
					? optionsById.get(group.label)?.get(selectedOptionId)
					: undefined;

				return (
					<fieldset key={group.label} className="m-0 border-0 p-0">
						<legend className="sr-only">{sentenceCase(group.label)}</legend>
						<p className="mb-3 flex items-baseline justify-center gap-2 md:justify-start" aria-hidden>
							<span className="font-semibold text-muted-foreground">{sentenceCase(group.label)}</span>
							{selectedOption && group.type === "color" && (
								<span className="text-sm text-muted-foreground">{selectedOption.value}</span>
							)}
						</p>
						{group.type === "color" ? (
							<div className="flex flex-wrap justify-center gap-3 md:justify-start">
								{group.options.map((option) => {
									const isSelected = selectedOptions[group.label] === option.id;
									return (
										<button
											key={option.id}
											type="button"
											onClick={() => handleOptionSelect(group.label, option.id)}
											aria-pressed={isSelected}
											aria-label={option.value}
											title={option.value}
											className={cn(
												"size-8 rounded-full border ring-2 ring-offset-1 transition duration-100",
												isSelected ? "ring-gray-800" : "ring-transparent hover:ring-gray-200",
											)}
											style={{ backgroundColor: option.colorValue ?? "#fff" }}
										/>
									);
								})}
							</div>
						) : (
							<div className="flex flex-wrap justify-center gap-3 md:justify-start">
								{group.options.map((option) => {
									const isSelected = selectedOptions[group.label] === option.id;
									return (
										<button
											key={option.id}
											type="button"
											onClick={() => handleOptionSelect(group.label, option.id)}
											aria-pressed={isSelected}
											className={cn(
												"flex h-8 min-w-12 items-center justify-center rounded-md border px-3 text-center text-sm font-semibold transition duration-100",
												isSelected
													? "border-sky bg-sky text-ink"
													: "border-border bg-white text-muted-foreground hover:bg-gray-100 active:bg-gray-200",
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
