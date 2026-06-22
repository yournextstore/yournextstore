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

const swatchPalette = [
	"radial-gradient(ellipse at 30% 30%, #f8d4d9 0%, #f2b7c1 60%, #e7969f 100%)",
	"radial-gradient(ellipse at 30% 30%, #fde4c8 0%, #f4ecdc 60%, #c8a98a 100%)",
	"radial-gradient(ellipse at 30% 30%, #ffd6dc 0%, #ffb1bf 60%, #e11226 100%)",
	"radial-gradient(ellipse at 30% 30%, #d7e3c1 0%, #b3c592 60%, #7a8b5a 100%)",
	"radial-gradient(ellipse at 30% 30%, #fbf6ec 0%, #f4ecdc 60%, #c8a98a 100%)",
	"radial-gradient(ellipse at 30% 30%, #f2b7c1 0%, #e11226 60%, #b30d1d 100%)",
];

export function ProductCard({
	product,
	index = 0,
	priority = false,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	index?: number;
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
	const swatch = swatchPalette[index % swatchPalette.length];

	return (
		<YnsLink prefetch={"eager"} href={`/product/${product.slug}`} className="group block">
			<div
				className="relative aspect-square overflow-hidden rounded-[3px] mb-5"
				style={{ background: swatch }}
			>
				<div aria-hidden="true" className="absolute inset-0 yns-grain opacity-30" />
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
							className={`absolute inset-0 w-full h-full object-contain p-6 mix-blend-multiply transition-all duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""} group-hover:scale-105`}
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
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className={`object-contain p-6 mix-blend-multiply transition-all duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""} group-hover:scale-105`}
							priority={priority}
						/>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 w-full h-full object-contain p-6 mix-blend-multiply opacity-0 transition-opacity duration-500 group-hover:opacity-100"
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
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-contain p-6 mix-blend-multiply opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					))}

				{priceDisplay && (
					<div className="absolute top-4 left-4 inline-flex items-center bg-[#fbf6ec] text-[#0f0f10] px-3 py-1 rounded-full text-[11px] tracking-wider font-semibold shadow-sm">
						{priceDisplay}
					</div>
				)}
			</div>
			<div className="space-y-1 px-1">
				<h3 className="font-serif text-xl italic text-[#0f0f10] tracking-tight leading-tight">
					{product.name}
				</h3>
				<p className="text-[10px] tracking-[0.32em] uppercase text-[#e11226] font-semibold">Add to cart →</p>
			</div>
		</YnsLink>
	);
}
