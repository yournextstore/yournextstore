import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { Chip } from "@/components/deckle";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 1024px) 50vw, 25vw",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `From ${formatMoney({ amount: minPrice, currency, locale })}`
			: minPrice
				? formatMoney({ amount: minPrice, currency, locale })
				: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages.find((image) => !isVideoUrl(image)) ?? allImages[0];

	const category = "category" in product && product.category ? product.category.name : null;
	const onSale =
		variants?.some(
			(v) => "originalPrice" in v && v.originalPrice && BigInt(v.originalPrice) > BigInt(v.price),
		) ?? false;
	const options = variants && variants.length > 1 ? `${variants.length} options` : null;

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

	// A print in a grid, on its own small stage. The image is decorative: the name beside it names the link.
	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className="group relative grid content-start gap-0.5"
		>
			<span className="relative mb-3 block aspect-[4/5] overflow-hidden rounded-frame bg-stage">
				{primaryImage && (
					<span className="absolute inset-6 block transition-[scale] duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.03] lg:inset-8">
						{isVideoUrl(primaryImage) ? (
							<video
								className="absolute inset-0 size-full object-cover"
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
								className="object-cover"
								priority={priority}
							/>
						)}
					</span>
				)}
			</span>
			<span className="font-semibold text-balance">{product.name}</span>
			{category && <span className="text-sm text-muted-foreground">{category}</span>}
			{priceDisplay && (
				<span className="mt-1 flex flex-wrap items-center gap-2 text-[0.9375rem] font-semibold">
					{priceDisplay}
					{onSale && <Chip tone="soft">On sale</Chip>}
					{!onSale && options && <Chip tone="soft">{options}</Chip>}
				</span>
			)}
		</Link>
	);
}
