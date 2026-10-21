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

const LOW_STOCK = 5;

/** The range card's status tag, from stock: the original's in stock / small batch / made to order trio. */
function stockTag(variants: { stock: number | null }[] | null) {
	if (!variants || variants.length === 0) return null;
	const stocks = variants.map((v) => v.stock);
	if (stocks.every((s) => s === 0)) return { label: "sold out", tone: "tag--order" };
	const tracked = stocks.filter((s): s is number => s !== null);
	if (tracked.length === stocks.length && tracked.reduce((a, b) => a + b, 0) <= LOW_STOCK) {
		return { label: "last few", tone: "tag--batch" };
	}
	return { label: "in stock", tone: "tag--stock" };
}

/**
 * The original's range card: a panel with a lifted "art" plate (here the product photograph, pasted
 * on with a paper margin), then the name in the display serif beside a mono price, a blue spec line,
 * a short note and a status tag.
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 580px) 100vw, (max-width: 940px) 50vw, 400px",
	as: Heading = "h3",
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	sizes?: string;
	as?: "h2" | "h3";
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `from ${formatMoney({ amount: minPrice, currency, locale })}`
			: minPrice
				? formatMoney({ amount: minPrice, currency, locale })
				: null;

	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior, "originalPrice") : null;
	const salePrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior) : null;
	const onSale = listPrice && salePrice && BigInt(listPrice) > BigInt(salePrice);

	const image = [...(product.images ?? []), ...(variants?.flatMap((v) => v.images ?? []) ?? [])].find(
		(img) => !isVideoUrl(img),
	);

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
	const href = `/product/${product.slug}${variantSearch}`;

	const category = "category" in product && product.category ? product.category.name : null;
	const spec = [
		category,
		variants && variants.length > 1 ? `${variants.length} options` : null,
		onSale ? "reduced" : null,
	]
		.filter(Boolean)
		.join(" · ");
	const note = "summary" in product ? product.summary : null;
	const tag = stockTag(variants);

	return (
		<article className={cn("good group h-full", className)}>
			<Link href={href} tabIndex={-1} aria-hidden="true" className="good-art block">
				<span className="absolute inset-[clamp(10px,4%,18px)] overflow-hidden rounded-[3px] bg-kraft-2 shadow-[0_10px_22px_-14px_rgba(20,23,31,.55)] ring-1 ring-line">
					{image && (
						<YNSMedia
							src={image}
							alt=""
							fill
							sizes={sizes}
							priority={priority}
							className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
						/>
					)}
				</span>
			</Link>
			<div className="flex flex-1 flex-col px-[1.2rem] pb-[1.3rem] pt-[1.1rem]">
				<div className="flex items-baseline justify-between gap-2.5">
					<Heading className="min-w-0 text-[1.32rem] leading-[1.1]">
						<Link href={href} className="after:absolute after:inset-0 after:content-['']">
							{product.name}
						</Link>
					</Heading>
					<p className="mono shrink-0 text-right text-[0.95rem] text-ink">
						{priceDisplay}
						{onSale && listPrice ? (
							<del className="block text-[0.72rem] text-faint">
								{formatMoney({ amount: listPrice, currency, locale })}
							</del>
						) : null}
					</p>
				</div>
				{spec && <p className="mono mt-2 text-[0.72rem] text-blue-ink">{spec}</p>}
				{note && <p className="mb-3.5 mt-2 line-clamp-2 text-[0.9rem] text-dim">{note}</p>}
				<div className="relative z-10 mt-auto flex items-center justify-between gap-3 pt-2">
					{tag && <span className={`tag ${tag.tone}`}>{tag.label}</span>}
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
			</div>
		</article>
	);
}
