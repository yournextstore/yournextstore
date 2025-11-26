"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { cn } from "../../../src/lib/utils";

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

	const groupedByLabel = allCombinations.reduce(
		(acc, { variantValue }) => {
			const { label, type } = variantValue.variantType;

			if (!acc[label]) {
				acc[label] = {
					label,
					type,
					options: [],
				};
			}

			const existingOption = acc[label].options.find((opt) => opt.id === variantValue.id);

			if (!existingOption) {
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
	const variantGroups = processVariants(variants);

	const selectedOptions = useMemo(() => {
		const paramsOptions: Record<string, string> = {};
		searchParams.forEach((valueName, key) => {
			const group = variantGroups.find((g) => g.label === key);
			const option = group?.options.find((opt) => opt.value === valueName);
			if (option) {
				paramsOptions[key] = option.id;
			}
		});
		return paramsOptions;
	}, [searchParams, variantGroups]);

	const handleOptionSelect = (label: string, optionId: string) => {
		const newSelectedOptions = { ...selectedOptions, [label]: optionId };

		const params = Object.entries(newSelectedOptions).reduce((acc, [key, value]) => {
			const option = variantGroups.find((g) => g.label === key)?.options.find((opt) => opt.id === value);
			if (option) {
				acc.set(key, option.value);
			}
			return acc;
		}, new URLSearchParams());
		router.push(`?${params.toString()}`, { scroll: false });
	};

	if (variantGroups.length === 0) {
		return null;
	}

	return (
		<div className="space-y-8">
			{variantGroups.map((group) => {
				const selectedOption = group.options.find((opt) => selectedOptions[group.label] === opt.id);

				return (
					<div key={group.label}>
						{group.type === "color" ? (
							<>
								<div className="mb-3 flex items-center justify-between">
									<span className="text-sm font-medium">{group.label}</span>
									{selectedOption && (
										<span className="text-sm text-muted-foreground">{selectedOption.value}</span>
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
													"relative h-12 w-12 rounded-full transition-all duration-200",
													isSelected
														? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
														: "hover:ring-2 hover:ring-muted-foreground hover:ring-offset-2 hover:ring-offset-background",
												)}
												style={{ backgroundColor: option.colorValue ?? "#fff" }}
												aria-label={option.value}
												title={option.value}
											>
												{isLightColor && (
													<span className="absolute inset-0 rounded-full border border-border" />
												)}
											</button>
										);
									})}
								</div>
							</>
						) : (
							<>
								<div className="mb-3 flex items-center justify-between">
									<span className="text-sm font-medium">{group.label}</span>
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
													"flex flex-col items-center rounded-lg border-2 px-6 py-3 transition-all duration-200",
													isSelected
														? "border-foreground bg-foreground text-primary-foreground"
														: "border-border bg-background hover:border-muted-foreground",
												)}
											>
												<span className="text-sm font-medium">{option.value}</span>
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
