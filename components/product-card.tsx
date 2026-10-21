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

export async function ProductCard({
	product,
	priority = false,
	className,
	sizes = "(max-width: 1024px) 50vw, 400px",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	className?: string;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `${formatMoney({ amount: minPrice, currency, locale })} - ${formatMoney({ amount: maxPrice, currency, locale })}`
			: minPrice
				? formatMoney({ amount: minPrice, currency, locale })
				: null;

	// Sale: a single-variant (or uniformly priced) card shows the list price struck through.
	const firstVariant = variants?.[0];
	const listPrice =
		firstVariant && variants?.length === 1 ? displayPrice(firstVariant, taxBehavior, "originalPrice") : null;
	const onSale = Boolean(minPrice && listPrice && BigInt(listPrice) > minPrice);
	const compareAtDisplay =
		onSale && listPrice ? formatMoney({ amount: BigInt(listPrice), currency, locale }) : null;

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
		<Link href={`/product/${product.slug}${variantSearch}`} className={cn("group relative block", className)}>
			<div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
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
							className="object-cover transition-transform duration-300 group-hover:scale-105"
							priority={priority}
						/>
					))}
				{onSale && (
					<span className="absolute top-2 left-2 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white">
						Sale
					</span>
				)}
			</div>
			<div className="p-4">
				<span className="line-clamp-2 text-sm font-medium text-ink transition-colors group-hover:text-primary">
					{product.name}
				</span>
				<div className="mt-2 flex flex-wrap items-center gap-x-2">
					{priceDisplay && <span className="text-lg font-semibold text-ink">{priceDisplay}</span>}
					{compareAtDisplay && (
						<span className="text-sm text-muted-foreground line-through">{compareAtDisplay}</span>
					)}
				</div>
			</div>
		</Link>
	);
}
