"use client";

import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayPrice, type PricedVariant, priceRange } from "@/lib/pricing";

type Variant = PricedVariant & {
	id: string;
	originalPrice: string;
	originalPriceGross?: string | null;
	omnibusPrice: string | null;
	omnibusPriceGross?: string | null;
	combinations: { variantValue: { value: string; variantType: { label: string } } }[];
};

/**
 * The headline price under the product title: the selected variant's price, its list price
 * struck through when on sale (with the EU Omnibus 30-day low), or a range before a pick.
 */
export function ProductPrice({ variants }: { variants: Variant[] }) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const selectedVariant = useSelectedVariant(variants);
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	if (!selectedVariant) {
		if (variants.length === 0) return null;
		const { min, max } = priceRange(variants, taxBehavior);
		return <p className="my-3 text-xl sm:text-2xl">{min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`}</p>;
	}

	const price = BigInt(displayPrice(selectedVariant, taxBehavior));
	const listPrice = BigInt(
		displayPrice(selectedVariant, taxBehavior, "originalPrice") ?? displayPrice(selectedVariant, taxBehavior),
	);
	const onSale = listPrice > price;
	const lowest = onSale ? displayPrice(selectedVariant, taxBehavior, "omnibusPrice") : null;

	return (
		<div className="my-3">
			<p className="flex flex-wrap items-baseline gap-x-2 text-xl sm:text-2xl">
				{onSale && (
					<>
						<span className="sr-only">Was</span>
						<s className="text-contrast-500">{fmt(listPrice)}</s>
						<span className="sr-only">now</span>
					</>
				)}
				<span>{fmt(price)}</span>
			</p>
			{lowest && (
				<p className="mt-1 text-xs text-contrast-500">
					Lowest price in the last 30 days: {fmt(BigInt(lowest))}
				</p>
			)}
		</div>
	);
}
