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

/**
 * The original's frosted card: rounded, half-white over the cream page, a 3:4 photo that slowly
 * zooms on hover with a violet wash and a "Quick Add" bar sliding up, then a small-caps
 * category, the serif name in royal violet and the price.
 */
export async function ProductCard({
	product,
	priority = false,
	featured = false,
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	/** The big tile of the home page's asymmetric "Featured" grid: the photo grows to fill the tile. */
	featured?: boolean;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing
		? `${listing.from ? "From " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
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

	// A struck-through list price when the only variant is on sale, as the original's "Sale" card.
	const saleVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice = saleVariant ? displayPrice(saleVariant, taxBehavior, "originalPrice") : null;
	const comparePrice =
		saleVariant && listPrice && BigInt(listPrice) > BigInt(displayPrice(saleVariant, taxBehavior))
			? formatMoney({ amount: BigInt(listPrice), currency, locale })
			: null;
	const categoryName = "category" in product && product.category ? product.category.name : null;
	const sizes = featured
		? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
		: "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw";

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
			className={cn(
				"group relative flex flex-col overflow-hidden rounded-2xl border border-earth/5 bg-card/60 backdrop-blur-md transition-all duration-500 hover:border-earth/15 hover:shadow-warm",
				className,
			)}
		>
			<div
				className={cn(
					"relative aspect-3/4 overflow-hidden bg-sand/50",
					featured && "sm:aspect-4/3 lg:aspect-auto lg:min-h-[28rem] lg:flex-1",
				)}
			>
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							className={`object-cover transition-transform duration-1000 ease-out group-hover:scale-110 ${secondaryImage ? "transition-opacity group-hover:opacity-0" : ""}`}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							src={secondaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<YNSMedia
							src={secondaryImage}
							alt=""
							fill
							sizes={sizes}
							className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					))}
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-linear-to-t from-royal/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				/>
				{comparePrice && (
					<span className="absolute top-3 left-3 bg-crimson px-2 py-1 font-body text-2xs uppercase tracking-widest text-cream">
						Sale
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
			<div className={cn("flex flex-col p-4", !featured && "flex-1")}>
				{categoryName && (
					<p className="mb-1 font-body text-2xs uppercase tracking-widest text-earth-soft">{categoryName}</p>
				)}
				<h2
					className={cn(
						"mb-2 font-display text-lg leading-tight text-royal transition-colors group-hover:text-crimson",
						featured && "lg:text-2xl",
					)}
				>
					{product.name}
				</h2>
				<div className="mt-auto flex flex-wrap items-baseline gap-x-3">
					<span className="font-body text-base font-semibold text-earth">{priceDisplay}</span>
					{comparePrice && (
						<span className="font-body text-sm text-earth-soft line-through">{comparePrice}</span>
					)}
				</div>
			</div>
		</Link>
	);
}
