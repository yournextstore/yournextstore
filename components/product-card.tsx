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
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/**
 * The original shows its merch as cut-outs floating on a flat field. Here the store's photograph
 * stands on the field as a 2:3 print: on the paper grey in listings, on a saturated colour block
 * (`color`) in the home grid. Hover reveals the quick-add bar, as in the original.
 */
export async function ProductCard({
	product,
	priority = false,
	color,
	sizes = "(max-width: 1024px) 50vw, 25vw",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	color?: string;
	sizes?: string;
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

	const href = `/product/${product.slug}${variantSearch}`;
	const block = Boolean(color);

	return (
		<div
			className={cn(
				"group relative overflow-hidden",
				block ? "aspect-square" : "aspect-[4/5]",
				color ?? "bg-swag-paper",
			)}
		>
			<Link href={href} className="absolute inset-0 block">
				<span
					className={cn(
						"absolute left-1/2 aspect-[2/3] -translate-x-1/2 overflow-hidden",
						block ? "top-[10%] h-[80%]" : "top-[6%] h-[78%]",
					)}
				>
					{primaryImage &&
						(isVideoUrl(primaryImage) ? (
							<video
								className="h-full w-full object-cover"
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
								className={cn(
									"object-cover transition-opacity duration-500",
									secondaryImage && "lg:group-hover:opacity-0",
								)}
								priority={priority}
							/>
						))}
					{secondaryImage && !isVideoUrl(secondaryImage) && (
						<YNSMedia
							src={secondaryImage}
							alt=""
							fill
							sizes={sizes}
							className="hidden object-cover opacity-0 transition-opacity duration-500 lg:block lg:group-hover:opacity-100"
						/>
					)}
				</span>
				{block ? (
					<span className="absolute top-0 left-0 flex max-w-[90%] gap-2 bg-black px-1 text-t14 text-white uppercase">
						<span className="truncate">{product.name}</span>
						{priceDisplay && <span className="shrink-0 tabular-nums">{priceDisplay}</span>}
					</span>
				) : (
					<span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-2 pb-2 text-t11 uppercase sm:text-t14">
						<span className="line-clamp-1">{product.name}</span>
						{priceDisplay && <span className="shrink-0 tabular-nums">{priceDisplay}</span>}
					</span>
				)}
			</Link>
			<div className="absolute inset-x-0 bottom-0 z-10 hidden justify-center p-2 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 lg:flex lg:group-hover:opacity-100">
				{singleVariant ? (
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
						className="w-full"
					/>
				) : (
					<Link
						href={href}
						tabIndex={-1}
						className="flex h-10 w-full items-center justify-center bg-black font-sans text-t16 text-white hover:text-swag-yellow"
					>
						Choose options
					</Link>
				)}
			</div>
		</div>
	);
}
