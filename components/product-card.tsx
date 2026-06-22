import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";
import { YnsLink } from "./yns-link";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export function ProductCard({
	product,
	priority = false,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
}) {
	const variants = "variants" in product ? product.variants : null;
	const firstVariantPrice = variants?.[0] ? BigInt(variants[0].price) : null;
	const { minPrice, maxPrice } =
		variants && firstVariantPrice !== null
			? variants.reduce(
					(acc, v) => {
						const price = BigInt(v.price);
						return {
							minPrice: price < acc.minPrice ? price : acc.minPrice,
							maxPrice: price > acc.maxPrice ? price : acc.maxPrice,
						};
					},
					{ minPrice: firstVariantPrice, maxPrice: firstVariantPrice },
				)
			: { minPrice: null, maxPrice: null };

	const isRange = variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice;
	const priceDisplay = isRange
		? `${formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })} – ${formatMoney({ amount: maxPrice, currency: CURRENCY, locale: LOCALE })}`
		: minPrice
			? formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })
			: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	const singleVariant = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

	// Sub-label: derive from variant count or product slug suffix
	const subLabel = variants && variants.length > 1 ? `${variants.length} options` : "Fresh today";

	return (
		<div className="group flex flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-soft ring-1 ring-[var(--border)] transition hover:-translate-y-0.5 hover:shadow-card">
			<YnsLink prefetch={"eager"} href={`/product/${product.slug}`} className="block">
				<div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--secondary)]">
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
								alt={product.name}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
								className={`object-cover transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
								priority={priority}
							/>
						))}
					{secondaryImage &&
						(isVideoUrl(secondaryImage) ? (
							<video
								className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
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
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
								className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							/>
						))}
				</div>
			</YnsLink>

			<div className="flex flex-1 flex-col px-1 pt-3">
				<YnsLink prefetch={"eager"} href={`/product/${product.slug}`} className="block">
					<h3 className="line-clamp-1 font-display text-sm font-semibold text-[var(--brand-deep)]">
						{product.name}
					</h3>
					<p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--muted-foreground)]">{subLabel}</p>
				</YnsLink>

				<div className="mt-3 flex items-end justify-between">
					<div className="flex items-baseline gap-1">
						<span className="font-display text-lg font-extrabold leading-none text-[var(--brand-deep)]">
							{priceDisplay ?? "—"}
						</span>
					</div>
					{singleVariant ? (
						<QuickAddButton
							variantId={singleVariant.id}
							variantPrice={singleVariant.price}
							variantImages={singleVariant.images}
							product={{
								id: product.id,
								name: product.name,
								slug: product.slug,
								images: product.images ?? [],
							}}
						/>
					) : (
						<YnsLink
							prefetch={"eager"}
							href={`/product/${product.slug}`}
							aria-label={`Choose options for ${product.name}`}
							className="grid h-9 w-9 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-deep)] transition hover:bg-[var(--brand)] hover:text-white"
						>
							<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
							</svg>
						</YnsLink>
					)}
				</div>
			</div>
		</div>
	);
}
