import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { listingPrice, priceRange } from "@/lib/pricing";
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

	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing ? `${listing.from ? "From " : ""}${fmt(listing.amount)}` : null;

	// The original's struck-through list price and red "-20%" pill, for a single price on sale.
	const listPrice =
		variants && variants.length > 0 && minPrice === maxPrice
			? priceRange(variants, taxBehavior, "originalPrice").max
			: null;
	const onSale = listPrice !== null && minPrice !== null && listPrice > minPrice;
	const discountPercent =
		onSale && minPrice !== null ? Math.round((Number(listPrice - minPrice) / Number(listPrice)) * 100) : 0;

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
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className="group relative flex flex-col items-start"
		>
			<div className="relative mb-2.5 aspect-square w-full overflow-hidden rounded-[13px] bg-tile lg:rounded-[20px] xl:mb-4">
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
							className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							src={primaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<YNSMedia
							src={primaryImage}
							alt={product.name}
							fill
							sizes="(max-width: 640px) 60vw, (max-width: 1024px) 33vw, 300px"
							className={`object-cover transition-[opacity,scale] duration-500 group-hover:scale-110 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
				{secondaryImage && !isVideoUrl(secondaryImage) && (
					<YNSMedia
						src={secondaryImage}
						alt=""
						fill
						sizes="(max-width: 640px) 60vw, (max-width: 1024px) 33vw, 300px"
						className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					/>
				)}
			</div>
			<span className="line-clamp-2 text-base font-bold text-black xl:text-xl">{product.name}</span>
			{priceDisplay && (
				<span className="mt-1 flex flex-wrap items-center gap-x-[5px] gap-y-1 xl:mt-2 xl:gap-x-2.5">
					<span className="text-xl font-bold text-black xl:text-2xl">{priceDisplay}</span>
					{onSale && listPrice !== null && (
						<>
							<span className="text-xl font-bold text-black/55 line-through xl:text-2xl">
								{fmt(listPrice)}
							</span>
							<span className="rounded-full bg-[#ff3333]/10 px-3.5 py-1.5 text-[10px] font-medium text-sale xl:text-xs">
								-{discountPercent}%
							</span>
						</>
					)}
				</span>
			)}
		</Link>
	);
}
