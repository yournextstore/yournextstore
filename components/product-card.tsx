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
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/**
 * The original's product tile: a square photograph over a faint slate gradient panel with the
 * name, a muted category line, the variant count and a "From" price pinned to the bottom.
 */
export async function ProductCard({
	product,
	priority = false,
	headingLevel = "h3",
	className,
	sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 340px",
}: {
	product: CardProduct;
	priority?: boolean;
	headingLevel?: "h2" | "h3";
	className?: string;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null };
	const variantCount = variants?.length ?? 0;
	const category = "category" in product && product.category ? product.category.name : null;

	const image = [...(product.images ?? []), ...(variants?.flatMap((v) => v.images ?? []) ?? [])][0];

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

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className={cn("group flex h-full w-full flex-col overflow-hidden rounded-lg", className)}
		>
			<div className="relative aspect-square overflow-hidden bg-secondary">
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
							priority={priority}
							className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
						/>
					))}
			</div>
			<div className="flex shrink-0 grow flex-col bg-linear-to-b from-transparent to-primary/5 p-4 text-pretty">
				<Heading className="line-clamp-2 text-base font-semibold text-foreground md:text-lg">
					{product.name}
				</Heading>
				{category && <p className="pt-1 text-sm text-muted-foreground">{category}</p>}
				{minPrice !== null && (
					<div className="mt-auto flex flex-col pt-10">
						{variantCount > 0 && (
							<p className="text-sm text-muted-foreground">
								{variantCount} variant{variantCount > 1 ? "s" : ""}
							</p>
						)}
						<div className="flex w-full items-baseline justify-between gap-2 text-sm">
							<span className="text-muted-foreground">From</span>
							<span className="text-base font-semibold text-foreground md:text-lg">
								{formatMoney({ amount: minPrice, currency, locale })}
							</span>
						</div>
					</div>
				)}
			</div>
		</Link>
	);
}
