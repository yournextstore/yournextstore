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
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/**
 * Showcase card: the photograph is the card. Kicker centred on top, name bottom-left, price
 * bottom-right under a dark scrim; quick add appears on hover (always visible on touch).
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
	const { currency, locale, taxBehavior } = await getStoreConfig();
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
			className={cn("@container group relative block overflow-hidden rounded-xl bg-card", className)}
		>
			<div className="relative aspect-4/5">
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes={sizes}
						priority={priority}
						className="object-cover transition duration-500 group-hover:scale-[1.04]"
					/>
				)}
			</div>
			{/* readability scrim */}
			<div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-black/35" />

			{kicker && (
				<p className="absolute inset-x-14 top-4 truncate text-center @max-[230px]:hidden text-[12px] font-semibold uppercase tracking-[0.18em] text-white/85">
					{kicker}
				</p>
			)}

			{onSale && (
				<span className="absolute left-3 top-3 rounded-md bg-brass px-2.5 py-1 text-[12px] font-bold text-on-brass">
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
			<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white @max-[230px]:flex-col @max-[230px]:items-start @max-[230px]:gap-0.5 @max-[230px]:p-3">
				<h3 className="min-w-0 max-w-full truncate text-[16px] font-bold leading-snug @max-[230px]:text-[15px]">
					{product.name}
				</h3>
				<p className="flex shrink-0 items-baseline gap-1.5 text-[15px]">
					{onSale && listPrice && <s className="text-[12px] text-white/70">{fmt(BigInt(listPrice))}</s>}
					{priceDisplay && <span className="font-bold">{priceDisplay}</span>}
					<span
						aria-hidden
						className="text-[13px] text-white/80 transition group-hover:text-brass @max-[230px]:hidden"
					>
						View ›
					</span>
				</p>
			</div>
		</Link>
	);
}
