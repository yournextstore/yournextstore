import { useMemo } from "react";
import { CURRENCY, LOCALE } from "@/lib/constants";
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
	if (tiers.length === 0) return null;

	return (
		<div className="space-y-3">
			{volumePrice && (
				<p className="text-sm text-[var(--color-on-surface-variant)]">
					{formatMoney({ amount: BigInt(volumePrice), currency: CURRENCY, locale: LOCALE })} per unit at qty{" "}
					{quantity}
				</p>
			)}
			<div>
				<p className="label-caps mb-2">Buy more, save more</p>
				<div className="neo-border bg-[var(--color-surface-container-lowest)] overflow-hidden">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-[var(--color-surface-container)] border-b border-foreground">
								<th className="px-3 py-2 text-left label-caps">Quantity</th>
								<th className="px-3 py-2 text-right label-caps">Price / unit</th>
							</tr>
						</thead>
						<tbody>
							{tiers.map((tier) => {
								const isActive =
									quantity >= tier.minQuantity && (tier.maxQuantity === null || quantity <= tier.maxQuantity);
								return (
									<tr
										key={tier.id}
										className={`border-t border-foreground first:border-t-0 ${
											isActive
												? "bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-semibold"
												: ""
										}`}
									>
										<td className="px-3 py-2">
											{tier.maxQuantity ? `${tier.minQuantity}–${tier.maxQuantity}` : `${tier.minQuantity}+`}
										</td>
										<td className="px-3 py-2 text-right font-semibold tabular-nums">
											{formatMoney({ amount: BigInt(tier.price), currency: CURRENCY, locale: LOCALE })}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
