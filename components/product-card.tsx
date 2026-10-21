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
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

const NEW_FOR_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** A product tile in the original's shape: a cream frame with badges and a hover "Add to cart" bar, name and price centred below. */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
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
			? `${formatMoney({ amount: minPrice, currency, locale })} – ${formatMoney({ amount: maxPrice, currency, locale })}`
			: minPrice
				? formatMoney({ amount: minPrice, currency, locale })
				: null;

	// Sale: the single variant's list price above its price (the original's "-24%" badge and struck price).
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior, "originalPrice") : null;
	const salePrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior) : null;
	const onSale = listPrice && salePrice && BigInt(listPrice) > BigInt(salePrice);
	const discount = onSale ? Math.round((1 - Number(salePrice) / Number(listPrice)) * 100) : null;
	// `createdAt` comes from the API; the card is cached per product, which pins `Date.now()` to the entry.
	const isNew =
		"createdAt" in product &&
		typeof product.createdAt === "string" &&
		Date.now() - new Date(product.createdAt).getTime() < NEW_FOR_DAYS * MS_PER_DAY;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	const singleVariant = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
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

	// Colour dots under the frame, from the variants' colour values (the original's swatch row).
	const swatches =
		variants?.flatMap((variant) =>
			"combinations" in variant
				? variant.combinations
						.map((c) => c.variantValue)
						.filter((value) => value.variantType.type === "color" && value.colorValue)
				: [],
		) ?? [];
	const uniqueSwatches = [...new Map(swatches.map((value) => [value.id, value])).values()].slice(0, 5);

	return (
		<div className="group relative flex flex-col text-center">
			<div className="relative overflow-hidden rounded-form bg-card">
				<Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[7/8]">
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
								className={`object-cover transition-[transform,opacity] duration-500 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
				{(isNew || discount) && (
					<div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1">
						{isNew && (
							<span className="rounded-pill bg-badge-new px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
								New
							</span>
						)}
						{discount ? (
							<span className="rounded-pill bg-badge-hot px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
								-{discount}%
							</span>
						) : null}
					</div>
				)}
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
			</div>
			{uniqueSwatches.length > 0 && (
				<div className="mt-3 flex justify-center gap-1.5">
					{uniqueSwatches.map((value) => (
						<span
							key={value.id}
							title={value.value}
							className="size-3.5 rounded-full ring-1 ring-line"
							style={{ background: value.colorValue ?? undefined }}
						/>
					))}
				</div>
			)}
			<Link
				href={href}
				className="mt-3 font-heading text-[17px] leading-snug text-link transition-colors hover:text-pine"
			>
				{product.name}
			</Link>
			<p className="mt-1 text-[15px] font-semibold">
				{onSale && listPrice ? (
					<span className="mr-2 font-normal text-muted-foreground line-through">
						{formatMoney({ amount: listPrice, currency, locale })}
					</span>
				) : null}
				<span className="text-pine">{priceDisplay}</span>
			</p>
		</div>
	);
}
