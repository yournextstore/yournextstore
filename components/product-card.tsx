import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";
import { YnsLink } from "./yns-link";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export function ProductCard({
	product,
	priority = false,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
}) {
	const variants = "variants" in product ? product.variants : null;
	const firstVariantPrice = variants?.[0] ? BigInt(variants[0].price) : null;
	const { minPrice, maxPrice } =
		variants && firstVariantPrice !== null
			? variants.reduce(
					(acc, v) => {
						const price = BigInt(v.price);
						return {
							minPrice: price < acc.minPrice ? price : acc.minPrice,
							maxPrice: price > acc.maxPrice ? price : acc.maxPrice,
						};
					},
					{ minPrice: firstVariantPrice, maxPrice: firstVariantPrice },
				)
			: { minPrice: null, maxPrice: null };

	const hasMultiplePrices = !!(
		variants &&
		variants.length > 1 &&
		minPrice &&
		maxPrice &&
		minPrice !== maxPrice
	);

	const priceDisplay = hasMultiplePrices
		? `From ${formatMoney({ amount: minPrice as bigint, currency: CURRENCY, locale: LOCALE })}`
		: minPrice
			? formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })
			: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	const singleVariant = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;
	const ctaLabel = singleVariant ? "Add to cart" : "Choose options";

	return (
		<div className="group flex flex-col">
			<YnsLink prefetch={"eager"} href={`/product/${product.slug}`} className="block">
				<div className="relative aspect-square overflow-hidden bg-white border-2 border-yns-cocoa/10 rounded-sm shadow-[0_2px_0_0_rgba(59,36,24,0.08)] transition-all duration-300 group-hover:border-yns-green/40 group-hover:shadow-[6px_6px_0_0_rgba(15,138,59,0.18)] group-hover:-translate-y-0.5">
					{singleVariant && (
						<QuickAddButton
							variantId={singleVariant.id}
							variantPrice={singleVariant.price}
							variantImages={singleVariant.images}
							product={{
								id: product.id,
								name: product.name,
								slug: product.slug,
								images: product.images ?? [],
							}}
						/>
					)}
					{primaryImage &&
						(isVideoUrl(primaryImage) ? (
							<video
								className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
								src={primaryImage}
								muted
								loop
								autoPlay
								playsInline
							/>
						) : (
							<YNSMedia
								src={primaryImage}
								alt={product.name}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
								className={`object-cover transition-all duration-500 ${secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"}`}
								priority={priority}
							/>
						))}
					{secondaryImage &&
						(isVideoUrl(secondaryImage) ? (
							<video
								className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								src={secondaryImage}
								muted
								loop
								autoPlay
								playsInline
							/>
						) : (
							<YNSMedia
								src={secondaryImage}
								alt={`${product.name} - alternate view`}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
								className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							/>
						))}
				</div>
				<div className="mt-4 space-y-0.5">
					<h3 className="font-handwritten text-xl uppercase tracking-wider text-yns-cocoa leading-tight">
						{product.name}
					</h3>
					{priceDisplay && (
						<p className="text-sm font-medium text-yns-cocoa/70">
							{priceDisplay} {!hasMultiplePrices && <span className="uppercase">{CURRENCY}</span>}
						</p>
					)}
				</div>
			</YnsLink>
			<YnsLink
				prefetch={"eager"}
				href={`/product/${product.slug}`}
				className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-sm bg-yns-green text-white text-sm font-extrabold uppercase tracking-wider transition-all hover:bg-yns-green-dark active:translate-y-0.5"
			>
				{ctaLabel}
			</YnsLink>
		</div>
	);
}
