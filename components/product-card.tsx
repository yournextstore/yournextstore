import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

type Swatch = { value: string; color: string };

function colorSwatches(product: CardProduct): Swatch[] {
	const variants = "variants" in product ? product.variants : [];
	const seen = new Map<string, Swatch>();
	for (const variant of variants) {
		const combinations = "combinations" in variant ? variant.combinations : [];
		for (const { variantValue } of combinations) {
			if (
				variantValue.variantType.type === "color" &&
				variantValue.colorValue &&
				!seen.has(variantValue.value)
			) {
				seen.set(variantValue.value, { value: variantValue.value, color: variantValue.colorValue });
			}
		}
	}
	return [...seen.values()];
}

/**
 * Pilot's product card: a rounded 4:5 photograph with the sale badge in its corner, then a small
 * uppercase eyebrow (the category, where the original shows the vendor), name and price on one row,
 * and colour swatches underneath.
 */
export async function ProductCard({
	product,
	priority = false,
	className,
	sizes = "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw",
}: {
	product: CardProduct;
	priority?: boolean;
	className?: string;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const minPrice = listing?.amount ?? null;
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const priceDisplay = listing ? `${listing.from ? "From " : ""}${fmt(listing.amount)}` : null;

	// Compare-at price and badge from the cheapest variant, when that variant is on sale.
	const cheapest = variants?.find(
		(v) => minPrice !== null && BigInt(displayPrice(v, taxBehavior)) === minPrice,
	);
	const listPrice = cheapest ? displayPrice(cheapest, taxBehavior, "originalPrice") : null;
	const compareAt = listPrice && minPrice !== null && BigInt(listPrice) > minPrice ? BigInt(listPrice) : null;
	const discount =
		compareAt && minPrice !== null
			? Math.round((Number(compareAt - minPrice) / Number(compareAt)) * 100)
			: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant =
		oneTimeAllowed && variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;
	const soldOut = variants !== null && variants.length > 0 && variants.every((v) => v.stock === 0);

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

	const category = "category" in product && product.category ? product.category.name : null;
	const swatches = colorSwatches(product);

	return (
		<div className={cn("group relative", className)}>
			<div className="relative aspect-4/5 overflow-hidden rounded-md bg-secondary">
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={cn(
								"absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
								secondaryImage && "group-hover:opacity-0",
							)}
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
							className={cn(
								"object-cover transition-[opacity,scale] duration-500 group-hover:scale-[1.03]",
								secondaryImage && "group-hover:opacity-0",
							)}
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
				{(discount || soldOut) && (
					<span
						className={cn(
							"absolute top-2.5 right-2.5 z-10 rounded-xs px-2 py-1 text-body-xs text-white",
							soldOut ? "bg-foreground" : "bg-sale",
						)}
					>
						{soldOut ? "Sold out" : `-${discount}% Off`}
					</span>
				)}
				{singleVariant && (
					<QuickAddButton
						variantId={singleVariant.id}
						variantSku={"sku" in singleVariant ? singleVariant.sku : null}
						variantPrice={singleVariant.price}
						variantPriceGross={"priceGross" in singleVariant ? singleVariant.priceGross : null}
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
			<div className="space-y-1.5 px-1 pt-3">
				{category && <p className="text-body-xs uppercase tracking-wide text-muted-foreground">{category}</p>}
				<div className="flex items-start justify-between gap-3">
					<h2 className="min-w-0">
						<Link
							href={`/product/${product.slug}${variantSearch}`}
							className="text-body-sm line-clamp-2 after:absolute after:inset-0 after:content-[''] hover:underline"
						>
							{product.name}
						</Link>
					</h2>
					{priceDisplay && (
						<p className="shrink-0 text-right text-body-sm">
							<span className={cn(compareAt && "text-sale")}>{priceDisplay}</span>
							{compareAt && (
								<span className="ml-1.5 text-muted-foreground line-through">{fmt(compareAt)}</span>
							)}
						</p>
					)}
				</div>
				{swatches.length > 0 && (
					<ul className="flex items-center gap-1.5 pt-1" aria-label="Colours">
						{swatches.slice(0, 4).map((swatch) => (
							<li
								key={swatch.value}
								title={swatch.value}
								className="size-4 rounded-full border border-border"
								style={{ backgroundColor: swatch.color }}
							>
								<span className="sr-only">{swatch.value}</span>
							</li>
						))}
						{swatches.length > 4 && (
							<li className="text-body-xs text-muted-foreground">+{swatches.length - 4}</li>
						)}
					</ul>
				)}
			</div>
		</div>
	);
}
