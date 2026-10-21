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

const LOW_STOCK = 3;

export async function ProductCard({
	product,
	priority = false,
	showNote = false,
	headingLevel = "h3",
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	/** Show the one-line summary (catalogue pages). */
	showNote?: boolean;
	headingLevel?: "h2" | "h3";
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
	const soldOut = !!variants && variants.length > 0 && variants.every((v) => v.stock === 0);
	const stockLeft =
		variants && variants.length === 1 && typeof variants[0]?.stock === "number" ? variants[0].stock : null;
	const category = "category" in product && product.category ? product.category : null;
	const summary = "summary" in product ? product.summary : null;

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
	const Heading = headingLevel;

	return (
		<article className={cn("product group", className)}>
			<div className="product__img">
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 h-full w-full object-cover ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							sizes="(max-width: 720px) 50vw, (max-width: 1080px) 45vw, 30vw"
							className={`object-cover ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
				{secondaryImage && !isVideoUrl(secondaryImage) && (
					<YNSMedia
						src={secondaryImage}
						alt=""
						fill
						sizes="(max-width: 720px) 50vw, (max-width: 1080px) 45vw, 30vw"
						className="object-cover opacity-0 group-hover:opacity-100"
					/>
				)}
				{soldOut ? <span className="product__sold">Sold out</span> : null}
			</div>
			<div className="product__meta">
				{category ? <p className="product__env">{category.name}</p> : null}
				<Heading className="product__name">
					<Link href={`/product/${product.slug}${variantSearch}`} className="product__link-text">
						{product.name}
					</Link>
				</Heading>
				{showNote && summary ? <p className="product__note">{summary}</p> : null}
				<div className="product__bot">
					<span className="product__price">{priceDisplay}</span>
					<span className="product__actions">
						{!soldOut && stockLeft !== null && stockLeft <= LOW_STOCK ? (
							<span className="product__stock">{stockLeft === 1 ? "Last one" : `${stockLeft} left`}</span>
						) : null}
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
					</span>
				</div>
			</div>
		</article>
	);
}
