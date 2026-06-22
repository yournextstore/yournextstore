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
	const priceDisplay = listing ? formatMoney({ amount: listing.amount, currency, locale }) : null;
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
			<div
				className="relative aspect-[4/5] overflow-hidden rounded-sm mb-5"
				style={{
					background: "radial-gradient(ellipse 80% 60% at 50% 60%, #efe7d7 0%, #e5dccb 60%, #ddd1bd 100%)",
				}}
			>
				{/* subtle ground shadow */}
				<div
					aria-hidden
					className="absolute inset-x-[10%] bottom-[8%] h-[6%] rounded-full"
					style={{ background: "radial-gradient(ellipse at center, rgba(26,26,26,0.18), transparent 70%)" }}
				/>
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
							preview={preview}
							alt={product.name}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className={`object-contain p-8 transition-all duration-700 group-hover:scale-[1.04] ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							className="object-contain p-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					))}
				{/* hover tag */}
				<div className="absolute bottom-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
					<span
						className="inline-flex items-center gap-1.5 rounded-full bg-ink text-paper px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase"
						style={{ backgroundColor: "#1A1A1A", color: "#F4F1EC" }}
					>
						View object →
					</span>
				</div>
			</div>
			<div className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<div className="text-[10px] tracking-[0.22em] uppercase text-foreground/45">Edition</div>
					<h2 className="display-italic text-xl tracking-[-0.01em] leading-tight">{product.name}</h2>
				</div>
				<div className="text-right shrink-0">
					<div className="text-[10px] tracking-[0.22em] uppercase text-foreground/45">
						{listing?.from ? "From" : "Price"}
					</div>
					<p className="text-sm font-medium text-foreground tabular-nums">
						{priceDisplay}
						{compareAtDisplay && (
							<span className="ml-2 text-foreground/45 line-through">{compareAtDisplay}</span>
						)}
					</p>
				</div>
			</div>
		</IntentLink>
	);
}
