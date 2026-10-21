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
	stock?: number | null;
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

	// An option is available when some in-stock variant carries it together with the other picks.
	const isAvailable = (label: string, optionId: string) =>
		variants.some(
			(variant) =>
				variant.stock !== 0 &&
				variant.combinations.some(
					(c) => c.variantValue.variantType.label === label && c.variantValue.id === optionId,
				) &&
				Object.entries(selectedOptions).every(
					([otherLabel, otherId]) =>
						otherLabel === label ||
						variant.combinations.some(
							(c) => c.variantValue.variantType.label === otherLabel && c.variantValue.id === otherId,
						),
				),
		);

	return groupsWithChoices.map((group) => (
		<fieldset key={group.label} className="m-0 mb-6 border-0 p-0">
			<legend className="mb-3 text-xs tracking-[0.18em] text-[#a3a3a3] uppercase">{group.label}</legend>
			<div className="flex flex-wrap gap-2">
				{group.options.map((option) => {
					const isActive = selectedOptions[group.label] === option.id;
					const available = isAvailable(group.label, option.id);
					return (
						<button
							key={option.id}
							type="button"
							onClick={() => handleOptionSelect(group.label, option.id)}
							aria-pressed={isActive}
							disabled={!available}
							title={`${group.label} ${option.value}${available ? "" : " (Out of Stock)"}`}
							className={cn(
								"flex min-h-9 items-center justify-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
								isActive && "cursor-default border-amber bg-amber/10 text-amber",
								!isActive && available && "border-white/15 text-bone hover:border-amber/50 hover:text-amber",
								!available &&
									"relative z-10 cursor-not-allowed overflow-hidden border-white/10 text-[#8a9a9c] before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-12 before:bg-white/20",
							)}
						>
							{group.type === "color" && option.colorValue ? (
								<span
									aria-hidden="true"
									className="h-3 w-3 rounded-full border border-white/20"
									style={{ backgroundColor: option.colorValue }}
								/>
							) : null}
							{option.value}
						</button>
					);
				})}
			</div>
		</fieldset>
	));
}
