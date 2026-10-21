import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/**
 * Soul's product card: a 5:6 rounded photograph on a light grey plate that zooms on hover,
 * then the name in semibold and the price (struck-through list price when on sale).
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(min-width: 80rem) 20vw, (min-width: 64rem) 25vw, (min-width: 42rem) 33vw, (min-width: 24rem) 50vw, 100vw",
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	sizes?: string;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `${fmt(minPrice)} – ${fmt(maxPrice)}`
			: minPrice
				? fmt(minPrice)
				: null;

	// A single variant on sale shows its list price struck through, like the original's price label.
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice = (() => {
		if (!onlyVariant || !("originalPrice" in onlyVariant)) return null;
		const original = displayPrice(onlyVariant, taxBehavior, "originalPrice");
		const current = displayPrice(onlyVariant, taxBehavior);
		return original && BigInt(original) > BigInt(current) ? fmt(BigInt(original)) : null;
	})();

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
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
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className={cn(
				"group flex min-w-0 flex-col gap-3 rounded-t-2xl rounded-b-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-4",
				className,
			)}
		>
			<div className="relative aspect-[5/6] overflow-hidden rounded-xl bg-contrast-100 md:rounded-2xl">
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className="absolute inset-0 h-full w-full object-cover"
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
							sizes={sizes}
							className="scale-100 object-cover transition-transform duration-500 ease-out select-none group-hover:scale-110"
							priority={priority}
						/>
					))}
			</div>
			<div className="mt-2 px-1 text-sm sm:mt-0 sm:text-base">
				<span className="line-clamp-2 font-semibold">{product.name}</span>
				{priceDisplay && (
					<span className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 font-medium">
						{listPrice && (
							<>
								<span className="sr-only">Was</span>
								<s className="font-normal text-contrast-500">{listPrice}</s>
								<span className="sr-only">now</span>
							</>
						)}
						<span>{priceDisplay}</span>
					</span>
				)}
			</div>
		</Link>
	);
}
