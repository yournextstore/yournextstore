import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { badgeText } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export async function ProductCard({
	product,
	priority = false,
	variant = "listing",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	/** `home`: 4:5, rounded-lg (Featured grid); `listing`: 3:4, rounded-xl (catalogue grids). */
	variant?: "home" | "listing";
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const priceDisplay =
		minPrice && maxPrice && minPrice !== maxPrice
			? `${fmt(minPrice)} – ${fmt(maxPrice)}`
			: minPrice
				? fmt(minPrice)
				: null;

	// A struck-through list price only when every variant shares one sale (single price shown).
	const first = variants?.[0];
	const listPrice = first && minPrice === maxPrice ? displayPrice(first, taxBehavior, "originalPrice") : null;
	const compareAt = listPrice && minPrice && BigInt(listPrice) > minPrice ? BigInt(listPrice) : null;
	const discount =
		compareAt && minPrice ? Math.round((Number(compareAt - minPrice) / Number(compareAt)) * 100) : null;
	const badge = "badge" in product ? badgeText(product.badge) : null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const variantSearch = (() => {
		if (!onlyVariant || !("combinations" in onlyVariant) || onlyVariant.combinations.length === 0) {
			return "";
		}
		const params = new URLSearchParams();
		for (const combination of onlyVariant.combinations) {
			params.set(combination.variantValue.variantType.label, combination.variantValue.value);
		}
		return `?${params.toString()}`;
	})();

	return (
		<Link href={`/product/${product.slug}${variantSearch}`} className="shop-card group relative block">
			<div
				className={cn(
					"relative overflow-hidden bg-secondary",
					variant === "home" ? "aspect-4/5 rounded-lg" : "aspect-3/4 rounded-xl",
				)}
			>
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className="shop-card-img absolute inset-0 h-full w-full object-cover"
							src={primaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<YNSMedia
							src={primaryImage}
							alt=""
							fill
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							className="shop-card-img object-cover"
							priority={priority}
						/>
					))}
				{badge && (
					<span className="absolute top-3 left-3 rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-foreground">
						{badge}
					</span>
				)}
				{discount ? (
					<span className="absolute top-3 right-3 rounded-full bg-[#111827] px-2.5 py-1 text-[10px] font-bold text-white">
						−{discount}%
					</span>
				) : null}
			</div>
			<div className="mt-3 px-0.5">
				<h3 className="line-clamp-1 text-sm font-medium leading-snug text-foreground">{product.name}</h3>
				<div className="mt-1 flex flex-wrap items-baseline gap-x-2">
					{priceDisplay && (
						<span className="font-price text-sm font-bold tracking-[-0.02em] text-foreground">
							{priceDisplay}
						</span>
					)}
					{compareAt && (
						<span className="font-price text-xs tracking-[-0.02em] text-muted-foreground line-through">
							<span className="sr-only">Was </span>
							{fmt(compareAt)}
						</span>
					)}
				</div>
			</div>
		</Link>
	);
}
