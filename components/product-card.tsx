import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { sentenceCase } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/** The original's listing card: tall photo, a pale sky info bar with name and category left, price right. */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 640px) 90vw, (max-width: 992px) 45vw, 25vw",
	className,
}: {
	product: CardProduct;
	priority?: boolean;
	sizes?: string;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `From ${formatMoney({ amount: minPrice, currency, locale })}`
			: minPrice
				? formatMoney({ amount: minPrice, currency, locale })
				: null;

	// A sale shows when the cheapest variant carries a higher list price.
	const cheapest = variants?.find((variant) => BigInt(displayPrice(variant, taxBehavior)) === minPrice);
	const listPrice =
		cheapest && "originalPrice" in cheapest && cheapest.originalPrice
			? BigInt(displayPrice(cheapest, taxBehavior, "originalPrice") ?? cheapest.originalPrice)
			: null;
	const onSale = listPrice !== null && minPrice !== null && listPrice > minPrice;
	const soldOut =
		variants !== null && variants.length > 0 && variants.every((variant) => variant.stock === 0);

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

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

	const category = "category" in product && product.category ? sentenceCase(product.category.name) : null;
	const subline = variants && variants.length > 1 ? `${variants.length} options` : category;

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className={cn(
				"group relative flex flex-col overflow-hidden rounded-lg bg-white opacity-95 shadow-lg transition duration-200 hover:opacity-100 md:hover:scale-[1.04]",
				className,
			)}
		>
			<div className="relative aspect-[2/3] overflow-hidden rounded-t-lg bg-gray-100">
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${secondaryImage ? "md:group-hover:opacity-0" : ""}`}
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
							className={`object-cover transition-opacity duration-300 ${secondaryImage ? "md:group-hover:opacity-0" : ""}`}
							priority={priority}
						/>
					))}
				{secondaryImage && !isVideoUrl(secondaryImage) && (
					<YNSMedia
						src={secondaryImage}
						alt=""
						fill
						sizes={sizes}
						className="hidden object-cover opacity-0 transition-opacity duration-300 md:block md:group-hover:opacity-100"
					/>
				)}
				{(onSale || soldOut) && (
					<span
						className={cn(
							"absolute left-0 top-3 rounded-r-lg px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white",
							soldOut ? "bg-gray-800" : "bg-sale",
						)}
					>
						{soldOut ? "Sold out" : "Sale"}
					</span>
				)}
			</div>
			<div className="flex min-h-24 flex-1 items-center justify-between gap-3 bg-sky-wash p-4">
				<div className="flex min-w-0 flex-col justify-center">
					<span className="line-clamp-2 text-sm font-bold text-gray-800 transition-colors group-hover:text-gray-600 lg:text-base">
						{product.name}
					</span>
					{subline && <span className="mt-0.5 truncate text-sm text-muted-foreground">{subline}</span>}
				</div>
				{priceDisplay && (
					<div className="flex shrink-0 flex-col items-end gap-1">
						<span className="whitespace-nowrap text-lg font-bold text-gray-800 md:text-xl">
							{priceDisplay}
						</span>
						{onSale && listPrice !== null && (
							<span className="whitespace-nowrap text-sm text-sale line-through">
								{formatMoney({ amount: listPrice, currency, locale })}
							</span>
						)}
					</div>
				)}
			</div>
		</Link>
	);
}
