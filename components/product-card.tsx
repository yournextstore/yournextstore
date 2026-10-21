import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { getCategoryNames } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/**
 * Showcase card: a 3:4 photograph behind a hairline border that lights up on hover. Category
 * centred on top with wide tracking, name bottom-left and price bottom-right under a dark scrim;
 * the square quick-add button fades in on hover (always visible on touch).
 */
export async function ProductCard({
	product,
	kicker,
	priority = false,
	sizes = "(max-width: 640px) 70vw, (max-width: 768px) 50vw, 300px",
	className,
}: {
	product: CardProduct;
	kicker?: string;
	priority?: boolean;
	sizes?: string;
	className?: string;
}) {
	const [{ currency, locale, taxBehavior }, categoryNames] = await Promise.all([
		getStoreConfig(),
		getCategoryNames(),
	]);
	const categoryId = "categoryId" in product ? product.categoryId : null;
	const label = kicker ?? (categoryId ? categoryNames[categoryId] : undefined);
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	const isRange = variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice;
	const priceDisplay = minPrice ? (isRange ? `from ${fmt(minPrice)}` : fmt(minPrice)) : null;

	const firstVariant = variants?.[0];
	const listPrice = firstVariant ? displayPrice(firstVariant, taxBehavior, "originalPrice") : null;
	const onSale = !isRange && minPrice !== null && listPrice !== null && BigInt(listPrice) > minPrice;

	const image = [...(product.images ?? []), ...(variants?.flatMap((v) => v.images ?? []) ?? [])].find(
		(url) => !isVideoUrl(url),
	);

	const singleVariant = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

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
				"@container group relative block overflow-hidden border border-white/10 bg-tile transition-colors duration-200 hover:border-white",
				className,
			)}
		>
			<div className="relative aspect-3/4">
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes={sizes}
						priority={priority}
						className="object-cover opacity-90 brightness-[.86] transition duration-500 group-hover:opacity-100 group-hover:brightness-100"
					/>
				)}
			</div>
			{/* readability scrim */}
			<div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/45" />

			{label && (
				<p className="absolute inset-x-14 top-4 truncate text-center text-[11px] uppercase tracking-[0.3em] text-white/80 @max-[230px]:hidden">
					{label}
				</p>
			)}

			{onSale && (
				<span className="absolute left-3 top-3 border border-white/40 bg-black/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
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

			{/* bottom row: name left, price + go right */}
			<div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 p-4 text-white @max-[230px]:flex-col @max-[230px]:items-start @max-[230px]:gap-0.5 @max-[230px]:p-3">
				<h3 className="min-w-0 max-w-full truncate text-[15px] font-semibold uppercase tracking-[0.1em] @max-[230px]:text-[13px]">
					{product.name}
				</h3>
				<p className="flex shrink-0 items-baseline gap-1.5 text-[14px]">
					{onSale && listPrice && <s className="text-[12px] text-white/60">{fmt(BigInt(listPrice))}</s>}
					{priceDisplay && <span className="font-semibold tracking-wide">{priceDisplay}</span>}
					<span
						aria-hidden
						className="text-[12px] uppercase tracking-[0.14em] text-white/70 transition group-hover:text-white @max-[300px]:hidden"
					>
						View ›
					</span>
				</p>
			</div>
		</Link>
	);
}
