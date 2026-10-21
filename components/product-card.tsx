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
 * Commerceplate's centred product card: a bordered grey photo box whose "Add To Cart" button
 * slides up on hover (always shown on phones), then the name and a bold price.
 */
export async function ProductCard({
	product,
	priority = false,
	heading = "h3",
	layout = "grid",
	compact = false,
}: {
	product: CardProduct;
	priority?: boolean;
	heading?: "h2" | "h3";
	layout?: "grid" | "list";
	/** Home "Featured" row: the original's shorter photo box on phones. */
	compact?: boolean;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `${fmt(minPrice)} – ${fmt(maxPrice)}`
			: minPrice
				? fmt(minPrice)
				: null;

	// Struck-through list price, as in the original, when the only variant is on sale.
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const compareAt = (() => {
		if (!onlyVariant || !("originalPrice" in onlyVariant) || !onlyVariant.originalPrice) return null;
		const list = BigInt(displayPrice(onlyVariant, taxBehavior, "originalPrice") ?? onlyVariant.originalPrice);
		const price = BigInt(displayPrice(onlyVariant, taxBehavior));
		return list > price ? fmt(list) : null;
	})();

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const buyable = onlyVariant && onlyVariant.stock !== 0 ? onlyVariant : null;
	const soldOut = Boolean(variants && variants.length > 0 && variants.every((v) => v.stock === 0));

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
	const Heading = heading;
	const summary = "summary" in product ? product.summary : null;

	const action = buyable ? (
		<QuickAddButton
			variantId={buyable.id}
			variantSku={"sku" in buyable ? buyable.sku : null}
			variantPrice={buyable.price}
			variantPriceGross={"priceGross" in buyable ? buyable.priceGross : null}
			variantImages={buyable.images}
			product={{ id: product.id, name: product.name, slug: product.slug, images: product.images ?? [] }}
			layout={layout}
		/>
	) : (
		<Link
			href={href}
			tabIndex={-1}
			aria-hidden
			className={cn(
				"cp-btn cp-btn-sm z-10",
				layout === "grid" &&
					"absolute bottom-3 left-1/2 -translate-x-1/2 shadow-md duration-300 ease-in-out md:bottom-0 md:translate-y-full md:group-hover:-translate-y-6",
			)}
		>
			{soldOut ? "Sold Out" : "Select Options"}
		</Link>
	);

	const photo = (
		<div
			className={cn(
				"relative overflow-hidden rounded-md border border-border bg-light",
				layout === "list"
					? "aspect-[312/269] w-full sm:w-64 sm:shrink-0"
					: compact
						? "h-[150px] w-full md:h-[269px]"
						: "h-[200px] w-full md:h-[269px]",
			)}
		>
			{primaryImage &&
				(isVideoUrl(primaryImage) ? (
					<video
						className="absolute inset-0 h-full w-full object-cover"
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
						sizes={layout === "list" ? "256px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 312px"}
						className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
						priority={priority}
					/>
				))}
			{layout === "grid" ? action : null}
		</div>
	);

	if (layout === "list") {
		return (
			<article className="group relative flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-center">
				{photo}
				<div className="flex flex-col gap-3">
					<Heading className="text-xl font-medium text-ink">
						<Link href={href} className="after:absolute after:inset-0">
							{product.name}
						</Link>
					</Heading>
					<p className="flex flex-wrap items-baseline gap-x-2">
						<span className="text-xl font-bold text-ink">{priceDisplay}</span>
						{compareAt ? <s className="text-sm font-medium text-soft-text">{compareAt}</s> : null}
					</p>
					{summary ? <p className="line-clamp-2 max-w-xl text-body-text">{summary}</p> : null}
					<div className="relative z-10">{action}</div>
				</div>
			</article>
		);
	}

	return (
		<article className="group relative text-center">
			{photo}
			<div className="py-2 md:py-4">
				<Heading className="text-base font-medium text-ink md:text-xl">
					<Link href={href} className="after:absolute after:inset-0">
						{product.name}
					</Link>
				</Heading>
				<p className="mt-2 flex flex-wrap items-baseline justify-center gap-x-2 md:mt-4">
					<span className="text-base font-bold text-ink md:text-xl">{priceDisplay}</span>
					{compareAt ? <s className="text-xs font-medium text-soft-text md:text-base">{compareAt}</s> : null}
				</p>
			</div>
		</article>
	);
}
