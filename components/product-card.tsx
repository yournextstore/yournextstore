import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { firstStill, getBrandMap, optionCountLabel } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

const LOW_STOCK = 5;

/**
 * The original's product tile: a grey panel holding the photo and a white info plate. The name
 * link stretches over the whole card (`.product-card-link::after`); quick add sits above it.
 */
export async function ProductCard({
	product,
	priority = false,
}: {
	product: CardProduct;
	priority?: boolean;
}) {
	const [{ currency, locale, taxBehavior }, brands] = await Promise.all([getStoreConfig(), getBrandMap()]);
	const variants = "variants" in product ? product.variants : [];
	const shown = variants.find((v) => v.stock !== 0) ?? variants[0];
	const price = shown ? BigInt(displayPrice(shown, taxBehavior)) : null;
	const listPriceRaw = shown ? displayPrice(shown, taxBehavior, "originalPrice") : null;
	const listPrice = listPriceRaw ? BigInt(listPriceRaw) : null;
	const onSale = price !== null && listPrice !== null && listPrice > price;
	const discount = onSale ? Math.round((Number(listPrice - price) / Number(listPrice)) * 100) : 0;
	const money = (amount: bigint) => formatMoney({ amount, currency, locale });

	const brandId = "brandId" in product ? product.brandId : null;
	const category = "category" in product ? product.category : null;
	const eyebrow = (brandId && brands[brandId]?.name) || category?.name || null;

	const combinations = shown && "combinations" in shown ? shown.combinations : [];
	const tags = [
		...combinations.slice(0, 2).map((c) => c.variantValue.value),
		...[optionCountLabel(variants)].filter((tag): tag is string => Boolean(tag)),
	];

	const tracked = variants.filter((v) => v.stock !== null);
	const soldOut = variants.length > 0 && variants.every((v) => v.stock === 0);
	const stockLeft = tracked.reduce((sum, v) => sum + (v.stock ?? 0), 0);
	const low = !soldOut && tracked.length === variants.length && stockLeft > 0 && stockLeft <= LOW_STOCK;

	const images = [
		...(product.images ?? []),
		...variants.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)),
	].filter((url) => firstStill([url]));
	const [primary, secondary] = images;

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const variantSearch = (() => {
		if (variants.length !== 1 || combinations.length === 0) return "";
		const params = new URLSearchParams(
			combinations.map((c) => [c.variantValue.variantType.label, c.variantValue.value]),
		);
		return `?${params.toString()}`;
	})();

	return (
		<article className="product-card" data-soldout={soldOut || undefined}>
			<div className="product-card-media">
				<div className="media">
					{primary && (
						<YNSMedia
							src={primary}
							alt={product.name}
							fill
							priority={priority}
							sizes="(max-width: 760px) 50vw, (max-width: 1180px) 33vw, 25vw"
							className="object-cover"
						/>
					)}
				</div>
				{secondary && (
					<div className="media hover-image">
						<YNSMedia
							src={secondary}
							alt=""
							fill
							sizes="(max-width: 760px) 50vw, 25vw"
							className="object-cover"
						/>
					</div>
				)}
				{discount > 0 && (
					<span className="product-card-badges">
						<span className="badge deal">−{discount}%</span>
					</span>
				)}
				{(soldOut || low) && (
					<span className="stock-flag" data-tone={soldOut ? "bad" : "warn"}>
						<i aria-hidden />
						{soldOut ? "Sold out" : "Few left"}
					</span>
				)}
				{shown && !soldOut && (
					<QuickAddButton
						variantId={shown.id}
						variantSku={"sku" in shown ? shown.sku : null}
						variantPrice={shown.price}
						variantPriceGross={"priceGross" in shown ? shown.priceGross : null}
						variantImages={shown.images ?? []}
						label={combinations[0]?.variantValue.value ?? null}
						product={{ id: product.id, name: product.name, slug: product.slug, images: product.images ?? [] }}
					/>
				)}
			</div>
			<div className="product-card-body">
				{eyebrow && <p className="product-card-brand">{eyebrow}</p>}
				<h3 className="product-card-name">
					<Link href={`/product/${product.slug}${variantSearch}`} className="product-card-link">
						{product.name}
					</Link>
				</h3>
				{tags.length > 0 && (
					<ul className="product-card-tags" aria-label="Details">
						{tags.map((tag) => (
							<li key={tag}>{tag}</li>
						))}
					</ul>
				)}
				<div className="product-card-foot">
					<p className="product-card-price">
						{price !== null && <strong>{money(price)}</strong>}
						{onSale && listPrice !== null && (
							<del>
								<span className="sr-only">Was </span>
								{money(listPrice)}
							</del>
						)}
					</p>
					<span className="arrow-chip" aria-hidden>
						<ArrowUpRight size={16} aria-hidden />
					</span>
				</div>
			</div>
		</article>
	);
}

/** Card-shaped placeholder: same frame and plate, so swapping in the real grid does not shift. */
export function ProductCardSkeleton() {
	return (
		<div className="card-skeleton" aria-hidden>
			<div className="loading-image" />
			<div className="loading-plate">
				<div className="loading-line short" />
				<div className="loading-line" />
				<div className="loading-line short" />
			</div>
		</div>
	);
}
