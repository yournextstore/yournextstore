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

/**
 * Amerta product tile: one grey card holding a 3:4 photo, the bag button in the corner,
 * the name in small caps, the price (with a "Sale" chip) and a green stock line.
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw",
	className,
}: {
	product: CardProduct;
	priority?: boolean;
	sizes?: string;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing
		? `${listing.from ? "From " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
		: null;

	const onSale =
		variants?.some((v) => {
			const list = displayPrice(v, taxBehavior, "originalPrice");
			return list !== null && BigInt(list) > BigInt(displayPrice(v, taxBehavior));
		}) ?? false;
	const outOfStock = variants !== null && variants.length > 0 && variants.every((v) => v.stock === 0);

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	].filter((url) => !isVideoUrl(url));
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant =
		oneTimeAllowed && variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

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
	const href = `/product/${product.slug}${variantSearch}`;

	return (
		<article className={cn("group relative flex h-full flex-col bg-tile", className)}>
			<div className="relative aspect-[3/4] overflow-hidden">
				{primaryImage && (
					<YNSMedia
						src={primaryImage}
						alt=""
						fill
						sizes={sizes}
						priority={priority}
						fetchPriority={priority ? "high" : undefined}
						className={cn(
							"object-cover transition-opacity duration-300",
							secondaryImage && "group-hover:opacity-0",
						)}
					/>
				)}
				{secondaryImage && (
					<YNSMedia
						src={secondaryImage}
						alt=""
						fill
						sizes={sizes}
						className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					/>
				)}
			</div>
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
			<div className="flex flex-1 flex-col gap-2 px-4 pt-4 pb-4">
				<h2 className="text-sm/6 font-normal uppercase text-foreground">
					<Link href={href} className="after:absolute after:inset-0">
						{product.name}
					</Link>
				</h2>
				{priceDisplay && (
					<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-foreground">
						<span className="tabular-nums">{priceDisplay}</span>
						{onSale && (
							<span className="rounded bg-sale px-1.5 py-0.5 text-xs leading-none text-sale-foreground">
								Sale
							</span>
						)}
					</p>
				)}
				<p className={cn("text-xs uppercase", outOfStock ? "text-destructive" : "text-stock")}>
					{outOfStock ? "Out of stock" : "In stock"}
				</p>
			</div>
		</article>
	);
}
