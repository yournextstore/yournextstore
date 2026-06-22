import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { previewHref } from "@/lib/demo-products";
import { formatMoney } from "@/lib/money";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";
import { YnsLink } from "./yns-link";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

type ProductCardProps = {
	product: BrowseProduct | CollectionProduct | FullProduct;
	isPreview?: boolean;
	priority?: boolean;
};

export function ProductCard({ product, isPreview = false, priority = false }: ProductCardProps) {
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
		<YnsLink
			prefetch={"eager"}
			href={previewHref(`/product/${product.slug}`, isPreview)}
			className="group block"
		>
			<div className="relative aspect-[4/5] bg-sand rounded-md overflow-hidden">
				{singleVariant && !isPreview && (
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
							className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-[1.03]"}`}
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
							priority={priority}
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							className={`object-cover transition-all duration-700 ease-out ${secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-[1.04]"}`}
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
				<div
					aria-hidden="true"
					className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-walnut/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
				/>
			</div>
			<div className="mt-4 px-1">
				<h3 className="font-serif text-lg text-walnut leading-snug text-balance">{product.name}</h3>
				{priceDisplay && (
					<p className="mt-1.5 text-[11px] uppercase tracking-[0.22em] text-clay">{priceDisplay}</p>
				)}
			</div>
		</YnsLink>
	);
}
