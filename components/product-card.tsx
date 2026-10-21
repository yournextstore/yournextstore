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

	// One price, one strike-through: the original's red sale price beside the struck list price.
	const listPrice = (() => {
		if (variants?.length !== 1 || !minPrice) return null;
		const only = variants[0];
		if (!only || !("originalPrice" in only)) return null;
		const original = displayPrice(only, taxBehavior, "originalPrice");
		return original && BigInt(original) > BigInt(minPrice)
			? formatMoney({ amount: BigInt(original), currency, locale })
			: null;
	})();

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
		<Link href={`/product/${product.slug}${variantSearch}`} className="group flex flex-col items-center">
			<div className="relative mb-5 aspect-square w-full overflow-hidden bg-tile sm:mb-6">
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 h-full w-full object-cover ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							sizes="(max-width: 1024px) 50vw, 25vw"
							className={`object-cover ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							priority={priority}
						/>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100"
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
							sizes="(max-width: 1024px) 50vw, 25vw"
							className="object-cover opacity-0 group-hover:opacity-100"
						/>
					))}
			</div>
			<div className="flex flex-col gap-1 text-center leading-tight">
				<span className="group-hover:underline underline-offset-4">{product.name}</span>
				{priceDisplay && (
					<span className="flex flex-wrap justify-center gap-x-3">
						{listPrice ? (
							<>
								<span className="text-sale">{priceDisplay}</span>
								<span className="text-muted-foreground line-through">{listPrice}</span>
							</>
						) : (
							<span>{priceDisplay}</span>
						)}
					</span>
				)}
			</div>
		</Link>
	);
}
