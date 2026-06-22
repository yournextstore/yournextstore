import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { IntentLink } from "@/components/intent-link";
import { blurPreview } from "@/lib/blur-placeholder";
import { formatMoney } from "@/lib/money";
import { listingPrice } from "@/lib/pricing";
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
	const variants = "variants" in product ? product.variants : null;
	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];
	const [{ currency, locale, taxBehavior }, preview] = await Promise.all([
		getStoreConfig(),
		blurPreview(primaryImage),
	]);
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing
		? `${listing.from ? "From " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
		: null;
	const compareAtDisplay = listing?.compareAt
		? formatMoney({ amount: listing.compareAt, currency, locale })
		: null;

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant =
		oneTimeAllowed && variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

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
	const productHref = `/product/${product.slug}${variantSearch}`;

	// Sub-label: derive from variant count or product slug suffix
	const subLabel = variants && variants.length > 1 ? `${variants.length} options` : "Fresh today";

	return (
		<div className="group flex flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-soft ring-1 ring-[var(--border)] transition hover:-translate-y-0.5 hover:shadow-card">
			<IntentLink href={productHref} className="block">
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
								preview={preview}
								alt={product.name}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
								className={`object-cover transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
								priority={priority}
								fetchPriority={priority ? "high" : undefined}
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
			</IntentLink>

			<div className="flex flex-1 flex-col px-1 pt-3">
				<IntentLink href={productHref} className="block">
					<h2 className="line-clamp-1 font-display text-sm font-semibold text-[var(--brand-deep)]">
						{product.name}
					</h2>
					<p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--muted-foreground)]">{subLabel}</p>
				</IntentLink>

				<div className="mt-3 flex items-end justify-between">
					<div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
						<span className="font-display text-lg font-extrabold leading-none text-[var(--brand-deep)]">
							{priceDisplay ?? "—"}
						</span>
						{compareAtDisplay && (
							<span className="text-xs text-[var(--muted-foreground)] line-through">{compareAtDisplay}</span>
						)}
					</div>
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
						<IntentLink
							href={productHref}
							aria-label={`Choose options for ${product.name}`}
							className="grid h-9 w-9 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-deep)] transition hover:bg-[var(--brand)] hover:text-white"
						>
							<svg
								viewBox="0 0 24 24"
								className="h-4 w-4"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								aria-hidden="true"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
							</svg>
						</IntentLink>
					)}
				</div>
			</div>
		</div>
	);
}
