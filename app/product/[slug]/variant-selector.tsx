"use client";

import { Check } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
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
	price?: string;
	priceGross?: string;
	stock?: number | null;
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
	const { currency, locale, taxBehavior } = useStoreConfig();
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

	// With one choice to make, each tile is a whole variant: it shows its price, and a sold-out one is
	// drawn in dashes and cannot be chosen, as the original draws a paper size its scan cannot hold.
	const single = groupsWithChoices.length === 1;
	const variantFor = (label: string, optionId: string) =>
		single
			? variants.find((v) =>
					v.combinations.some(
						(c) => c.variantValue.variantType.label === label && c.variantValue.id === optionId,
					),
				)
			: undefined;

	return (
		<div className="grid gap-6">
			{groupsWithChoices.map((group) => {
				const selectedOptionId = selectedOptions[group.label];
				const selectedOption = selectedOptionId
					? optionsById.get(group.label)?.get(selectedOptionId)
					: undefined;

				return (
					<fieldset
						key={group.label}
						className="m-0 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 border-0 p-0 text-sm"
					>
						<legend className="float-left font-semibold">{group.label}</legend>
						<span className="justify-self-end text-muted-foreground">{selectedOption?.value}</span>
						{group.type === "color" ? (
							<div className="col-span-full flex flex-wrap gap-3">
								{group.options.map((option) => {
									const isSelected = selectedOptions[group.label] === option.id;
									return (
										<button
											key={option.id}
											type="button"
											onClick={() => handleOptionSelect(group.label, option.id)}
											aria-pressed={isSelected}
											className={cn(
												"relative size-11 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)] transition-shadow",
												isSelected
													? "ring-2 ring-copper ring-offset-2 ring-offset-background"
													: "hover:ring-1 hover:ring-strong hover:ring-offset-2 hover:ring-offset-background",
											)}
											style={{ backgroundColor: option.colorValue ?? "#fff" }}
											aria-label={option.value}
											title={option.value}
										/>
									);
								})}
							</div>
						) : (
							<div className="col-span-full grid grid-cols-2 gap-3">
								{group.options.map((option) => {
									const isSelected = selectedOptions[group.label] === option.id;
									const variant = variantFor(group.label, option.id);
									const soldOut = variant?.stock === 0;
									const price =
										variant?.price !== undefined
											? displayPrice({ price: variant.price, priceGross: variant.priceGross }, taxBehavior)
											: null;
									return (
										<button
											key={option.id}
											type="button"
											onClick={() => handleOptionSelect(group.label, option.id)}
											aria-pressed={isSelected}
											disabled={soldOut && !isSelected}
											className={cn(
												"relative grid gap-0.5 rounded-control px-4 py-3.5 text-left shadow-[inset_0_0_0_1px_var(--input)] transition-[box-shadow,background-color] hover:shadow-[inset_0_0_0_1px_var(--stroke-strong)]",
												isSelected &&
													"bg-copper-wash shadow-[inset_0_0_0_2px_var(--copper)] hover:shadow-[inset_0_0_0_2px_var(--copper)]",
												soldOut &&
													"cursor-not-allowed text-faint shadow-none outline-1 -outline-offset-1 outline-dashed outline-input hover:shadow-none",
											)}
										>
											<span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
												<span className="text-base font-semibold">{option.value}</span>
												{soldOut ? (
													<span className="text-[0.8125rem] font-medium">Sold out</span>
												) : (
													price && (
														<span className="text-[0.9375rem] font-semibold tabular-nums">
															{formatMoney({ amount: BigInt(price), currency, locale })}
														</span>
													)
												)}
											</span>
											{isSelected && (
												<Check
													aria-hidden="true"
													strokeWidth={2.4}
													className="absolute -right-[0.4375rem] -top-[0.4375rem] size-5 rounded-full bg-copper p-[0.1875rem] text-background"
												/>
											)}
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
