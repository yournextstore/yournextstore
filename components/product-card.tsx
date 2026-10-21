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

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/**
 * The product card: a bordered 191:150 photograph, then name, a two-line summary and the price.
 * `list` is the original's compact row (copy left, 96px square thumbnail right).
 */
export async function ProductCard({
	product,
	priority = false,
	layout = "grid",
	showSummary = true,
	headingLevel = "h3",
}: {
	product: CardProduct;
	priority?: boolean;
	layout?: "grid" | "list";
	showSummary?: boolean;
	headingLevel?: "h2" | "h3";
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
	const soldOut = variants !== null && variants.length > 0 && variants.every((v) => v.stock === 0);
	const summary = showSummary && "summary" in product ? product.summary : null;

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
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className={cn(
				"group relative block min-w-0 text-foreground",
				layout === "grid" && "rounded-card",
				layout === "list" &&
					"grid min-h-30 grid-cols-[minmax(0,1fr)_96px] items-center gap-4 border-b border-border py-3",
			)}
		>
			<div
				className={cn(
					"relative overflow-hidden rounded-card border border-border bg-secondary",
					layout === "grid" ? "aspect-191/150 w-full" : "col-start-2 row-start-1 size-24",
					soldOut && "opacity-55",
				)}
			>
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
							alt=""
							fill
							sizes={layout === "grid" ? "(min-width: 1024px) 340px, 46vw" : "96px"}
							className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
			</div>
			<div
				className={cn(
					"flex min-w-0 flex-col items-start gap-1",
					layout === "grid" ? "pt-3" : "col-start-1 row-start-1",
				)}
			>
				<Heading className="text-body-md font-semibold leading-tight group-hover:underline group-hover:underline-offset-2">
					{product.name}
				</Heading>
				{summary ? (
					<p className="line-clamp-2 text-body-sm leading-[1.35] text-muted-foreground">{summary}</p>
				) : null}
				{priceDisplay ? <p className="text-body-sm font-semibold">{priceDisplay}</p> : null}
				{soldOut ? <p className="text-label-sm font-semibold">Unavailable</p> : null}
			</div>
		</Link>
	);
}
