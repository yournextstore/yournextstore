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

type Badge = {
	label: string;
	className: string;
};

export function ProductCard({
	product,
	badge,
	priority,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	badge?: Badge;
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
		<div className="group relative">
			{badge && (
				<span
					className={`absolute top-3 left-3 z-10 inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-[0.14em] uppercase shadow-sm ${badge.className}`}
				>
					{badge.label}
				</span>
			)}
			<YnsLink prefetch={"eager"} href={`/product/${product.slug}`} className="block">
				<div className="relative aspect-square overflow-hidden rounded-sm bg-[color:var(--sand)]">
					<div
						aria-hidden
						className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.55)_0%,transparent_60%)]"
					/>
					{primaryImage &&
						(isVideoUrl(primaryImage) ? (
							<video
								className={`absolute inset-0 w-full h-full object-contain p-6 transition-all duration-700 group-hover:scale-[1.03] ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
								className={`object-contain p-6 transition-all duration-700 group-hover:scale-[1.03] ${secondaryImage ? "group-hover:opacity-0" : ""}`}
								priority={priority}
							/>
						))}
					{secondaryImage &&
						(isVideoUrl(secondaryImage) ? (
							<video
								className="absolute inset-0 w-full h-full object-contain p-6 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
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
								className="object-contain p-6 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
							/>
						))}
				</div>
			</YnsLink>
			<div className="mt-5 flex items-end justify-between gap-4">
				<div className="min-w-0">
					<h3 className="font-serif text-[19px] leading-snug text-foreground truncate">
						<YnsLink prefetch={"eager"} href={`/product/${product.slug}`}>
							{product.name}
						</YnsLink>
					</h3>
					<p className="mt-1 text-[15px] font-semibold text-foreground">{priceDisplay}</p>
				</div>
				{singleVariant ? (
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
				) : (
					<YnsLink
						href={`/product/${product.slug}`}
						aria-label={`View ${product.name}`}
						className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[color:var(--ink)] text-cream hover:bg-[color:var(--oxblood)] transition-colors"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
							<path d="M3 6h18" />
							<path d="M16 10a4 4 0 0 1-8 0" />
						</svg>
					</YnsLink>
				)}
			</div>
		</div>
	);
}
