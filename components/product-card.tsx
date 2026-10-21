import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { shortName } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, getProductThumbnail, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/** Pasargad's grid: one column, then 2/3/4 at sm/md/xl with a tight 12px gap. */
export const CARD_GRID = "grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";

export async function ProductCard({
	product,
	priority = false,
	className,
}: {
	product: CardProduct;
	priority?: boolean;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : [];
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	// The lowest variant price, marked "From" when the variants are priced differently.
	const listing = listingPrice(variants, taxBehavior);
	const price =
		listing === null || listing.amount === 0n ? null : `${listing.from ? "From " : ""}${fmt(listing.amount)}`;

	// A single-price product on sale gets the original's red "was / -x%" badge.
	const first = variants.length === 1 ? variants[0] : null;
	const sale = (() => {
		if (!first || !("originalPrice" in first) || !first.originalPrice) return null;
		const now = BigInt(displayPrice(first, taxBehavior));
		const was = BigInt(displayPrice(first, taxBehavior, "originalPrice") ?? now);
		if (was <= now) return null;
		return { was: fmt(was), percent: Math.round((Number(was - now) / Number(was)) * 100) };
	})();

	const soldOut = variants.length > 0 && variants.every((variant) => variant.stock === 0);
	const image =
		getProductThumbnail(product.images ?? []) ??
		getProductThumbnail(variants.flatMap((variant) => variant.images ?? []));
	const category = "category" in product && product.category ? shortName(product.category.name) : null;
	const summary = "summary" in product ? product.summary : null;

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const variantSearch = (() => {
		if (!first || !("combinations" in first) || first.combinations.length === 0) return "";
		const params = new URLSearchParams();
		for (const combination of first.combinations) {
			params.set(combination.variantValue.variantType.label, combination.variantValue.value);
		}
		return `?${params.toString()}`;
	})();

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className={cn(
				"group flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md",
				className,
			)}
		>
			<div className="relative h-60 w-full shrink-0 overflow-hidden bg-muted">
				{image && !isVideoUrl(image) && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 50vw, 100vw"
						className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
						priority={priority}
						fetchPriority={priority ? "high" : undefined}
					/>
				)}
			</div>
			<div className="grid flex-1 content-start gap-1 p-4">
				{category && (
					<Badge variant="outline" className="text-muted-foreground">
						{category}
					</Badge>
				)}
				<h2 className={cn("text-base", category && "mt-2")}>{product.name}</h2>
				{summary && <p className="line-clamp-3 text-xs text-justify text-muted-foreground">{summary}</p>}
			</div>
			<div className="flex items-center p-6 pt-0">
				{soldOut ? (
					<Badge variant="secondary">Out of stock</Badge>
				) : sale ? (
					<div className="flex items-center gap-2">
						<Badge className="flex gap-3 border-transparent bg-sale text-white">
							<span className="line-through">{sale.was}</span>
							<span>-{sale.percent}%</span>
						</Badge>
						<span className="text-base">{price}</span>
					</div>
				) : (
					<span className="text-base">{price}</span>
				)}
			</div>
		</Link>
	);
}
