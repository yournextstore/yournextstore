import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { displayName } from "@/lib/theme";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/**
 * The original's card: a rounded photo with a "20% OFF" pill top-right and the second image on
 * hover; below it the vendor line (here the category), the name in semibold, "From $79" and a
 * full-width outline button ("Add to cart" for one variant, "Select options" otherwise).
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw",
	className,
}: {
	product: CardProduct;
	priority?: boolean;
	sizes?: string;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const isRange = minPrice !== null && maxPrice !== null && minPrice !== maxPrice;

	const saleVariant = variants?.find((v) => {
		const list = displayPrice(v, taxBehavior, "originalPrice");
		return list !== null && BigInt(list) > BigInt(displayPrice(v, taxBehavior));
	});
	const compareAt = saleVariant ? displayPrice(saleVariant, taxBehavior, "originalPrice") : null;
	const outOfStock = variants !== null && variants.length > 0 && variants.every((v) => v.stock === 0);

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	].filter((url) => !isVideoUrl(url));
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	const singleVariant = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

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

	const discount =
		compareAt && minPrice !== null && BigInt(compareAt) > 0n
			? Math.round((Number(BigInt(compareAt) - minPrice) / Number(BigInt(compareAt))) * 100)
			: null;
	const vendor = "category" in product && product.category ? displayName(product.category.name) : null;

	return (
		<article className={cn("group relative flex h-full flex-col", className)}>
			<div className="relative aspect-square overflow-hidden rounded-lg bg-stage">
				{primaryImage && (
					<YNSMedia
						src={primaryImage}
						alt=""
						fill
						sizes={sizes}
						priority={priority}
						className={cn(
							"object-cover transition-[opacity,transform] duration-500",
							secondaryImage ? "group-hover:opacity-50" : "group-hover:scale-[1.03]",
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
				{(discount || outOfStock) && (
					<span
						className={cn(
							"absolute top-2.5 right-2.5 rounded-full px-2 py-1 text-[11px] leading-none uppercase",
							outOfStock ? "bg-secondary text-foreground" : "bg-sale text-white",
						)}
					>
						{outOfStock ? "Sold out" : `${discount}% off`}
					</span>
				)}
			</div>
			<div className="flex grow flex-col gap-3 py-4 text-sm">
				{vendor && <p className="text-[13px] text-muted-foreground">{vendor}</p>}
				<div className="flex flex-col gap-1">
					<Link
						href={href}
						className="line-clamp-2 font-semibold leading-normal after:absolute after:inset-0"
					>
						<span className="reveal-underline group-hover:bg-size-[100%_1px]">{product.name}</span>
					</Link>
					{minPrice !== null && (
						<p className="flex flex-wrap items-baseline gap-x-1.5 tabular-nums">
							{isRange && <span>From</span>}
							<span>{fmt(minPrice)}</span>
							{compareAt && !isRange && (
								<span className="text-muted-foreground line-through">
									<span className="sr-only">Was </span>
									{fmt(BigInt(compareAt))}
								</span>
							)}
						</p>
					)}
				</div>
			</div>
			<div className="mt-auto">
				{singleVariant ? (
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
				) : (
					<span aria-hidden="true" className="btn btn-outline btn-sm w-full">
						{outOfStock ? "Sold out" : "Select options"}
					</span>
				)}
			</div>
		</article>
	);
}
