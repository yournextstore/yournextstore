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

const DEFAULT_SIZES = "(max-width: 1024px) 50vw, 25vw";

/**
 * The original's card: a tall photograph on the paper tint that crossfades to the worn shot on
 * hover, a slide-up bar to add straight to the bag, tracked-caps name and swatches underneath.
 */
export async function ProductCard({
	product,
	priority = false,
	badge,
	sizes = DEFAULT_SIZES,
}: {
	product: CardProduct;
	priority?: boolean;
	/** Editorial flag over the photo ("New in"); a sale always wins. */
	badge?: string;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const fmt = (amount: bigint | string) => formatMoney({ amount: BigInt(amount), currency, locale });
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	// Sale: the cheapest variant sells below its list price.
	const cheapest = variants?.find(
		(v) => minPrice !== null && BigInt(displayPrice(v, taxBehavior)) === minPrice,
	);
	const listPrice = cheapest ? displayPrice(cheapest, taxBehavior, "originalPrice") : null;
	const onSale = Boolean(minPrice && listPrice && BigInt(listPrice) > minPrice);

	const priceDisplay =
		minPrice === null
			? null
			: maxPrice !== null && maxPrice !== minPrice
				? `From ${fmt(minPrice)}`
				: fmt(minPrice);

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages.find((img, i) => i > 0 && !isVideoUrl(img));

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
	const href = `/product/${product.slug}${variantSearch}`;

	const swatches = [
		...new Map(
			(variants ?? [])
				.flatMap((v) => ("combinations" in v ? v.combinations : []))
				.map((c) => c.variantValue)
				.filter((value) => value.variantType.type === "color" && value.colorValue)
				.map((value) => [value.id, value] as const),
		).values(),
	].slice(0, 6);

	const flag = onSale ? "Sale" : badge;

	return (
		<article className="group relative">
			<div className="relative aspect-[2/3] w-full overflow-hidden bg-tint">
				<div className="absolute inset-0">
					{primaryImage && (
						<YNSMedia
							src={primaryImage}
							alt=""
							fill
							sizes={sizes}
							priority={priority}
							className={cn(
								"object-cover transition-[opacity,transform] duration-700 group-hover:scale-[1.04]",
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
							className="object-cover opacity-0 transition-[opacity,transform] duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
						/>
					)}
				</div>
				{secondaryImage && (
					<span
						aria-hidden
						className="note pointer-events-none absolute bottom-2.5 left-3 text-white/85 mix-blend-difference"
					>
						<span className="group-hover:hidden">studio</span>
						<span className="hidden group-hover:inline">full look</span>
					</span>
				)}
				{flag && (
					<span
						className={cn(
							"cap-xs pointer-events-none absolute left-3 top-3 px-2.5 py-1.5 text-white",
							onSale ? "bg-acc" : "bg-ink",
						)}
					>
						{flag}
					</span>
				)}
				<div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-between gap-3 border-t border-line bg-background/95 px-3.5 py-2 opacity-0 transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
					<Link href={href} className="cap py-1">
						View
					</Link>
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
						<Link href={href} className="cap py-1">
							Choose options
						</Link>
					)}
				</div>
			</div>
			<div className="flex flex-col gap-2 px-0.5 pt-3.5">
				<Link
					href={href}
					className="cap-tag line-clamp-2 leading-relaxed after:absolute after:inset-0 after:content-['']"
				>
					{product.name}
				</Link>
				{priceDisplay && (
					<p className="flex items-baseline gap-2.5 text-[12px] tracking-[0.04em]">
						<span className={onSale ? "text-acc" : undefined}>{priceDisplay}</span>
						{onSale && listPrice && <span className="text-faint line-through">{fmt(listPrice)}</span>}
					</p>
				)}
				{swatches.length > 1 && (
					<ul aria-label="Colours" className="flex min-h-[14px] items-center gap-1.5">
						{swatches.map((swatch) => (
							<li
								key={swatch.id}
								title={swatch.value}
								className="size-3 border border-line"
								style={{ background: swatch.colorValue ?? undefined }}
							>
								<span className="sr-only">{swatch.value}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</article>
	);
}
