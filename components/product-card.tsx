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

type ProductCardProps = {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	previewMode?: boolean;
};

export function ProductCard({ product, priority = false, previewMode = false }: ProductCardProps) {
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
	const brand = "category" in product && product.category?.name ? product.category.name : "Your Next Store";
	const href = previewMode ? `/product/${product.slug}?preview=1` : `/product/${product.slug}`;

	const swatches =
		variants
			?.flatMap((v) => v.combinations)
			?.filter((c) => c.variantValue.variantType.type === "color")
			?.map((c) => c.variantValue) ?? [];
	const uniqueSwatches = Array.from(new Map(swatches.map((s) => [s.value, s])).values()).slice(0, 4);

	return (
		<YnsLink prefetch={"eager"} href={href} className="group block">
			<div className="relative aspect-[3/4] gallery-frame overflow-hidden">
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
							className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							className={`object-cover transition-opacity duration-700 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							alt={`${product.name} — alternate`}
							fill
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
						/>
					))}
			</div>
			<div className="mt-3 sm:mt-4 space-y-[2px]">
				<p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{brand}</p>
				<h3 className="text-[13px] sm:text-sm text-foreground line-clamp-1 leading-tight">{product.name}</h3>
				<p className="text-[13px] sm:text-sm font-medium text-foreground pt-1">{priceDisplay}</p>
				{uniqueSwatches.length > 0 && (
					<div className="flex gap-1.5 pt-2">
						{uniqueSwatches.map((s) => (
							<span
								key={s.id}
								className="block w-3 h-3 rounded-full border border-border/60"
								style={{ backgroundColor: s.colorValue ?? "#ddd" }}
								title={s.value}
							/>
						))}
					</div>
				)}
			</div>
		</YnsLink>
	);
}
