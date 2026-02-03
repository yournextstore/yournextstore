"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
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
	selectedVariantId: string | undefined;
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
				});
			}

			return acc;
		},
		{} as Record<string, VariantGroup>,
	);

	return Object.values(groupedByLabel);
}

export function VariantSelector({ variants, selectedVariantId }: VariantSelectorProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const variantGroups = processVariants(variants);

	// Build Maps for O(1) lookups
	const { groupByLabel, optionsByValue, optionsById } = useMemo(() => {
		const groupByLabel = new Map(variantGroups.map((g) => [g.label, g]));
		const optionsByValue = new Map(
			variantGroups.map((g) => [g.label, new Map(g.options.map((o) => [o.value, o]))]),
		);
		const optionsById = new Map(
			variantGroups.map((g) => [g.label, new Map(g.options.map((o) => [o.id, o]))]),
		);
		return { groupByLabel, optionsByValue, optionsById };
	}, [variantGroups]);

	const selectedOptions = useMemo(() => {
		const paramsOptions: Record<string, string> = {};
		searchParams.forEach((valueName, key) => {
			const option = optionsByValue.get(key)?.get(valueName);
			if (option) {
				paramsOptions[key] = option.id;
			}
		});
		return paramsOptions;
	}, [searchParams, optionsByValue]);

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
		const params = new URLSearchParams();
		firstVariant.combinations.forEach((c) => {
			params.set(c.variantValue.variantType.label, c.variantValue.value);
		});
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}, [variants, searchParams.size, pathname]);

	if (variantGroups.length === 0) {
		return null;
	}

	return (
		<div className="space-y-8">
			{variantGroups.map((group) => {
				const selectedOptionId = selectedOptions[group.label];
				const selectedOption = selectedOptionId
					? optionsById.get(group.label)?.get(selectedOptionId)
					: undefined;

				return (
					<div key={group.label}>
						{group.type === "color" ? (
							<>
								<div className="mb-4 flex items-center justify-between">
									<span className="text-xs tracking-[0.2em] uppercase text-zinc-400">{group.label}</span>
									{selectedOption && (
										<span className="text-xs text-zinc-500">{selectedOption.value}</span>
									)}
								</div>
								<div className="flex gap-3">
									{group.options.map((option) => {
										const isSelected = selectedOptions[group.label] === option.id;
										const isLightColor =
											option.colorValue?.toUpperCase() === "#FFFFFF" ||
											option.colorValue?.toUpperCase() === "#FFFFF0" ||
											option.colorValue?.toUpperCase() === "#FFF";

										return (
											<button
												key={option.id}
												type="button"
												onClick={() => handleOptionSelect(group.label, option.id)}
												className={cn(
													"relative h-10 w-10 transition-all duration-300",
													isSelected
														? "ring-1 ring-zinc-900 ring-offset-2 ring-offset-[#FAFAF8]"
														: "hover:ring-1 hover:ring-zinc-300 hover:ring-offset-2 hover:ring-offset-[#FAFAF8]",
												)}
												style={{ backgroundColor: option.colorValue ?? "#fff" }}
												aria-label={option.value}
												title={option.value}
											>
												{isLightColor && (
													<span className="absolute inset-0 border border-zinc-200" />
												)}
											</button>
										);
									})}
								</div>
							</>
						) : (
							<>
								<div className="mb-4">
									<span className="text-xs tracking-[0.2em] uppercase text-zinc-400">{group.label}</span>
								</div>
								<div className="flex flex-wrap gap-3">
									{group.options.map((option) => {
										const isSelected = selectedOptions[group.label] === option.id;

										return (
											<button
												key={option.id}
												type="button"
												onClick={() => handleOptionSelect(group.label, option.id)}
												className={cn(
													"px-6 py-3 text-xs tracking-[0.1em] uppercase transition-all duration-300 border",
													isSelected
														? "border-zinc-900 bg-zinc-900 text-white"
														: "border-zinc-200 bg-transparent text-zinc-900 hover:border-zinc-400",
												)}
											>
												{option.value}
											</button>
										);
									})}
								</div>
							</>
						)}
					</div>
				);
			})}
		</div>
	);
}
