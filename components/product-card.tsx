import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/**
 * The original's product tile: a tall photograph with soft corners that square off on hover,
 * then name and price on one line underneath.
 */
export async function ProductCard({
	product,
	priority = false,
	imageClassName = "aspect-[9/14]",
	sizes = "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw",
}: {
	product: CardProduct;
	priority?: boolean;
	imageClassName?: string;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `${formatMoney({ amount: minPrice, currency, locale })} – ${formatMoney({ amount: maxPrice, currency, locale })}`
			: minPrice
				? formatMoney({ amount: minPrice, currency, locale })
				: null;

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
		<Link href={`/product/${product.slug}${variantSearch}`} className="group relative block">
			<div
				className={cn(
					"relative w-full overflow-hidden rounded-lg bg-secondary transition-all duration-300 group-hover:rounded-none",
					imageClassName,
				)}
			>
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
							className="object-cover"
							priority={priority}
						/>
					))}
			</div>
			<div className="flex justify-between gap-3 py-2 text-sm md:py-3 md:text-base lg:text-lg">
				<span className="min-w-0 group-hover:italic">{product.name}</span>
				{priceDisplay && <span className="shrink-0 tabular-nums">{priceDisplay}</span>}
			</div>
		</Link>
	);
}
