import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayTierPrice, type TaxBehavior } from "@/lib/pricing";

export type VolumeTier = {
	id: string;
	price: string;
	priceGross?: string | null;
	minQuantity: number;
	maxQuantity: number | null;
	productVariantId: string | null;
};

/** `volumePrice` comes back in the basis the shopper should see, ready to format. */
export function useVolumePricing(
	tiers: VolumeTier[],
	selectedVariantId: string | undefined,
	quantity: number,
	taxBehavior: TaxBehavior,
) {
	// A variant's own tiers win over the product-wide ones.
	const variantTiers = tiers.filter((t) => t.productVariantId === selectedVariantId);
	const resolvedTiers = selectedVariantId
		? (variantTiers.length > 0 ? variantTiers : tiers.filter((t) => !t.productVariantId)).toSorted(
				(a, b) => a.minQuantity - b.minQuantity,
			)
		: [];

	const tier = resolvedTiers.findLast(
		(t) => quantity >= t.minQuantity && (t.maxQuantity === null || quantity <= t.maxQuantity),
	);

	return { resolvedTiers, volumePrice: tier ? displayTierPrice(tier, taxBehavior) : null };
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
	const { currency, locale, taxBehavior } = useStoreConfig();
	if (tiers.length === 0) return null;

	return (
		<div className="space-y-3">
			{volumePrice && (
				<p className="text-sm text-[var(--color-on-surface-variant)]">
					{formatMoney({ amount: BigInt(volumePrice), currency, locale })} per unit at qty {quantity}
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
											{formatMoney({
												amount: BigInt(displayTierPrice(tier, taxBehavior)),
												currency,
												locale,
											})}
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
