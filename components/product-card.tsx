import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { Tag } from "@/components/munch/tag";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/** The tag the original prints on a card (its product type); here the product's category. */
export function productTag(product: CardProduct): string | null {
	const category = "category" in product ? product.category : null;
	if (!category || typeof category !== "object" || !("name" in category)) return null;
	return typeof category.name === "string" ? (category.name.split(">").at(-1)?.trim() ?? null) : null;
}

/**
 * Munchies product card: a square rounded packshot with the type tag in its top-right corner,
 * then the name and a "from" price centred underneath.
 */
export async function ProductCard({
	product,
	priority = false,
	className,
	sizes = "(max-width: 1024px) 50vw, 33vw",
}: {
	product: CardProduct;
	priority?: boolean;
	className?: string;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const fromPrice = minPrice ? formatMoney({ amount: minPrice, currency, locale }) : null;
	const isRange = Boolean(minPrice && maxPrice && minPrice !== maxPrice);

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const image = allImages.find((url) => !isVideoUrl(url)) ?? allImages[0];
	const tag = productTag(product);

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
			className={cn("group relative flex flex-col items-center rounded-lg", className)}
		>
			<div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#f4ebdb]">
				{image &&
					(isVideoUrl(image) ? (
						<video
							className="absolute inset-0 size-full object-cover"
							src={image}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<YNSMedia
							src={image}
							alt=""
							fill
							sizes={sizes}
							className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
							priority={priority}
						/>
					))}
				{tag && <Tag text={tag} className="absolute top-3 right-4 max-w-[70%]" />}
			</div>
			<div className="flex flex-1 flex-col items-center gap-1 px-lg py-s text-center">
				<span className="text-b-lg leading-[1.5] text-pretty lg:text-b-xl">{product.name}</span>
				{fromPrice && (
					<span className="text-b-sm leading-[1.5] lg:text-b-md">
						{isRange ? "from " : ""}
						{fromPrice}
					</span>
				)}
			</div>
		</Link>
	);
}
