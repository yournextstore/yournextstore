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

const swatchPalette = [
	"radial-gradient(ellipse at 30% 30%, #f8d4d9 0%, #f2b7c1 60%, #e7969f 100%)",
	"radial-gradient(ellipse at 30% 30%, #fde4c8 0%, #f4ecdc 60%, #c8a98a 100%)",
	"radial-gradient(ellipse at 30% 30%, #ffd6dc 0%, #ffb1bf 60%, #e11226 100%)",
	"radial-gradient(ellipse at 30% 30%, #d7e3c1 0%, #b3c592 60%, #7a8b5a 100%)",
	"radial-gradient(ellipse at 30% 30%, #fbf6ec 0%, #f4ecdc 60%, #c8a98a 100%)",
	"radial-gradient(ellipse at 30% 30%, #f2b7c1 0%, #e11226 60%, #b30d1d 100%)",
];

export async function ProductCard({
	product,
	index = 0,
	priority = false,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	index?: number;
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

	const swatch = swatchPalette[index % swatchPalette.length];

	return (
		<IntentLink href={`/product/${product.slug}${variantSearch}`} className="group block">
			<div
				className="relative aspect-square overflow-hidden rounded-[3px] mb-5"
				style={{ background: swatch }}
			>
				<div aria-hidden="true" className="absolute inset-0 yns-grain opacity-30" />
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
							className={`absolute inset-0 w-full h-full object-contain p-6 mix-blend-multiply transition-all duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""} group-hover:scale-105`}
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
							className={`object-contain p-6 mix-blend-multiply transition-all duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""} group-hover:scale-105`}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 w-full h-full object-contain p-6 mix-blend-multiply opacity-0 transition-opacity duration-500 group-hover:opacity-100"
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
							className="object-contain p-6 mix-blend-multiply opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					))}

				{priceDisplay && (
					<div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[#fbf6ec] text-[#0f0f10] px-3 py-1 rounded-full text-[11px] tracking-wider font-semibold shadow-sm">
						{priceDisplay}
						{compareAtDisplay && (
							<span className="font-normal line-through text-[#0f0f10]/55">{compareAtDisplay}</span>
						)}
					</div>
				)}
			</div>
			<div className="space-y-1 px-1">
				<h2 className="font-serif text-xl italic text-[#0f0f10] tracking-tight leading-tight">
					{product.name}
				</h2>
				<p className="text-[10px] tracking-[0.32em] uppercase text-[#e11226] font-semibold">Add to cart →</p>
			</div>
		</IntentLink>
	);
}
