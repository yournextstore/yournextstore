import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { sentenceCase } from "@/lib/display";
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

	const href = `/product/${product.slug}${variantSearch}`;
	const secondaryLabel = variants && variants.length > 1 ? "Choose options" : "Learn more";
	const category = "category" in product && product.category ? sentenceCase(product.category.name) : null;

	// The original's card: photo, large serif name, taupe category, bold price, then a filled
	// "View product" and a white second button (here a working quick add when one click can buy).
	return (
		<div className="flex flex-col gap-2">
			<Link
				href={href}
				tabIndex={-1}
				aria-hidden="true"
				className="group relative block aspect-[3/4] w-full overflow-hidden bg-secondary"
			>
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
							alt=""
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className={`object-cover transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							priority={priority}
						/>
					))}
				{secondaryImage && !isVideoUrl(secondaryImage) && (
					<YNSMedia
						src={secondaryImage}
						alt=""
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					/>
				)}
			</Link>
			<Link
				href={href}
				className="mt-1 line-clamp-2 text-center text-2xl leading-snug tracking-[1.02px] text-black hover:underline max-md:text-xl"
			>
				{product.name}
			</Link>
			{category && (
				<p className="text-center text-base tracking-wide text-taupe-ink max-md:text-sm">{category}</p>
			)}
			{priceDisplay && <p className="text-center text-xl font-bold max-md:text-lg">{priceDisplay}</p>}
			<div className="mt-auto flex w-full flex-col gap-1 pt-1">
				<Link href={href} className="btn-taupe" aria-label={`View product, ${product.name}`}>
					View product
				</Link>
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
				) : (
					<Link href={href} className="btn-white" aria-label={`${secondaryLabel}, ${product.name}`}>
						{secondaryLabel}
					</Link>
				)}
			</div>
		</div>
	);
}
