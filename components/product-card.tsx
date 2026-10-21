import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/** Lowest shown price of a product, for client-side sorting of a rendered grid. */
export function cardSortPrice(product: CardProduct, taxBehavior: "inclusive" | "exclusive") {
	const variants = "variants" in product ? product.variants : [];
	return variants.length > 0 ? Number(priceRange(variants, taxBehavior).min) : 0;
}

export async function ProductCard({
	product,
	priority = false,
	headingLevel = "h3",
}: {
	product: CardProduct;
	priority?: boolean;
	/** h2 on listing pages that have no section heading between the h1 and the grid. */
	headingLevel?: "h2" | "h3";
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `${fmt(minPrice)} – ${fmt(maxPrice)}`
			: minPrice
				? fmt(minPrice)
				: null;

	// The original's "Sale" badge and struck-through price, from the first variant's list price.
	const firstVariant = variants?.[0];
	const listPrice = firstVariant ? displayPrice(firstVariant, taxBehavior, "originalPrice") : null;
	const onSale =
		firstVariant && listPrice && variants?.length === 1
			? BigInt(listPrice) > BigInt(displayPrice(firstVariant, taxBehavior))
			: false;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];

	const singleVariant = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const variantSearch = (() => {
		if (!onlyVariant || !("combinations" in onlyVariant) || onlyVariant.combinations.length === 0) {
			return "";
		}
		const params = new URLSearchParams();
		for (const combination of onlyVariant.combinations) {
			params.set(combination.variantValue.variantType.label, combination.variantValue.value);
		}
		return `?${params.toString()}`;
	})();

	const Heading = headingLevel;

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className="group relative block rounded-lg transition hover:bg-tile/60"
		>
			<div className="relative overflow-hidden rounded-lg bg-tile">
				<div className="relative aspect-square">
					{primaryImage &&
						(isVideoUrl(primaryImage) ? (
							<video
								className="absolute inset-0 h-full w-full object-cover"
								src={primaryImage}
								muted
								loop
								autoPlay
								playsInline
							/>
						) : (
							<YNSMedia
								src={primaryImage}
								alt=""
								fill
								sizes="(max-width: 768px) 50vw, 280px"
								className="object-cover transition duration-300 group-hover:scale-[1.03]"
								priority={priority}
							/>
						))}
				</div>
				{onSale ? (
					<span className="absolute top-3 left-3 rounded-md bg-ink px-2.5 py-1 text-[12px] font-semibold text-paper">
						Sale
					</span>
				) : null}
				{singleVariant && (
					<QuickAddButton
						variantId={singleVariant.id}
						variantSku={"sku" in singleVariant ? singleVariant.sku : null}
						variantPrice={singleVariant.price}
						variantPriceGross={"priceGross" in singleVariant ? singleVariant.priceGross : null}
						variantImages={singleVariant.images}
						product={{
							id: product.id,
							name: product.name,
							slug: product.slug,
							images: product.images ?? [],
						}}
					/>
				)}
			</div>
			<div className="flex flex-col items-center justify-center gap-1.5 px-2 py-3 text-center sm:gap-2 sm:px-4">
				<Heading className="line-clamp-2 text-[14px] font-medium group-hover:underline group-hover:underline-offset-4 sm:text-[15px]">
					{product.name}
				</Heading>
				<p className="text-[16px] text-muted-foreground sm:text-[18px]">
					{onSale && listPrice ? <s className="mr-1.5 text-[13px]">{fmt(BigInt(listPrice))}</s> : null}
					<span className={onSale ? "font-semibold text-pine-ink" : undefined}>{priceDisplay}</span>
				</p>
			</div>
		</Link>
	);
}
