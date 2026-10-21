"use client";

import { ChevronDown } from "lucide-react";
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

	// Size-like selects first, then the colour dots, as in the original.
	const groupsWithChoices = variantGroups
		.filter((group) => group.options.length > 1)
		.toSorted((a, b) => Number(a.type === "color") - Number(b.type === "color"));

	if (groupsWithChoices.length === 0) {
		return null;
	}

	return (
		<div className="space-y-6">
			{groupsWithChoices.map((group) => {
				const selectedOptionId = selectedOptions[group.label];
				const selectedOption = selectedOptionId
					? optionsById.get(group.label)?.get(selectedOptionId)
					: undefined;

				if (group.type === "color") {
					return (
						<fieldset key={group.label} className="m-0 border-0 p-0">
							<legend className="mb-4 text-sal-sm font-bold text-muted-foreground">
								Choose {group.label.toLowerCase()}
								{selectedOption && <span className="text-foreground">: {selectedOption.value}</span>}
							</legend>
							<div className="flex flex-wrap gap-x-5 gap-y-3 pl-2.5">
								{group.options.map((option) => {
									const isSelected = selectedOptionId === option.id;
									const light = isLightColor(option.colorValue);
									return (
										<button
											key={option.id}
											type="button"
											onClick={() => handleOptionSelect(group.label, option.id)}
											aria-label={option.value}
											aria-pressed={isSelected}
											title={option.value}
											className={cn(
												"relative h-[30px] w-[30px] shrink-0 rounded-full transition-transform duration-200 hover:border-2 hover:border-[#f1f1f1]",
												isSelected && "scale-120 border-2 border-[#f1f1f1]",
												light && !isSelected && "border border-border",
											)}
											style={{ backgroundColor: option.colorValue ?? "#fff" }}
										>
											{isSelected && (
												<span
													aria-hidden="true"
													className={cn(
														"absolute inset-0 flex items-center justify-center text-sal-sm",
														light ? "text-foreground" : "text-white",
													)}
												>
													✓
												</span>
											)}
										</button>
									);
								})}
							</div>
						</fieldset>
					);
				}

				const selectId = `variant-${group.label.replace(/\W+/g, "-").toLowerCase()}`;
				return (
					<div key={group.label}>
						<label htmlFor={selectId} className="mb-4 block text-sal-sm font-bold text-muted-foreground">
							{group.label}
						</label>
						<div className="relative">
							<select
								id={selectId}
								value={selectedOptionId ?? ""}
								onChange={(e) => handleOptionSelect(group.label, e.target.value)}
								className="h-[38px] w-full appearance-none rounded-[4px] border border-[#ccc] bg-white pr-12 pl-2.5 text-base font-normal text-foreground focus:border-[#2684ff] focus:outline-none focus:ring-1 focus:ring-[#2684ff]"
							>
								{!selectedOptionId && <option value="">--Select {group.label}--</option>}
								{group.options.map((option) => (
									<option key={option.id} value={option.id}>
										{option.value}
									</option>
								))}
							</select>
							<span
								aria-hidden="true"
								className="pointer-events-none absolute inset-y-2 right-0 flex items-center border-l border-[#ccc] px-2 text-[#999]"
							>
								<ChevronDown className="h-5 w-5" strokeWidth={1.75} />
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}

function isLightColor(hex: string | null) {
	if (!hex) return true;
	const value = hex.replace("#", "");
	const full = value.length === 3 ? [...value].map((c) => c + c).join("") : value;
	const n = Number.parseInt(full.slice(0, 6), 16);
	if (Number.isNaN(n)) return true;
	const r = (n >> 16) & 255;
	const g = (n >> 8) & 255;
	const b = n & 255;
	return 0.299 * r + 0.587 * g + 0.114 * b > 186;
}
