import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { blurb, sentenceCase } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

type Swatch = { value: string; color: string };

function colorSwatches(product: BrowseProduct | CollectionProduct | FullProduct): Swatch[] {
	if (!("variants" in product)) return [];
	const seen = new Set<string>();
	return product.variants.flatMap((variant) =>
		("combinations" in variant ? variant.combinations : []).flatMap(({ variantValue }) => {
			if (variantValue.variantType.type !== "color" || !variantValue.colorValue) return [];
			if (seen.has(variantValue.value)) return [];
			seen.add(variantValue.value);
			return [{ value: variantValue.value, color: variantValue.colorValue }];
		}),
	);
}

/**
 * The original's `.card.card-product`: a bordered, softly shadowed card with the photo inset by
 * the card padding, a small grey kicker, a bold name, an optional blurb, colour badges and the price.
 */
export async function ProductCard({
	product,
	priority = false,
	align = "left",
	details = false,
	headingLevel = 3,
	sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	align?: "left" | "center";
	/** Show the summary blurb and colour badges ("Cards with full details"). */
	details?: boolean;
	headingLevel?: 2 | 3;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `From ${formatMoney({ amount: minPrice, currency, locale })}`
			: minPrice
				? formatMoney({ amount: minPrice, currency, locale })
				: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

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

	const category = "category" in product && product.category ? sentenceCase(product.category.name) : null;
	const optionCount = variants && variants.length > 1 ? `${variants.length} options` : null;
	const kicker = optionCount ?? category;
	const description = details && "summary" in product ? blurb(product.summary, product.name) : null;
	const swatches = details ? colorSwatches(product) : [];
	const soldOut = variants ? variants.length > 0 && variants.every((variant) => variant.stock === 0) : false;
	const Heading = headingLevel === 2 ? "h2" : "h3";

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className="card-ae group relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md"
		>
			<div className="p-3 pb-0 sm:p-4 sm:pb-0">
				<div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
					{primaryImage &&
						(isVideoUrl(primaryImage) ? (
							<video
								className={cn(
									"absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
									secondaryImage && "group-hover:opacity-0",
								)}
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
								sizes={sizes}
								className={cn(
									"object-cover transition-opacity duration-500",
									secondaryImage && "group-hover:opacity-0",
								)}
								priority={priority}
							/>
						))}
					{secondaryImage && !isVideoUrl(secondaryImage) && (
						<YNSMedia
							src={secondaryImage}
							alt=""
							fill
							sizes={sizes}
							className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					)}
					{soldOut && (
						<span className="absolute left-3 top-3 rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-ink shadow-xs-ae">
							Sold out
						</span>
					)}
				</div>
			</div>
			<div
				className={cn(
					"flex flex-1 flex-col p-4 pt-4",
					align === "center" ? "items-center text-center" : "text-left",
				)}
			>
				{kicker && <p className="mb-1 text-sm font-semibold text-slate-body">{kicker}</p>}
				<Heading className="text-lg font-semibold leading-snug text-slate-ink sm:text-xl">
					{product.name}
				</Heading>
				{description && <p className="mt-2 line-clamp-3 text-sm text-slate-body">{description}</p>}
				{swatches.length > 0 && (
					<ul aria-label="Colours" className="mt-3 flex flex-wrap gap-1.5">
						{swatches.map((swatch) => (
							<li
								key={swatch.value}
								title={swatch.value}
								className="h-4 w-4 rounded-[0.25rem] border border-black/10"
								style={{ backgroundColor: swatch.color }}
							>
								<span className="sr-only">{swatch.value}</span>
							</li>
						))}
					</ul>
				)}
				{priceDisplay && (
					<p className="mt-auto pt-2 text-base font-semibold text-slate-ink sm:text-lg">{priceDisplay}</p>
				)}
			</div>
		</Link>
	);
}
