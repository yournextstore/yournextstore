"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { useCurrency } from "@/components/currency-provider";
import { formatMoney } from "@/lib/money";

export type VolumeTier = {
	id: string;
	price: string;
	minQuantity: number;
	maxQuantity: number | null;
	productVariantId: string | null;
};

export function useVolumePricing(
	tiers: VolumeTier[],
	selectedVariantId: string | undefined,
	quantity: number,
) {
	const resolvedTiers = useMemo(() => {
		if (tiers.length === 0 || !selectedVariantId) return [];
		const variantTiers = tiers.filter((t) => t.productVariantId === selectedVariantId);
		const productTiers = tiers.filter((t) => !t.productVariantId);
		return (variantTiers.length > 0 ? variantTiers : productTiers).sort(
			(a, b) => a.minQuantity - b.minQuantity,
		);
	}, [tiers, selectedVariantId]);

	const volumePrice = useMemo(() => {
		for (let i = resolvedTiers.length - 1; i >= 0; i--) {
			const tier = resolvedTiers[i];
			if (
				tier &&
				quantity >= tier.minQuantity &&
				(tier.maxQuantity === null || quantity <= tier.maxQuantity)
			) {
				return tier.price;
			}
		}
		return null;
	}, [resolvedTiers, quantity]);

	return { resolvedTiers, volumePrice };
}

export function VolumePricingDisplay({
	tiers,
	quantity,
	volumePrice,
}: {
	tiers: VolumeTier[];
	quantity: number;
	volumePrice: string | null;
}) {
	const t = useTranslations("VolumePricing");
	const locale = useLocale();
	const { currency } = useCurrency();

	if (tiers.length === 0) return null;

	return (
		<>
			{volumePrice && (
				<p className="text-sm text-muted-foreground">
					{t("perUnitAtQty", {
						price: formatMoney({ amount: BigInt(volumePrice), currency, locale }),
						quantity,
					})}
				</p>
			)}

			<div>
				<p className="text-sm font-medium mb-2">{t("buyMoreSaveMore")}</p>
				<div className="overflow-hidden rounded-lg border border-border text-sm">
					<table className="w-full">
						<thead>
							<tr className="bg-muted/50 text-muted-foreground">
								<th className="px-3 py-1.5 text-left font-medium">{t("quantity")}</th>
								<th className="px-3 py-1.5 text-right font-medium">{t("pricePerUnit")}</th>
							</tr>
						</thead>
						<tbody>
							{tiers.map((tier, index) => {
								const isActive =
									quantity >= tier.minQuantity && (tier.maxQuantity === null || quantity <= tier.maxQuantity);
								return (
									<tr
										key={tier.id}
										className={
											isActive ? "bg-foreground/5 font-semibold" : index % 2 === 1 ? "bg-muted/20" : ""
										}
									>
										<td className="px-3 py-1.5">
											{tier.maxQuantity ? `${tier.minQuantity}–${tier.maxQuantity}` : `${tier.minQuantity}+`}
										</td>
										<td className="px-3 py-1.5 text-right font-medium">
											{formatMoney({ amount: BigInt(tier.price), currency, locale })}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
