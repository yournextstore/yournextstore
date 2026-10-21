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

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export async function ProductCard({
	product,
	priority = false,
	headingLevel = "h3",
	sizes = "(max-width: 768px) 50vw, 25vw",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	/** h2 where the card sits directly under the page's h1 (listing grids), h3 under a section h2. */
	headingLevel?: "h2" | "h3";
	sizes?: string;
}) {
	const HeadingTag = headingLevel;
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
	const summary = "summary" in product && typeof product.summary === "string" ? product.summary : null;
	const soldOut = variants !== null && variants.length > 0 && variants.every((v) => v.stock === 0);

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

	// The original's card: a 4:5 photograph, name, a grey line of description and the price
	// standing on a black rule.
	return (
		<Link href={`/product/${product.slug}${variantSearch}`} className="group mb-12 block">
			<div className="relative mb-4 aspect-[4/5] overflow-hidden bg-tint">
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
							className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
							priority={priority}
						/>
					))}
				{soldOut && (
					<div className="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center text-caption text-white">
						SOLD OUT
					</div>
				)}
			</div>
			<HeadingTag className="mb-2 text-subheader leading-6 font-medium">{product.name}</HeadingTag>
			{summary && <p className="mb-2 line-clamp-3 text-ink-soft">{summary}</p>}
			<p className="border-b border-black pb-2 text-subheader leading-6 font-medium">{priceDisplay}</p>
		</Link>
	);
}
