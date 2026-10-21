import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { badgeText } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

const SIZES = "(min-width: 1200px) 290px, (min-width: 768px) 45vw, 100vw";

/**
 * The original's service card as a product tile: a portrait photograph on the gold lattice band,
 * the category as a gold kicker, the name in Forum and the price in gold.
 */
export async function ProductCard({
	product,
	priority = false,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const priceDisplay =
		minPrice !== null && maxPrice !== null
			? minPrice !== maxPrice
				? `from ${fmt(minPrice)}`
				: fmt(minPrice)
			: null;
	const cheapest =
		variants && minPrice !== null
			? variants.find((v) => BigInt(displayPrice(v, taxBehavior)) === minPrice)
			: null;
	const listPrice = cheapest ? displayPrice(cheapest, taxBehavior, "originalPrice") : null;
	const compareAt =
		listPrice && minPrice !== null && BigInt(listPrice) > minPrice ? fmt(BigInt(listPrice)) : null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];
	const category = "category" in product && product.category ? product.category.name : null;
	const badge = "badge" in product ? badgeText(product.badge) : null;

	const singleVariant = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;
	const soldOut = Boolean(variants && variants.length > 0 && variants.every((v) => v.stock === 0));

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
	const href = `/product/${product.slug}${variantSearch}`;

	return (
		<div className="group relative text-center">
			<div className="pattern-band mb-5 py-[22px]">
				<Link href={href} tabIndex={-1} aria-hidden="true" className="relative block">
					<figure className="relative aspect-[285/336] overflow-hidden bg-eerie-4">
						{primaryImage &&
							(isVideoUrl(primaryImage) ? (
								<video
									className={`absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
									sizes={SIZES}
									className={`object-cover transition duration-500 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
									priority={priority}
								/>
							))}
						{secondaryImage && !isVideoUrl(secondaryImage) && (
							<YNSMedia
								src={secondaryImage}
								alt=""
								fill
								sizes={SIZES}
								className="object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
							/>
						)}
						{(badge || soldOut) && (
							<span className="absolute top-4 left-4 bg-black px-2.5 py-[5px] text-label-2 leading-[14px] font-bold tracking-1 text-gold uppercase">
								{soldOut ? "Sold out" : badge}
							</span>
						)}
					</figure>
				</Link>
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
			{category && <p className="mb-1 text-label-2 font-bold tracking-2 text-gold uppercase">{category}</p>}
			<h3 className="font-display text-title-3 text-white">
				<Link href={href} className="transition-colors hover:text-gold">
					{product.name}
				</Link>
			</h3>
			{priceDisplay && (
				<p className="mt-2 flex items-baseline justify-center gap-3">
					{compareAt && (
						<del className="text-label-1 text-silver">
							<span className="sr-only">Was </span>
							{compareAt}
						</del>
					)}
					<span className="text-body-3 leading-normal text-gold">{priceDisplay}</span>
				</p>
			)}
		</div>
	);
}
