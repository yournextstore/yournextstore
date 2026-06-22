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

const DEFAULT_SWATCHES = [
	"var(--tizz-orange)",
	"var(--tizz-blue)",
	"var(--tizz-yellow)",
	"var(--tizz-purple)",
];

function pickSwatchFromId(id: string) {
	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
	}
	return DEFAULT_SWATCHES[hash % DEFAULT_SWATCHES.length];
}

export function ProductCard({
	product,
	swatch,
	priority,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	swatch?: string;
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
	const bg = swatch ?? pickSwatchFromId(product.id);

	return (
		<YnsLink prefetch={"eager"} href={`/product/${product.slug}`} className="group block">
			<div
				className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-[var(--tizz-deep)] mb-3 transition-transform group-hover:-translate-y-1"
				style={{ background: bg }}
			>
				<div className="absolute inset-0 tizz-noise" />
				{/* Halo */}
				<div
					className="absolute inset-0 opacity-50 mix-blend-screen pointer-events-none"
					style={{
						background: "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.45) 0%, transparent 55%)",
					}}
				/>
				{/* Quick add */}
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
				{/* Price chip */}
				{priceDisplay && (
					<div className="absolute top-3 right-3 bg-[var(--tizz-cream)] border-2 border-[var(--tizz-deep)] rounded-full px-3 py-1 tizz-overline text-[10px] sm:text-xs text-[var(--tizz-deep)] z-10">
						{priceDisplay}
					</div>
				)}

				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							src={primaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<div className="absolute inset-0 p-6">
							<YNSMedia
								src={primaryImage}
								alt={product.name}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
								className={`object-contain transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							/>
						</div>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 w-full h-full object-contain p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							src={secondaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<div className="absolute inset-0 p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
							<YNSMedia
								src={secondaryImage}
								alt={`${product.name} - alternate view`}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
								className="object-contain"
								priority={priority}
							/>
						</div>
					))}
			</div>
			<div className="flex items-baseline justify-between gap-2 px-1">
				<h3 className="tizz-display text-[var(--tizz-deep)] text-lg sm:text-xl leading-tight truncate">
					{product.name}
				</h3>
				<span className="tizz-overline text-[var(--tizz-orange)] text-xs shrink-0">Shop →</span>
			</div>
		</YnsLink>
	);
}
