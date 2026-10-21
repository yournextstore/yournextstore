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

	// The original's options are plain full-width bordered selects; colour types keep swatches.
	return (
		<div className="flex flex-col gap-2">
			{groupsWithChoices.map((group) => {
				const selectedOptionId = selectedOptions[group.label];
				const selectedOption = selectedOptionId
					? optionsById.get(group.label)?.get(selectedOptionId)
					: undefined;
				const selectId = `variant-${group.label.replace(/\W+/g, "-")}`;

				if (group.type === "color") {
					return (
						<fieldset key={group.label} className="m-0 border-0 p-0 py-1">
							<div className="mb-2 flex items-center justify-between text-sm">
								<legend>{group.label}</legend>
								{selectedOption && <span className="text-muted-foreground">{selectedOption.value}</span>}
							</div>
							<div className="flex flex-wrap gap-2">
								{group.options.map((option) => {
									const isSelected = selectedOptionId === option.id;
									return (
										<button
											key={option.id}
											type="button"
											onClick={() => handleOptionSelect(group.label, option.id)}
											className={cn(
												"h-10 w-10 border border-black/30 transition-shadow",
												isSelected && "outline outline-1 outline-offset-2 outline-black",
											)}
											style={{ backgroundColor: option.colorValue ?? "#fff" }}
											aria-label={option.value}
											aria-pressed={isSelected}
											title={option.value}
										/>
									);
								})}
							</div>
						</fieldset>
					);
				}

				return (
					<div key={group.label}>
						<label htmlFor={selectId} className="sr-only">
							{group.label}
						</label>
						<select
							id={selectId}
							value={selectedOptionId ?? ""}
							onChange={(event) => handleOptionSelect(group.label, event.target.value)}
							className="w-full border border-black/30 bg-white px-2 py-2 text-black/70 outline-none focus-visible:border-black"
						>
							{!selectedOptionId && <option value="">{group.label}</option>}
							{group.options.map((option) => (
								<option key={option.id} value={option.id}>
									{group.label}: {option.value}
								</option>
							))}
						</select>
					</div>
				);
			})}
		</div>
	);
}
