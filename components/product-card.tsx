import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { IntentLink } from "@/components/intent-link";
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
	const { currency, locale, taxBehavior } = await getStoreConfig();
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

	return (
		<IntentLink href={`/product/${product.slug}${variantSearch}`} className="group block">
			<div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-charcoal/10 bg-card transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(58,26,18,0.15)]">
				{/* Decorative corner badge */}
				<div className="absolute top-4 left-4 z-10">
					<span className="tofu-badge px-3 py-1 text-[10px]">12g Protein</span>
				</div>

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
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className={`object-cover transition-all duration-500 ${secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"}`}
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

				{/* Bottom flavor strip */}
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 via-charcoal/50 to-transparent p-4 pt-12">
					<div className="flex items-end justify-between gap-3">
						<div className="min-w-0">
							<p className="font-display text-[10px] uppercase tracking-[0.22em] text-cream/70">
								Savory Protein Snack
							</p>
							<h3 className="mt-1 font-display text-lg sm:text-xl font-extrabold uppercase text-cream leading-tight truncate">
								{product.name}
							</h3>
						</div>
						<ArrowRight className="h-5 w-5 shrink-0 text-cream transition-transform group-hover:translate-x-1" />
					</div>
				</div>
			</div>

			<div className="mt-4 flex items-baseline justify-between px-1">
				<p className="text-sm text-mahogany/80">
					<span className="font-display uppercase tracking-[0.12em] text-charcoal">{product.name}</span>
				</p>
				<p className="flex flex-wrap items-baseline justify-end gap-2">
					<span className="font-display text-lg font-extrabold text-chili">{priceDisplay}</span>
					{compareAtDisplay && (
						<span className="text-sm text-mahogany/60 line-through">{compareAtDisplay}</span>
					)}
				</p>
			</div>
		</IntentLink>
	);
}
