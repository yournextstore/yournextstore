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

const TINTS = [
	"bg-[#FFE8B5]",
	"bg-[#FBC6A4]",
	"bg-[#F7D26B]",
	"bg-[#FFEFC8]",
	"bg-[#F9B79E]",
	"bg-[#FFE0A8]",
];

export function ProductCard({
	product,
	priority = false,
	tintIndex = 0,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	tintIndex?: number;
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
			? `${formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })} - ${formatMoney({ amount: maxPrice, currency: CURRENCY, locale: LOCALE })}`
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
	const tint = TINTS[tintIndex % TINTS.length];

	return (
		<YnsLink prefetch={"eager"} href={`/product/${product.slug}`} className="group">
			<div
				className={`relative aspect-square ${tint} rounded-3xl overflow-hidden mb-3 border-2 border-yns-brown/10 transition-transform group-hover:-translate-y-1 group-hover:shadow-[0_8px_0_var(--yns-brown)]`}
			>
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
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							className={`object-cover transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							priority={priority}
						/>
					))}

				{priceDisplay && (
					<div className="absolute bottom-3 right-3 bg-yns-red text-yns-cream-soft font-display text-sm sm:text-base px-3 py-1 rounded-full border-2 border-yns-cream-soft shadow-[0_3px_0_var(--yns-brown)]">
						{priceDisplay}
					</div>
				)}
			</div>
			<div className="text-center px-1">
				<h3 className="font-display text-yns-brown text-base sm:text-lg leading-tight">{product.name}</h3>
				<p className="text-xs sm:text-sm text-yns-brown/60 italic mt-0.5">Tap for details</p>
			</div>
		</YnsLink>
	);
}
