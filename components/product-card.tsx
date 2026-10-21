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
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

const FEW_LEFT = 5;

/**
 * The original's article card as a product card: an aged photograph on top (it warms up and zooms on
 * hover), then on the mid panel a muted caps line (shelf), the name in Playfair, the summary, the price
 * in brass and a "read more"-style caps action: Add to cart → for one-option pieces, else View →.
 */
export async function ProductCard({
	product,
	priority = false,
	headingLevel = "h3",
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	headingLevel?: "h2" | "h3";
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const fmt = (amount: bigint | string) => formatMoney({ amount, currency, locale });

	const priceDisplay = listing ? `${listing.from ? "From " : ""}${fmt(listing.amount)}` : null;

	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior, "originalPrice") : null;
	const salePrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior) : null;
	const onSale = Boolean(listPrice && salePrice && BigInt(listPrice) > BigInt(salePrice));

	const stock =
		variants && variants.length > 0 && variants.every((v) => typeof v.stock === "number")
			? variants.reduce((sum, v) => sum + (v.stock ?? 0), 0)
			: null;
	const badge =
		stock === 0
			? { label: "Sold out", tone: "badge-muted" }
			: onSale
				? { label: "⟡ On sale", tone: "" }
				: stock !== null && stock <= FEW_LEFT
					? { label: "★ Few left", tone: "badge-gold" }
					: null;

	const images = [...(product.images ?? []), ...(variants?.flatMap((v) => v.images ?? []) ?? [])];
	const image = images.find((url) => !isVideoUrl(url));

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant = oneTimeAllowed && onlyVariant && onlyVariant.stock !== 0 ? onlyVariant : null;

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
	const summary = "summary" in product ? product.summary : null;
	const options = variants?.length ?? 0;
	const Heading = headingLevel;

	return (
		<article
			className={cn(
				"group relative flex flex-col overflow-hidden rounded-[4px] bg-panel transition-[transform,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)]",
				className,
			)}
		>
			<div className="relative aspect-[4/3] overflow-hidden bg-panel-2">
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
						priority={priority}
						fetchPriority={priority ? "high" : undefined}
						className="aged object-cover group-hover:scale-105"
					/>
				)}
				{badge && <span className={cn("badge absolute top-3 left-3", badge.tone)}>{badge.label}</span>}
			</div>
			<div className="flex flex-1 flex-col p-6">
				{category && <p className="caps mb-3 text-[0.875rem] font-normal text-dim">{category}</p>}
				<Heading className="serif mb-3 text-[1.25rem] font-bold leading-[1.3] text-cream">
					<Link
						href={href}
						className="transition-colors duration-150 after:absolute after:inset-0 after:content-[''] hover:text-gold"
					>
						{product.name}
					</Link>
				</Heading>
				{summary && <p className="mb-4 line-clamp-2 text-ink">{summary}</p>}
				<p className="mt-auto mb-4 flex items-baseline gap-2">
					<span className="serif text-[1.25rem] text-gold">{priceDisplay}</span>
					{onSale && listPrice ? <del className="text-[0.875rem] text-dim">{fmt(listPrice)}</del> : null}
				</p>
				<div className="flex min-h-10 items-center">
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
						<span
							aria-hidden="true"
							className="caps inline-flex items-center gap-2 text-[0.875rem] text-gold transition-[gap] duration-150 group-hover:gap-3"
						>
							{options > 1 && stock !== 0 ? `${options} options` : "View item"} →
						</span>
					)}
				</div>
			</div>
		</article>
	);
}
