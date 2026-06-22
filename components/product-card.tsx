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

const CARD_GRADIENTS = [
	"bg-coral-card",
	"bg-grape-card",
	"bg-sun-card",
	"bg-promo-card",
	"bg-coral-card",
	"bg-grape-card",
];

export async function ProductCard({
	product,
	priority = false,
	index = 0,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	index?: number;
}) {
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
	const cardBg = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

	return (
		<IntentLink href={`/product/${product.slug}${variantSearch}`} className="group block">
			<div
				className={`relative aspect-square overflow-hidden rounded-[2rem] ${cardBg} p-3 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-jelly`}
			>
				<div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-white/15 backdrop-blur-[2px]">
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
								className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								className={`object-cover transition-all duration-500 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
								priority={priority}
								fetchPriority={priority ? "high" : undefined}
							/>
						))}
					{secondaryImage &&
						(isVideoUrl(secondaryImage) ? (
							<video
								className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								src={secondaryImage}
								muted
								loop
								autoPlay
								playsInline
							/>
						) : (
							<YNSMedia
								src={secondaryImage}
								alt={`${product.name} - alternate view`}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								className="object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
							/>
						))}
				</div>
			</div>
			<div className="mt-4 flex items-start justify-between gap-3 px-1">
				<h2 className="font-display text-base uppercase tracking-tight text-[var(--purple-deep)]">
					{product.name}
				</h2>
				{priceDisplay && (
					<p className="shrink-0 rounded-full bg-[var(--pink)] px-3 py-1 text-sm font-bold text-white">
						{priceDisplay}
						{compareAtDisplay && (
							<span className="ml-2 font-medium line-through opacity-75">{compareAtDisplay}</span>
						)}
					</p>
				)}
			</div>
		</IntentLink>
	);
}
