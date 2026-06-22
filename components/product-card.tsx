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

const cardTints = [
	"bg-[#f2c9a6]",
	"bg-[#b9bcf2]",
	"bg-[#e8a47a]",
	"bg-[#d4d6f7]",
	"bg-[#fdf6ee]",
	"bg-[#f2e6d4]",
];

function hashIndex(id: string, length: number) {
	let h = 0;
	for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
	return Math.abs(h) % length;
}

export async function ProductCard({
	product,
	priority = false,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
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

	const tint = cardTints[hashIndex(product.id, cardTints.length)];

	return (
		<IntentLink href={`/product/${product.slug}${variantSearch}`} className="group">
			<div
				className={`relative aspect-square ${tint} rounded-[1.5rem] overflow-hidden mb-4 ring-1 ring-[#1a1a2e]/5 shadow-[0_15px_30px_-20px_rgba(26,26,46,0.35)] group-hover:shadow-[0_25px_45px_-20px_rgba(26,26,46,0.5)] transition-all`}
			>
				<div className="absolute inset-0 scent-grain opacity-30 pointer-events-none" aria-hidden="true" />
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
							className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
							className={`object-cover transition-transform duration-700 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
							className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					))}
			</div>
			<div className="px-1 space-y-1">
				<h2 className="font-display text-xl sm:text-2xl text-[#1a1a2e] leading-tight uppercase tracking-tight">
					{product.name}
				</h2>
				<p className="flex flex-wrap items-baseline gap-2 text-sm font-semibold text-[#4d4bc4]">
					<span>{priceDisplay}</span>
					{compareAtDisplay && (
						<span className="font-normal text-[#1a1a2e]/50 line-through">{compareAtDisplay}</span>
					)}
				</p>
			</div>
		</IntentLink>
	);
}
