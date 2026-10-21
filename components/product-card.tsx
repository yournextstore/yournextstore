import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export async function ProductCard({
	product,
	priority = false,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `${formatMoney({ amount: minPrice, currency, locale })} - ${formatMoney({ amount: maxPrice, currency, locale })}`
			: minPrice
				? formatMoney({ amount: minPrice, currency, locale })
				: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	const singleVariant = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

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

	// The original's listing tile: a photograph a full screen tall that crossfades to the second
	// shot on hover, with name and price set plainly in the bottom-left corner.
	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className="group relative block overflow-hidden lg:h-svh lg:min-h-[34rem]"
		>
			<div className="relative aspect-[4/5] bg-panel lg:absolute lg:inset-0 lg:aspect-auto">
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							sizes="(max-width: 1023px) 50vw, 33vw"
							className={`object-cover transition-opacity duration-300 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							priority={priority}
						/>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							src={secondaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<YNSMedia
							src={secondaryImage}
							alt=""
							fill
							sizes="(max-width: 1023px) 50vw, 33vw"
							className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						/>
					))}
			</div>
			{/* Phones: the caption sits under the photograph; desktop: in its bottom-left corner. */}
			<div className="px-3 pb-6 pt-3 text-tile text-snow lg:absolute lg:inset-x-0 lg:bottom-0 lg:bg-linear-to-t lg:from-[#f4efe8]/70 lg:to-transparent lg:px-[2vw] lg:pb-[2vw] lg:pt-16 lg:text-black">
				<h2 className="text-tile font-normal lg:pr-14">{product.name}</h2>
				{priceDisplay && <p>{priceDisplay}</p>}
			</div>
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
		</Link>
	);
}
