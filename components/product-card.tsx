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

const DEFAULT_SWATCHES = [
	"var(--tizz-orange)",
	"var(--tizz-blue)",
	"var(--tizz-yellow)",
	"var(--tizz-purple)",
];

function pickSwatchFromId(id: string) {
	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
	}
	return DEFAULT_SWATCHES[hash % DEFAULT_SWATCHES.length];
}

export async function ProductCard({
	product,
	swatch,
	priority,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	swatch?: string;
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
	const bg = swatch ?? pickSwatchFromId(product.id);

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

	return (
		<IntentLink href={`/product/${product.slug}${variantSearch}`} className="group block">
			<div
				className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-[var(--tizz-deep)] mb-3 transition-transform group-hover:-translate-y-1"
				style={{ background: bg }}
			>
				<div className="absolute inset-0 tizz-noise" />
				{/* Halo */}
				<div
					className="absolute inset-0 opacity-50 mix-blend-screen pointer-events-none"
					style={{
						background: "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.45) 0%, transparent 55%)",
					}}
				/>
				{/* Quick add */}
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
				{/* Price chip */}
				{priceDisplay && (
					<div className="absolute top-3 right-3 bg-[var(--tizz-cream)] border-2 border-[var(--tizz-deep)] rounded-full px-3 py-1 tizz-overline text-[10px] sm:text-xs text-[var(--tizz-deep)] z-10 flex flex-wrap items-baseline gap-2">
						<span>{priceDisplay}</span>
						{compareAtDisplay && <span className="line-through opacity-60">{compareAtDisplay}</span>}
					</div>
				)}

				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							src={primaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<div className="absolute inset-0 p-6">
							<YNSMedia
								src={primaryImage}
								preview={preview}
								alt={product.name}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
								className={`object-contain transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
								priority={priority}
								fetchPriority={priority ? "high" : undefined}
							/>
						</div>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 w-full h-full object-contain p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							src={secondaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<div className="absolute inset-0 p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
							<YNSMedia
								src={secondaryImage}
								alt={`${product.name} - alternate view`}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
								className="object-contain"
							/>
						</div>
					))}
			</div>
			<div className="flex items-baseline justify-between gap-2 px-1">
				<h2 className="tizz-display text-[var(--tizz-deep)] text-lg sm:text-xl leading-tight truncate">
					{product.name}
				</h2>
				<span className="tizz-overline text-[var(--tizz-orange)] text-xs shrink-0">Shop →</span>
			</div>
		</IntentLink>
	);
}
