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
import { Button } from "./ui/button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export async function ProductCard({
	product,
	priority = false,
	actions = false,
	sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	/** "Quick View" + "Add to Cart" row under the card, as on the original's listing pages. */
	actions?: boolean;
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
	const soldOut = variants !== null && variants.length > 0 && variants.every((v) => v.stock === 0);

	return (
		<div className="group">
			<Link
				href={href}
				tabIndex={-1}
				aria-hidden
				className="relative block h-48 w-full overflow-hidden bg-secondary"
			>
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
							className={`object-cover transition-opacity duration-500 ${secondaryImage && !isVideoUrl(secondaryImage) ? "group-hover:opacity-0" : ""}`}
							priority={priority}
						/>
					))}
				{secondaryImage && !isVideoUrl(secondaryImage) && (
					<YNSMedia
						src={secondaryImage}
						alt=""
						fill
						sizes={sizes}
						className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					/>
				)}
			</Link>
			<Link href={href} className="block">
				<span className="mt-2 line-clamp-1 w-full leading-7">{product.name}</span>
				<span className="block leading-7">{priceDisplay}</span>
			</Link>
			{actions && (
				<div className="mt-4 mb-8 flex flex-col items-center justify-between gap-2 sm:flex-row">
					<Button asChild variant="outline" size="sm" className="h-9 w-full sm:flex-1">
						<Link href={href} aria-label={`Quick View, ${product.name}`}>
							Quick View
						</Link>
					</Button>
					<div className="w-full sm:flex-1">
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
							/>
						) : soldOut ? (
							<Button variant="secondary" size="sm" disabled className="h-9 w-full">
								Sold Out
							</Button>
						) : (
							<Button asChild size="sm" className="h-9 w-full">
								<Link href={href} aria-label={`Choose options, ${product.name}`}>
									Choose options
								</Link>
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
