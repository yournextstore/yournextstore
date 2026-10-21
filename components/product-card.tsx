import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export type ProductCardProduct = BrowseProduct | CollectionProduct | FullProduct;

export async function ProductCard({
	product,
	priority = false,
	headingLevel = "h2",
}: {
	product: ProductCardProduct;
	priority?: boolean;
	/** Keeps the outline correct: h2 under a page h1, h3 under a section h2. */
	headingLevel?: "h2" | "h3";
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

	const image = [...(product.images ?? []), ...(variants?.flatMap((v) => v.images ?? []) ?? [])][0];
	const soldOut = Boolean(variants && variants.length > 0 && variants.every((v) => v.stock === 0));

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

	const Heading = headingLevel;
	const imageClass = cn(
		"object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]",
		soldOut && "opacity-60",
	);

	return (
		<Link href={`/product/${product.slug}${variantSearch}`} className="group relative block">
			<div className="relative aspect-square overflow-hidden rounded-md bg-card">
				{image &&
					(isVideoUrl(image) ? (
						<video
							className={cn("absolute inset-0 h-full w-full", imageClass)}
							src={image}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						// Empty alt: the product name is the link text right below.
						<YNSMedia
							src={image}
							alt=""
							fill
							sizes="(max-width: 1024px) 50vw, 360px"
							className={imageClass}
							priority={priority}
						/>
					))}
				{soldOut && (
					<span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-0.5 text-xs uppercase tracking-widest text-muted-foreground ring-1 ring-line">
						Sold out
					</span>
				)}
			</div>
			<Heading className="mt-4 text-sm font-medium tracking-tight text-foreground">{product.name}</Heading>
			{priceDisplay && <p className="mt-1 text-sm tabular-nums text-muted-foreground">{priceDisplay}</p>}
		</Link>
	);
}
