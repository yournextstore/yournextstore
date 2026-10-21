import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { getStoreBrand } from "@/lib/catalog";
import { entryYear, ledgerStatus, lotNumber } from "@/lib/ledger";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/**
 * The original's wine card, as a ledger entry for any product: the photograph where the bottle stood,
 * then lot number, name, a gold year · shelf line, the summary in Cormorant italic, a mono data line
 * and the status pill, with the price and an add button closing the entry.
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
	const [{ currency, locale, taxBehavior }, brand] = await Promise.all([getStoreConfig(), getStoreBrand()]);
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const fmt = (amount: bigint | string) => formatMoney({ amount, currency, locale });

	const priceDisplay =
		minPrice && maxPrice && minPrice !== maxPrice
			? `${fmt(minPrice)} – ${fmt(maxPrice)}`
			: minPrice
				? fmt(minPrice)
				: null;

	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior, "originalPrice") : null;
	const salePrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior) : null;
	const onSale = Boolean(listPrice && salePrice && BigInt(listPrice) > BigInt(salePrice));

	const stock =
		variants && variants.length > 0 && variants.every((v) => typeof v.stock === "number")
			? variants.reduce((sum, v) => sum + (v.stock ?? 0), 0)
			: null;
	const status = ledgerStatus({ stock, onSale });

	const images = [...(product.images ?? []), ...(variants?.flatMap((v) => v.images ?? []) ?? [])];
	const image = images.find((url) => !isVideoUrl(url));

	const singleVariant = onlyVariant && onlyVariant.stock !== 0 ? onlyVariant : null;

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

	const createdAt =
		"createdAt" in product && typeof product.createdAt === "string" ? product.createdAt : null;
	const sku = onlyVariant && "sku" in onlyVariant ? onlyVariant.sku : null;
	const lot = lotNumber({ store: brand.name, id: product.id, createdAt, sku });
	const category = "category" in product && product.category ? product.category.name : null;
	const sub = [entryYear(createdAt), category].filter(Boolean).join(" · ");
	const summary = "summary" in product ? product.summary : null;
	const options = variants?.length ?? 0;
	const data = [
		options > 1 ? `${options} options` : "One option",
		stock !== null && stock > 0 ? `${stock} in stock` : null,
	]
		.filter(Boolean)
		.join(" · ");
	const Heading = headingLevel;

	return (
		<article
			className={cn(
				"group relative grid rounded-[4px] border border-line bg-panel gap-[clamp(18px,3vw,30px)] p-[clamp(20px,3.4vw,34px)] transition-[transform,border-color,background-color] duration-600 ease-decant hover:-translate-y-1 hover:border-gold/45 hover:bg-panel-2 sm:grid-cols-[auto_1fr] sm:items-center",
				className,
			)}
		>
			<div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line bg-panel-2 sm:aspect-[3/4] sm:w-[clamp(104px,12vw,148px)]">
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="(max-width: 640px) 100vw, 160px"
						priority={priority}
						className="object-cover transition-transform duration-700 ease-decant group-hover:scale-[1.04]"
					/>
				)}
			</div>
			<div className="min-w-0">
				<p className="ledger mb-[0.7rem] text-[0.62rem] tracking-[0.2em] text-faint">Lot Nº {lot}</p>
				<Heading className="serif text-[1.9rem] font-medium leading-[1.1] text-cream">
					<Link
						href={href}
						className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-gold-2"
					>
						{product.name}
					</Link>
				</Heading>
				{sub && <p className="ledger mt-0.5 text-[0.7rem] tracking-[0.16em] text-gold">{sub}</p>}
				{summary && (
					<p className="serif mt-[0.9rem] line-clamp-3 max-w-[34ch] text-[1.18rem] leading-[1.4] text-dim italic">
						{summary}
					</p>
				)}
				<p className="ledger mt-4 text-[0.68rem] tracking-[0.14em] text-dim">{data}</p>
				<div className="mt-[1.1rem] flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
					<p
						data-status={status.tone}
						className="ledger inline-flex items-center gap-2 rounded-[4px] border border-line px-3 py-[7px] text-[0.62rem] tracking-[0.16em] text-dim"
					>
						<span className="status-dot" aria-hidden="true" />
						{status.label}
					</p>
					<div className="flex items-center gap-3">
						<p className="flex items-baseline gap-2">
							{onSale && listPrice ? (
								<del className="mono text-[0.72rem] text-faint">{fmt(listPrice)}</del>
							) : null}
							<span className="serif text-[1.6rem] font-medium leading-none text-cream">{priceDisplay}</span>
						</p>
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
			</div>
		</article>
	);
}
