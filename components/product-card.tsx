import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/** The merchant's card badge ("New", "Bestseller"), when one is set. */
function badgeText(badge: unknown): string {
	if (badge && typeof badge === "object" && "content" in badge && typeof badge.content === "string") {
		return badge.content.trim();
	}
	return "";
}

/**
 * The original's product card: a rounded tile (white on grey sections, grey on white ones) with an
 * inset square photograph, a small label pill, the name and the price.
 */
export async function ProductCard({
	product,
	priority = false,
	tone = "white",
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	tone?: "white" | "grey";
	className?: string;
}) {
	const [{ currency, locale, taxBehavior }, me] = await Promise.all([
		getStoreConfig(),
		meGetCached().catch(() => null),
	]);
	const badge = badgeText("badge" in product ? product.badge : null);
	const category = "category" in product && product.category ? product.category.name : null;
	const label = badge || category || me?.store.name || null;
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

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className={cn(
				"group flex min-w-0 flex-col gap-4 rounded-2xl px-2.5 pt-2.5 pb-4 transition-shadow hover:shadow-[0_6px_24px_-12px_rgb(40_33_35/0.35)] sm:px-3 sm:pt-3 sm:pb-5",
				tone === "white" ? "bg-card" : "bg-background",
				className,
			)}
		>
			<div className="relative aspect-square overflow-hidden rounded-xl bg-subtle-2">
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
							className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							sizes="(max-width: 768px) 50vw, (max-width: 1440px) 25vw, 340px"
							className={`object-cover transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							priority={priority}
						/>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							src={secondaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<YNSMedia
							src={secondaryImage}
							alt={`${product.name} - alternate view`}
							fill
							sizes="(max-width: 768px) 50vw, (max-width: 1440px) 25vw, 340px"
							className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					))}
			</div>
			<div className="flex flex-col items-start gap-1.5 px-0.5">
				{label && (
					<span className="max-w-full truncate rounded-full bg-subtle-2 px-2 py-0.5 text-[10px] font-medium leading-4 text-secondary-foreground">
						{label}
					</span>
				)}
				<p className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground sm:text-sm">
					{product.name}
				</p>
				<p className="text-[13px] font-bold text-foreground sm:text-sm">{priceDisplay}</p>
			</div>
		</Link>
	);
}
