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

const cardSurfaces = [
	"bg-pop-yellow",
	"bg-pop-mint",
	"bg-pop-pink-soft",
	"bg-pop-cream",
	"bg-pop-mint-soft",
	"bg-pop-yellow-soft",
];

function pickSurface(id: string) {
	let hash = 0;
	for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
	return cardSurfaces[hash % cardSurfaces.length];
}

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

	const singleVariant = variants?.length === 1 ? variants[0] : null;
	const surface = pickSurface(product.id);

	return (
		<YnsLink prefetch={"eager"} href={`/product/${product.slug}`} className="group">
			<div
				className={`relative aspect-square ${surface} rounded-[1.75rem] overflow-hidden mb-4 shadow-[5px_5px_0_rgba(47,47,47,0.92)] transition-transform group-hover:-translate-y-1 group-hover:shadow-[8px_8px_0_rgba(47,47,47,0.92)]`}
			>
				<div aria-hidden className="absolute inset-0 bg-pop-dots opacity-25 mix-blend-overlay" />
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
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className={`object-cover transition-all duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""} group-hover:scale-105`}
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
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							priority={priority}
						/>
					))}
			</div>
			<div className="flex items-end justify-between gap-3 px-1">
				<h3 className="font-display text-xl uppercase tracking-wide text-pop-ink leading-tight">
					{product.name}
				</h3>
				{priceDisplay && (
					<p className="shrink-0 rounded-full bg-pop-ink px-3 py-1 text-xs font-bold text-pop-yellow">
						{priceDisplay}
					</p>
				)}
			</div>
		</YnsLink>
	);
}
