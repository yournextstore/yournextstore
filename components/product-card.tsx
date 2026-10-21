import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { displayName } from "@/lib/theme";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/** Small square-cornered label over the photo: NEW is ink, SALE is red. */
function Badge({ tone, children }: { tone: "ink" | "sale"; children: React.ReactNode }) {
	return (
		<span
			className={cn(
				"rounded-sm px-2 py-1 text-[11px] leading-none font-medium tracking-wider uppercase",
				tone === "sale" ? "bg-sale text-white" : "bg-primary text-primary-foreground",
			)}
		>
			{children}
		</span>
	);
}

/**
 * The original's card: a rounded 3:4 photo with a soft shadow that lifts on hover, the second
 * photo cross-fading in, sale/sold-out badges top-left and a round quick-add top-right; below it a small
 * uppercase line (vendor there, the category here), the name in the serif, and the price.
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
	className,
}: {
	product: CardProduct;
	priority?: boolean;
	sizes?: string;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing ? `${listing.from ? "From " : ""}${fmt(listing.amount)}` : null;

	// Lowest list price above the shown minimum → struck through next to the red price.
	const saleVariant = variants?.find((v) => {
		const list = displayPrice(v, taxBehavior, "originalPrice");
		return list !== null && BigInt(list) > BigInt(displayPrice(v, taxBehavior));
	});
	const compareAt = saleVariant ? displayPrice(saleVariant, taxBehavior, "originalPrice") : null;
	const outOfStock = variants !== null && variants.length > 0 && variants.every((v) => v.stock === 0);
	const category =
		"category" in product &&
		product.category &&
		typeof product.category === "object" &&
		"name" in product.category
			? displayName(String(product.category.name))
			: null;

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
		<article className={cn("group relative", className)}>
			<div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary shadow-card transition-shadow duration-300 group-hover:shadow-card-hover">
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
				<div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent from-70% to-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				{(compareAt || outOfStock) && (
					<div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
						{compareAt && <Badge tone="sale">Sale</Badge>}
						{outOfStock && <Badge tone="ink">Sold out</Badge>}
					</div>
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
			<div className="mt-4 space-y-1">
				{category && <p className="text-xs tracking-wider text-muted-foreground uppercase">{category}</p>}
				<h2>
					<Link
						href={href}
						className="line-clamp-2 font-serif text-base/snug font-medium text-foreground after:absolute after:inset-0 group-hover:underline sm:text-lg/snug"
					>
						{product.name}
					</Link>
				</h2>
				{priceDisplay && (
					<p className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium tabular-nums">
						<span className={compareAt ? "text-sale" : "text-foreground"}>{priceDisplay}</span>
						{compareAt && (
							<span className="text-muted-foreground line-through">{fmt(BigInt(compareAt))}</span>
						)}
					</p>
				)}
			</div>
		</article>
	);
}
