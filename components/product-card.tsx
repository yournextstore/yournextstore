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

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/** Nimara's search card: a 3:4 photograph, one line of name, the price below. */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 720px) 100vw, (max-width: 1140px) 50vw, (max-width: 1440px) 33vw, 25vw",
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	sizes?: string;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const listing = variants ? listingPrice(variants, taxBehavior) : null;

	const only = variants?.length === 1 ? variants[0] : null;
	const listPrice = only ? displayPrice(only, taxBehavior, "originalPrice") : null;
	const onSale = only && listing && listPrice ? BigInt(listPrice) > listing.amount : false;
	const discount =
		onSale && listPrice && listing
			? Math.round((Number(BigInt(listPrice) - listing.amount) / Number(BigInt(listPrice))) * 100)
			: 0;

	const priceLabel = listing ? `${listing.from ? "From " : ""}${fmt(listing.amount)}` : null;

	const image = [...(product.images ?? []), ...(variants?.flatMap((v) => v.images ?? []) ?? [])].find(
		(url) => !isVideoUrl(url),
	);

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const variantSearch = (() => {
		if (!only || !("combinations" in only) || only.combinations.length === 0) {
			return "";
		}
		const params = new URLSearchParams();
		for (const combination of only.combinations) {
			params.set(combination.variantValue.variantType.label, combination.variantValue.value);
		}
		return `?${params.toString()}`;
	})();

	return (
		<article className={cn("min-w-0", className)}>
			<Link href={`/product/${product.slug}${variantSearch}`} className="group grid gap-2">
				<div className="relative aspect-[3/4] overflow-hidden bg-tile">
					{image && (
						<YNSMedia
							src={image}
							alt=""
							fill
							sizes={sizes}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
							className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
						/>
					)}
					{discount > 0 && (
						<span className="absolute top-3 left-3 rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-white">
							-{discount}%
						</span>
					)}
				</div>
				<div className="text-base">
					<h2 className="line-clamp-1 text-ellipsis">{product.name}</h2>
					{priceLabel && (
						<p className="flex flex-wrap gap-1">
							{onSale && listPrice && (
								<span className="text-muted-foreground line-through">{fmt(BigInt(listPrice))}</span>
							)}
							<span>{priceLabel}</span>
						</p>
					)}
				</div>
			</Link>
		</article>
	);
}
