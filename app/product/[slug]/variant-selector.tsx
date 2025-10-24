"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

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
		<div className="space-y-6">
			{variantGroups.map((group) => (
				<div key={group.label}>
					<h3 className="text-sm font-semibold text-gray-900 mb-3">{group.label}</h3>
					{group.type === "color" ? (
						<div className="flex gap-2">
							{group.options.map((option) => (
								<button
									key={option.id}
									type="button"
									onClick={() => handleOptionSelect(group.label, option.id)}
									className={`w-10 h-10 rounded-full border-2 transition-all ${
										selectedOptions[group.label] === option.id
											? "border-black ring-2 ring-black ring-offset-2"
											: "border-gray-300 hover:border-gray-400"
									}`}
									style={{ backgroundColor: option.colorValue ?? "#fff" }}
									aria-label={option.value}
									title={option.value}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-wrap gap-2">
							{group.options.map((option) => (
								<button
									key={option.id}
									type="button"
									onClick={() => handleOptionSelect(group.label, option.id)}
									className={`px-6 py-3 rounded-lg border text-sm font-medium transition-all ${
										selectedOptions[group.label] === option.id
											? "border-black bg-black text-white"
											: "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
									}`}
								>
									{option.value}
								</button>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
