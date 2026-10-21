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

/** The original's pill badges: "30% OFF" in deep brown, "SOLD OUT" in light grey. */
function Badge({ tone, children }: { tone: "sale" | "muted"; children: React.ReactNode }) {
	return (
		<span
			className={cn(
				"rounded-md px-2 py-1 text-[11px] leading-none font-semibold tracking-[0.02em] uppercase",
				tone === "sale" ? "bg-sale text-white" : "bg-[#dfdfdf] text-foreground",
			)}
		>
			{children}
		</span>
	);
}

type Swatch = { value: string; color: string | null };

/**
 * The original's card: a rounded square grey stage with the packshot, badges top-left and a
 * hover quick-add bar; below it a row of small colour swatches, the name in small uppercase
 * and the price with the list price struck through.
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(min-width: 768px) 33vw, 50vw",
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

	const priceDisplay =
		minPrice !== null && maxPrice !== null && minPrice !== maxPrice
			? `${fmt(minPrice)} – ${fmt(maxPrice)}`
			: minPrice !== null
				? fmt(minPrice)
				: null;

	// Lowest list price above the shown minimum → struck through next to the red price.
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

	const discount =
		compareAt && minPrice !== null && BigInt(compareAt) > 0n
			? Math.round((Number(BigInt(compareAt) - minPrice) / Number(BigInt(compareAt))) * 100)
			: null;

	const swatches: Swatch[] = [
		...new Map(
			(variants ?? []).flatMap((v) =>
				"combinations" in v
					? v.combinations
							.filter((c) => c.variantValue.variantType.type === "color")
							.map(
								(c) =>
									[
										c.variantValue.value,
										{ value: c.variantValue.value, color: c.variantValue.colorValue },
									] as const,
							)
					: [],
			),
		).values(),
	];

	return (
		<article className={cn("group relative", className)}>
			<div className="relative aspect-square overflow-hidden rounded-md bg-stage">
				{primaryImage && (
					<YNSMedia
						src={primaryImage}
						alt=""
						fill
						sizes={sizes}
						priority={priority}
						className={cn(
							"object-cover transition-[opacity,transform] duration-500",
							secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-[1.03]",
						)}
					/>
				)}
				{secondaryImage && (
					<YNSMedia
						src={secondaryImage}
						alt=""
						fill
						sizes={sizes}
						className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					/>
				)}
				{(discount || outOfStock) && (
					<div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
						{outOfStock ? <Badge tone="muted">Sold out</Badge> : <Badge tone="sale">{discount}% off</Badge>}
					</div>
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
			<div className="mt-3 space-y-1.5">
				{swatches.length > 0 && (
					<ul aria-label="Colours" className="flex flex-wrap gap-1.5">
						{swatches.slice(0, 6).map((swatch) => (
							<li
								key={swatch.value}
								title={swatch.value}
								className="h-4 w-4 rounded-[3px] border border-input p-px"
							>
								<span
									className="block h-full w-full rounded-[2px]"
									style={{ backgroundColor: swatch.color ?? "#fff" }}
								/>
								<span className="sr-only">{swatch.value}</span>
							</li>
						))}
					</ul>
				)}
				<Link
					href={href}
					className="line-clamp-2 text-[13px] leading-snug tracking-[0.01em] text-foreground uppercase after:absolute after:inset-0 sm:text-sm"
				>
					{product.name}
				</Link>
				{priceDisplay && (
					<p className="flex flex-wrap items-baseline gap-x-1.5 text-[13px] tabular-nums sm:text-sm">
						{compareAt && (
							<span className="text-muted-foreground line-through">
								<span className="sr-only">Was </span>
								{fmt(BigInt(compareAt))}
							</span>
						)}
						<span className="text-foreground">{priceDisplay}</span>
					</p>
				)}
			</div>
		</article>
	);
}
