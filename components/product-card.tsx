import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/**
 * The original's .product-card: square photo, centred 30px name, price with an ink "% OFF" tag.
 * `framed` adds the ruled cell (p-8 + 1px rule) used in listings and the home marquee.
 */
export async function ProductCard({
	product,
	priority = false,
	framed = false,
	headingLevel = "h2",
	compact = false,
	sizes = "(max-width: 768px) 100vw, 33vw",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	framed?: boolean;
	headingLevel?: "h2" | "h3";
	/** Smaller name for dense rows ("Find more like this"). */
	compact?: boolean;
	sizes?: string;
}) {
	const Heading = headingLevel;
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing
		? `${listing.from ? "From " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
		: null;

	const firstVariant = variants?.[0];
	const listPrice =
		variants?.length === 1 && firstVariant && "originalPrice" in firstVariant && firstVariant.originalPrice
			? BigInt(firstVariant.originalPrice)
			: null;
	const salePrice = variants?.length === 1 && firstVariant ? BigInt(firstVariant.price) : null;
	const discountPercent =
		listPrice && salePrice && listPrice > salePrice
			? Math.round((Number(listPrice - salePrice) / Number(listPrice)) * 100)
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
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className={cn("group relative flex flex-col", framed && "m-[-0.5px] border border-border p-8")}
		>
			<div className="relative aspect-square overflow-hidden bg-muted">
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							className={`object-cover transition-opacity duration-300 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							src={secondaryImage}
							muted
							loop
							playsInline
						/>
					) : (
						<YNSMedia
							src={secondaryImage}
							alt=""
							fill
							sizes={sizes}
							className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						/>
					))}
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
			<div className="mt-4 text-center">
				<Heading className={compact ? "text-body md:text-h5" : "text-h4 md:text-h3"}>{product.name}</Heading>
				{priceDisplay && (
					<p className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold md:text-body">
						{priceDisplay}
						{discountPercent ? (
							<span className="rounded-md bg-foreground px-1.5 py-1 text-tag font-semibold tracking-widest text-background uppercase">
								{discountPercent}% Off
							</span>
						) : null}
					</p>
				)}
			</div>
		</Link>
	);
}
