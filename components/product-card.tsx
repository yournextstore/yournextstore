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

type Badge = {
	label: string;
	className: string;
};

export async function ProductCard({
	product,
	badge,
	priority = false,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	badge?: Badge;
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

	return (
		<div className="group relative">
			{badge && (
				<span
					className={`absolute top-3 left-3 z-10 inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-[0.14em] uppercase shadow-sm ${badge.className}`}
				>
					{badge.label}
				</span>
			)}
			<IntentLink href={productHref} className="block">
				<div className="relative aspect-square overflow-hidden rounded-sm bg-[color:var(--sand)]">
					<div
						aria-hidden
						className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.55)_0%,transparent_60%)]"
					/>
					{primaryImage &&
						(isVideoUrl(primaryImage) ? (
							<video
								className={`absolute inset-0 w-full h-full object-contain p-6 transition-all duration-700 group-hover:scale-[1.03] ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								className={`object-contain p-6 transition-all duration-700 group-hover:scale-[1.03] ${secondaryImage ? "group-hover:opacity-0" : ""}`}
								priority={priority}
								fetchPriority={priority ? "high" : undefined}
							/>
						))}
					{secondaryImage &&
						(isVideoUrl(secondaryImage) ? (
							<video
								className="absolute inset-0 w-full h-full object-contain p-6 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
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
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								className="object-contain p-6 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
							/>
						))}
				</div>
			</IntentLink>
			<div className="mt-5 flex items-end justify-between gap-4">
				<div className="min-w-0">
					<h2 className="font-serif text-[19px] leading-snug text-foreground truncate">
						<IntentLink href={productHref}>{product.name}</IntentLink>
					</h2>
					<p className="mt-1 flex flex-wrap items-baseline gap-2 text-[15px] font-semibold text-foreground">
						{priceDisplay}
						{compareAtDisplay && (
							<span className="text-sm font-normal text-muted-foreground line-through">
								{compareAtDisplay}
							</span>
						)}
					</p>
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
						aria-label={`View ${product.name}`}
						className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[color:var(--ink)] text-cream hover:bg-[color:var(--oxblood)] transition-colors"
					>
						<svg
							aria-hidden="true"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
							<path d="M3 6h18" />
							<path d="M16 10a4 4 0 0 1-8 0" />
						</svg>
					</IntentLink>
				)}
			</div>
		</div>
	);
}
