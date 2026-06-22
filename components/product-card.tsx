import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { HeartIcon } from "lucide-react";
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

	const subtitle = product.name;

	return (
		<IntentLink href={`/product/${product.slug}${variantSearch}`} className="group block">
			{/* Image area with rounded corners, light gradient background, and name pill */}
			<div className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden bg-gradient-to-br from-[#f3eee9] via-[#f7f3ee] to-[#efe9e2] ring-1 ring-black/5">
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 w-full h-full object-contain p-3 sm:p-4 transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							className={`object-cover transition-transform duration-500 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
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
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					))}

				{/* Lime green name pill (top-left) */}
				<div className="absolute left-3 right-12 bottom-3 z-10 pointer-events-none">
					<div className="inline-flex max-w-full items-center rounded-full bg-[#d9f560] pl-3.5 pr-3 py-1.5 shadow-sm">
						<span className="truncate text-[11px] sm:text-xs font-semibold text-[#0f0f0f] leading-tight">
							{subtitle}
						</span>
					</div>
				</div>

				{/* Quick add button (bottom-right, styled +) */}
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

			{/* Card footer with name, heart, price + Card button. The heart is a plain mark, not a
			    button: a control inside the card's link is invalid nesting, and there is no wishlist yet. */}
			<div className="mt-3 rounded-[1.5rem] bg-white ring-1 ring-black/5 px-4 py-3.5 shadow-[0_4px_18px_-12px_rgba(15,15,15,0.15)]">
				<div className="flex items-start justify-between gap-3">
					<h2 className="text-[15px] font-semibold text-[#0f0f0f] leading-tight tracking-tight line-clamp-2">
						{product.name}
					</h2>
					<span
						aria-hidden="true"
						className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-500"
					>
						<HeartIcon className="h-4 w-4" />
					</span>
				</div>
				<div className="mt-3 flex items-center justify-between gap-3">
					<p className="flex flex-wrap items-baseline gap-2 text-lg font-display text-[#0f0f0f]">
						<span>{priceDisplay}</span>
						{compareAtDisplay && (
							<span className="font-sans text-sm text-neutral-500 line-through">{compareAtDisplay}</span>
						)}
					</p>
					<span className="inline-flex items-center justify-center rounded-full bg-[#0f0f0f] px-4 py-1.5 text-xs font-medium text-white group-hover:bg-[#ff6b35] transition-colors">
						Card
					</span>
				</div>
			</div>
		</IntentLink>
	);
}
