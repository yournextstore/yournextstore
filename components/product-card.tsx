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
import { ProductBadge } from "./product-badge";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/** Fluid's product card: a rounded square photo with a corner badge, then name and price on an inset. */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	// "Sale" when the cheapest variant carries a higher list price; struck through like Fluid's card.
	const cheapest = listing
		? variants?.find((v) => BigInt(displayPrice(v, taxBehavior)) === listing.amount)
		: undefined;
	const listPrice = cheapest ? displayPrice(cheapest, taxBehavior, "originalPrice") : null;
	const compareAt = listPrice && listing && BigInt(listPrice) > listing.amount ? BigInt(listPrice) : null;
	const soldOut = Boolean(variants && variants.length > 0 && variants.every((v) => v.stock === 0));

	const priceDisplay = listing ? `${listing.from ? "From " : ""}${fmt(listing.amount)}` : null;

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

	return (
		<Link href={`/product/${product.slug}${variantSearch}`} className="group relative block">
			<div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={cn(
								"absolute inset-0 size-full object-cover transition-opacity duration-500",
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
								"object-cover transition-[opacity,scale] duration-500 group-hover:scale-[1.02]",
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
				{(soldOut || compareAt) && (
					<ProductBadge kind={soldOut ? "sold-out" : "sale"} className="absolute bottom-2 left-2" />
				)}
			</div>
			<div className="px-3 pb-2 pt-3 sm:px-6 sm:pt-4">
				<h2 className="font-sans text-body font-normal tracking-normal">{product.name}</h2>
				{priceDisplay && (
					<p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-caption">
						{compareAt && (
							<span className="text-[0.875rem] text-muted-foreground line-through">
								<span className="sr-only">Regular price </span>
								{fmt(compareAt)}
							</span>
						)}
						<span>
							{compareAt && <span className="sr-only">Sale price </span>}
							{priceDisplay}
						</span>
					</p>
				)}
			</div>
		</Link>
	);
}
