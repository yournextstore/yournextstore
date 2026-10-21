import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { getProductThumbnail } from "@/lib/utils";

export type CardProduct =
	| APIProductsBrowseResult["data"][number]
	| APICollectionGetByIdResult["productCollections"][number]["product"]
	| NonNullable<APIProductGetByIdResult>;

/** Price, sale price, quick-add variant and the small grey line under a product's name. */
export async function getCardInfo(product: CardProduct) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : [];
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	const { min, max } = variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const first = variants[0];
	const firstPrice = first ? BigInt(displayPrice(first, taxBehavior)) : null;
	const listRaw = first ? displayPrice(first, taxBehavior, "originalPrice") : null;
	const listPrice = listRaw ? BigInt(listRaw) : null;

	// A zero-priced set or bundle shows no price rather than "$0.00".
	const price = min === null || min === 0n ? null : min === max ? fmt(min) : `from ${fmt(min)}`;
	// A struck-through list price only when every variant shares the one price that is on sale.
	const compareAt =
		min !== null && min === max && firstPrice !== null && listPrice !== null && listPrice > firstPrice
			? fmt(listPrice)
			: null;

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const quickAdd = oneTimeAllowed && variants.length === 1 && first && first.stock !== 0 ? first : null;

	const colours = new Set(
		variants.flatMap((v) =>
			("combinations" in v ? v.combinations : [])
				.filter(
					(c) =>
						c.variantValue.variantType.type === "color" || /colou?r/i.test(c.variantValue.variantType.label),
				)
				.map((c) => c.variantValue.value),
		),
	);
	const category = "category" in product && product.category ? product.category.name : null;
	const meta = [category, colours.size > 1 ? `${colours.size} colours` : null].filter(Boolean).join(" · ");

	const image = getProductThumbnail(product.images ?? []) ?? getProductThumbnail(first?.images ?? []);

	return { price, compareAt, quickAdd, meta, category, image };
}
