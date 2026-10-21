import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

const NEW_FOR_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * The original's product tile: a rounded cream frame with a corner tag and a "+ Add" pill that rises on
 * hover, then the name in Playfair beside a small price column.
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px",
	subtitle,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	sizes?: string;
	/** Small line under the name; defaults to the product's category. */
	subtitle?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `${formatMoney({ amount: minPrice, currency, locale })} – ${formatMoney({ amount: maxPrice, currency, locale })}`
			: minPrice
				? formatMoney({ amount: minPrice, currency, locale })
				: null;

	// Sale: the single variant's list price above its price (the original's "-24%" badge and struck price).
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior, "originalPrice") : null;
	const salePrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior) : null;
	const onSale = listPrice && salePrice && BigInt(listPrice) > BigInt(salePrice);
	const discount = onSale ? Math.round((1 - Number(salePrice) / Number(listPrice)) * 100) : null;
	// `createdAt` comes from the API; the card is cached per product, which pins `Date.now()` to the entry.
	const isNew =
		"createdAt" in product &&
		typeof product.createdAt === "string" &&
		Date.now() - new Date(product.createdAt).getTime() < NEW_FOR_DAYS * MS_PER_DAY;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

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
	const line =
		subtitle ?? category ?? (variants && variants.length > 1 ? `${variants.length} options` : null);
	const tag = discount ? `Save ${discount}%` : isNew ? "New in" : null;

	return (
		<article className="group relative flex flex-col gap-[18px]">
			<div className="relative overflow-hidden rounded-tile bg-cream">
				<Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[37/36]">
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
								sizes={sizes}
								className={`object-cover transition-[transform,opacity] duration-[450ms] ease-out group-hover:scale-[1.04] ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
				</Link>
				{tag && (
					<span className="caps pointer-events-none absolute left-3.5 top-3.5 bg-white/90 px-2.5 py-2 text-[0.62rem] font-bold text-coral-text">
						{tag}
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
			</div>
			<div className="flex items-start justify-between gap-3.5">
				<div className="min-w-0">
					<p className="serif text-[1.55rem] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-[1.8rem]">
						<Link href={href} className="transition-colors hover:text-coral-text">
							{product.name}
						</Link>
					</p>
					{line && <p className="mt-1 text-[0.73rem] text-muted-foreground">{line}</p>}
				</div>
				<p className="flex shrink-0 flex-col items-end gap-0.5 pt-1 text-right">
					<strong className="text-base">{priceDisplay}</strong>
					{onSale && listPrice ? (
						<del className="text-[0.68rem] text-muted-foreground">
							{formatMoney({ amount: listPrice, currency, locale })}
						</del>
					) : null}
				</p>
			</div>
		</article>
	);
}
