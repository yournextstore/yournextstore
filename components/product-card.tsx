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
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/** Blueprint's product tile: 3:4 photo on a pale panel, pill badges, bold name, grey subline, price. */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 768px) 50vw, 25vw",
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

	const singleVariant = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

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
	const subline = variants && variants.length > 1 ? `${variants.length} options` : category ? category : null;

	return (
		<Link href={`/product/${product.slug}${variantSearch}`} className={cn("group relative block", className)}>
			<div className="relative mb-3 aspect-[3/4] overflow-hidden bg-neutral-lightest">
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
							alt={product.name}
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
					<div className="absolute left-2.5 top-2.5 flex gap-1.5">
						{soldOut && (
							<span className="rounded bg-black px-2 py-0.5 text-[0.625rem] font-medium uppercase leading-4 text-white">
								Sold out
							</span>
						)}
						{onSale && !soldOut && (
							<span className="rounded bg-brand px-2 py-0.5 text-[0.625rem] font-medium uppercase leading-4 text-white">
								Sale
							</span>
						)}
					</div>
				)}
			</div>
			<p className="text-sm font-bold leading-snug md:text-[0.9375rem]">{product.name}</p>
			{subline && <p className="mt-0.5 text-xs capitalize text-muted-foreground md:text-sm">{subline}</p>}
			{priceDisplay && (
				<p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
					<span className={onSale ? "text-brand" : undefined}>{priceDisplay}</span>
					{onSale && listPrice !== null && (
						<span className="text-muted-foreground line-through">
							{formatMoney({ amount: listPrice, currency, locale })}
						</span>
					)}
				</p>
			)}
		</Link>
	);
}
