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

export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 768px) 50vw, 270px",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `from ${fmt(minPrice)}`
			: minPrice
				? fmt(minPrice)
				: null;

	// A single variant on sale shows its list price struck through, as the original's cards do.
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice =
		onlyVariant && "originalPrice" in onlyVariant
			? displayPrice(onlyVariant, taxBehavior, "originalPrice")
			: null;
	const compareAt = listPrice && minPrice && BigInt(listPrice) > minPrice ? fmt(BigInt(listPrice)) : null;

	const primaryImage =
		(product.images ?? []).find((image) => !isVideoUrl(image)) ?? variants?.[0]?.images?.[0];

	const singleVariant = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
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
			className="group relative block min-w-0 transition hover:bg-tile/60"
		>
			<div className="relative aspect-[3/4] overflow-hidden bg-tile">
				{primaryImage && (
					<YNSMedia
						src={primaryImage}
						alt=""
						fill
						sizes={sizes}
						className="object-cover transition duration-300 group-hover:scale-[1.03]"
						priority={priority}
					/>
				)}
				{compareAt && (
					<span className="absolute left-3 top-3 bg-ink px-2.5 py-1 text-[12px] font-semibold text-paper">
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
			<div className="flex flex-col items-center justify-center gap-2 px-3 py-3 text-center sm:px-4">
				<p className="line-clamp-2 font-display text-piece underline-offset-4 group-hover:underline">
					{product.name}
				</p>
				<p className="text-body tracking-wide text-muted-foreground">
					{compareAt && <s className="mr-1.5 text-small">{compareAt}</s>}
					<span className={cn(compareAt && "font-semibold text-brand-ink")}>{priceDisplay}</span>
				</p>
			</div>
		</Link>
	);
}
