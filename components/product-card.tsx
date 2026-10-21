import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { sentenceCase } from "@/lib/catalog-names";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

// The flavour panels, one per card in turn: lime, blush, sky, lilac, cream.
const GROUNDS = ["bg-lime", "bg-blush", "bg-sky", "bg-lilac", "bg-cream"];

/**
 * A flavour card: the product floats on a pastel panel (the photo's studio white multiplied away),
 * name in bold ink, price beside it, the category as a small uppercase line underneath.
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px",
	subtitle,
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	sizes?: string;
	/** Small line under the name; defaults to the product's category. */
	subtitle?: string;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing
		? `${listing.from ? "from " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
		: null;

	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior, "originalPrice") : null;
	const salePrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior) : null;
	const onSale = listPrice && salePrice && BigInt(listPrice) > BigInt(salePrice);

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant =
		oneTimeAllowed && variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

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

	const category = "category" in product && product.category ? sentenceCase(product.category.name) : null;
	const line = subtitle ?? category;

	const soldOut = (variants?.length ?? 0) > 0 && variants?.every((v) => v.stock === 0);
	const ground = GROUNDS[(product.id.charCodeAt(product.id.length - 1) || 0) % GROUNDS.length];

	return (
		<article className={cn("group relative flex flex-col", className)}>
			<div className={cn("relative overflow-hidden rounded-3xl", ground)}>
				<Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-square">
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
								draggable={false}
								className={cn(
									"float-photo object-cover transition-[opacity,scale,rotate] duration-500 ease-pop group-hover:-rotate-3 group-hover:scale-105 motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100",
									secondaryImage && "group-hover:opacity-0",
								)}
								priority={priority}
								fetchPriority={priority ? "high" : undefined}
							/>
						))}
					{secondaryImage && !isVideoUrl(secondaryImage) && (
						<YNSMedia
							src={secondaryImage}
							alt=""
							fill
							sizes={sizes}
							draggable={false}
							className="float-photo object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					)}
				</Link>
				{(soldOut || onSale) && (
					<span className="absolute left-3 top-3 rounded-full bg-ink px-3 pb-1 pt-1.5 text-xs font-bold uppercase tracking-wider text-sun">
						{soldOut ? "Sold out" : "Sale"}
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
			<div className="flex flex-1 flex-col px-1 pt-4">
				<h2 className="line-clamp-2 text-[1.15rem] font-bold leading-tight text-ink sm:text-[1.3rem]">
					<Link href={href} className="after:absolute after:inset-0 after:content-['']">
						{product.name}
					</Link>
				</h2>
				<div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 pt-1.5">
					{line && (
						<p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft sm:text-sm">
							{line}
						</p>
					)}
					<p className="flex items-baseline gap-2 text-[1.1rem] font-bold text-ink sm:text-[1.2rem]">
						<span>{priceDisplay}</span>
						{onSale && listPrice ? (
							<del className="text-sm font-medium text-ink-soft">
								{formatMoney({ amount: listPrice, currency, locale })}
							</del>
						) : null}
					</p>
				</div>
			</div>
		</article>
	);
}
