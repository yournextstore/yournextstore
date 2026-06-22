import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { HeartIcon } from "lucide-react";
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

	const subtitle = product.name;

	return (
		<YnsLink prefetch={"eager"} href={`/product/${product.slug}`} className="group block">
			{/* Image area with rounded corners, light gradient background, and name pill */}
			<div className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden bg-gradient-to-br from-[#f3eee9] via-[#f7f3ee] to-[#efe9e2] ring-1 ring-black/5">
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 w-full h-full object-contain p-3 sm:p-4 transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							className={`object-cover transition-transform duration-500 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					))}

				{/* Lime green name pill (top-left) */}
				<div className="absolute left-3 right-12 bottom-3 z-10 pointer-events-none">
					<div className="inline-flex max-w-full items-center rounded-full bg-[#d9f560] pl-3.5 pr-3 py-1.5 shadow-sm">
						<span className="truncate text-[11px] sm:text-xs font-semibold text-[#0f0f0f] leading-tight">
							{subtitle}
						</span>
					</div>
				</div>

				{/* Quick add button (bottom-right, styled +) */}
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
			</div>

			{/* Card footer with name, heart, price + Card button */}
			<div className="mt-3 rounded-[1.5rem] bg-white ring-1 ring-black/5 px-4 py-3.5 shadow-[0_4px_18px_-12px_rgba(15,15,15,0.15)]">
				<div className="flex items-start justify-between gap-3">
					<h3 className="text-[15px] font-semibold text-[#0f0f0f] leading-tight tracking-tight line-clamp-2">
						{product.name}
					</h3>
					<button
						type="button"
						aria-label="Add to wishlist"
						className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:text-[#ff6b35] transition-colors"
					>
						<HeartIcon className="h-4 w-4" />
					</button>
				</div>
				<div className="mt-3 flex items-center justify-between gap-3">
					<p className="text-lg font-display text-[#0f0f0f]">{priceDisplay}</p>
					<span className="inline-flex items-center justify-center rounded-full bg-[#0f0f0f] px-4 py-1.5 text-xs font-medium text-white group-hover:bg-[#ff6b35] transition-colors">
						Card
					</span>
				</div>
			</div>
		</YnsLink>
	);
}
