import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { IntentLink } from "@/components/intent-link";
import { blurPreview } from "@/lib/blur-placeholder";
import { formatMoney } from "@/lib/money";
import { listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

type ProductCardProps = {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	previewMode?: boolean;
};

export async function ProductCard({ product, priority = false }: ProductCardProps) {
	const variants = "variants" in product ? product.variants : null;
	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];
	const [{ currency, locale, taxBehavior }, preview] = await Promise.all([
		getStoreConfig(),
		blurPreview(primaryImage),
	]);
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing
		? `${listing.from ? "From " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
		: null;
	const compareAtDisplay = listing?.compareAt
		? formatMoney({ amount: listing.compareAt, currency, locale })
		: null;

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant =
		oneTimeAllowed && variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

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

	const brand = "category" in product && product.category?.name ? product.category.name : "Your Next Store";

	const swatches =
		variants
			?.flatMap((v) => v.combinations)
			?.filter((c) => c.variantValue.variantType.type === "color")
			?.map((c) => c.variantValue) ?? [];
	const uniqueSwatches = Array.from(new Map(swatches.map((s) => [s.value, s])).values()).slice(0, 4);

	return (
		<IntentLink href={`/product/${product.slug}${variantSearch}`} className="group block">
			<div className="relative aspect-[3/4] gallery-frame overflow-hidden">
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
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							src={primaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<YNSMedia
							src={primaryImage}
							preview={preview}
							alt={product.name}
							fill
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							className={`object-cover transition-opacity duration-700 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
							src={secondaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<YNSMedia
							src={secondaryImage}
							alt={`${product.name} — alternate`}
							fill
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
						/>
					))}
			</div>
			<div className="mt-3 sm:mt-4 space-y-[2px]">
				<p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{brand}</p>
				<h2 className="text-[13px] sm:text-sm text-foreground line-clamp-1 leading-tight">{product.name}</h2>
				<p className="flex flex-wrap items-baseline gap-2 pt-1">
					<span className="text-[13px] sm:text-sm font-medium text-foreground">{priceDisplay}</span>
					{compareAtDisplay && (
						<span className="text-xs text-muted-foreground line-through">{compareAtDisplay}</span>
					)}
				</p>
				{uniqueSwatches.length > 0 && (
					<div className="flex gap-1.5 pt-2">
						{uniqueSwatches.map((s) => (
							<span
								key={s.id}
								className="block w-3 h-3 rounded-full border border-border/60"
								style={{ backgroundColor: s.colorValue ?? "#ddd" }}
								title={s.value}
							/>
						))}
					</div>
				)}
			</div>
		</IntentLink>
	);
}
