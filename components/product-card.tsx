import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/** The collection (or, failing that, category) a card names under the product title. */
function productEyebrow(product: BrowseProduct | CollectionProduct | FullProduct) {
	const collection =
		"productCollections" in product && Array.isArray(product.productCollections)
			? product.productCollections[0]?.collection?.name
			: undefined;
	const category = "category" in product ? product.category?.name : undefined;
	return collection ?? category ?? null;
}

/**
 * Product tile: square photograph, then name and price on one line (stacked on phones), the
 * collection in small grey type under the name, and a burnt-orange sale price with the list
 * price struck through when the product is discounted.
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 768px) 50vw, 33vw",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const minPrice = listing?.amount ?? null;
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	// A single-variant product can show its list price struck through; a range shows "From".
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior, "originalPrice") : null;
	const onSale = Boolean(minPrice !== null && listPrice && BigInt(listPrice) > minPrice);
	const hasRange = listing?.from ?? false;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];
	const eyebrow = productEyebrow(product);

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
		<Link href={`/product/${product.slug}${variantSearch}`} className="group block">
			<div className="relative mb-4 aspect-square w-full overflow-hidden bg-grayscale-50 md:mb-6">
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
							alt={product.name}
							fill
							sizes={sizes}
							className={`object-cover transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
				{secondaryImage && !isVideoUrl(secondaryImage) && (
					<YNSMedia
						src={secondaryImage}
						alt=""
						fill
						sizes={sizes}
						className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					/>
				)}
			</div>
			<div className="flex justify-between gap-x-4 max-md:flex-col">
				<div className="min-w-0 max-md:text-body-xs">
					<h2 className="mb-1">{product.name}</h2>
					{eyebrow && <p className="text-body-xs text-grayscale-500 max-md:hidden">{eyebrow}</p>}
				</div>
				{minPrice !== null &&
					(onSale && listPrice ? (
						<div className="shrink-0 md:text-right">
							<p className="font-semibold text-sale max-md:text-body-xs">{fmt(minPrice)}</p>
							<p className="text-grayscale-500 line-through max-md:text-body-xs">{fmt(BigInt(listPrice))}</p>
						</div>
					) : (
						<p className="shrink-0 font-semibold max-md:text-body-xs">
							{hasRange ? `From ${fmt(minPrice)}` : fmt(minPrice)}
						</p>
					))}
			</div>
		</Link>
	);
}
