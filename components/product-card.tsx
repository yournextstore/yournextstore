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

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `${formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })} – ${formatMoney({ amount: maxPrice, currency: CURRENCY, locale: LOCALE })}`
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

	return (
		<YnsLink prefetch={"eager"} href={`/product/${product.slug}`} className="group">
			<div className="relative aspect-[4/5] bg-yns-mist rounded-2xl overflow-hidden">
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
							className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							className={`object-cover transition-all duration-700 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							priority={priority}
						/>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
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
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
						/>
					))}
			</div>
			<div className="mt-4 flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h3 className="yns-display text-base sm:text-lg text-foreground leading-tight truncate">
						{product.name}
					</h3>
					<p className="text-xs text-muted-foreground mt-1 uppercase tracking-[0.14em]">Home decor</p>
				</div>
				<p className="text-sm font-medium text-foreground shrink-0 whitespace-nowrap">{priceDisplay}</p>
			</div>
		</YnsLink>
	);
}
