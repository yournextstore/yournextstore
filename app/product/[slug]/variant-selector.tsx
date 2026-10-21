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

	return (
		<div className="flex flex-col gap-5">
			{groupsWithChoices.map((group) => {
				const selectedOptionId = selectedOptions[group.label];
				const selectedOption = selectedOptionId
					? optionsById.get(group.label)?.get(selectedOptionId)
					: undefined;

				return (
					<fieldset key={group.label} className="m-0 min-w-0 border-0 p-0">
						<legend className="mb-2 flex w-full items-center justify-between gap-3 border-t border-border pt-4">
							<span className="font-semibold">{group.label}</span>
							<span className="rounded-full bg-secondary px-2 py-0.5 text-label-sm font-semibold">
								{selectedOption ? selectedOption.value : "Required"}
							</span>
						</legend>
						{group.type === "color" ? (
							<div className="flex flex-wrap gap-3 pt-1">
								{group.options.map((option) => {
									const isSelected = selectedOptions[group.label] === option.id;
									return (
										<button
											key={option.id}
											type="button"
											onClick={() => handleOptionSelect(group.label, option.id)}
											aria-pressed={isSelected}
											className={cn(
												"relative size-10 rounded-full border border-border transition-shadow",
												isSelected
													? "ring-2 ring-primary ring-offset-2 ring-offset-background"
													: "hover:ring-2 hover:ring-border-strong hover:ring-offset-2 hover:ring-offset-background",
											)}
											style={{ backgroundColor: option.colorValue ?? "#fff" }}
											aria-label={option.value}
											title={option.value}
										/>
									);
								})}
							</div>
						) : (
							<div className="flex flex-col">
								{group.options.map((option) => {
									const isSelected = selectedOptions[group.label] === option.id;
									return (
										<button
											key={option.id}
											type="button"
											onClick={() => handleOptionSelect(group.label, option.id)}
											aria-pressed={isSelected}
											className="flex min-h-11 items-center justify-between gap-4 border-b border-border py-2 text-left text-body-sm transition-colors last:border-b-0 hover:text-primary"
										>
											<span className={cn(isSelected && "font-semibold")}>{option.value}</span>
											<span
												aria-hidden="true"
												className={cn(
													"grid size-5 shrink-0 place-items-center rounded-full border",
													isSelected ? "border-primary bg-primary" : "border-border-strong bg-card",
												)}
											>
												{isSelected ? <span className="size-2 rounded-full bg-primary-foreground" /> : null}
											</span>
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
