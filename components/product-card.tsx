import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { FamilyDot } from "@/components/brand/family-dot";
import { ArrowRightIcon } from "@/components/icons";
import { getCategoryTones } from "@/lib/catalog";
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
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing
		? `${listing.from ? "From " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
		: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

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

	const tone =
		"category" in product && product.category ? (await getCategoryTones())[product.category.id] : undefined;
	const soldOut = variants !== null && variants.length > 0 && variants.every((v) => v.stock === 0);

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-line transition-colors hover:border-gold/60"
		>
			<div className="relative aspect-[4/5] overflow-hidden bg-surface">
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
							sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
							className={`object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.03] ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
							alt=""
							fill
							sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
							className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
						/>
					))}
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-gradient-to-t from-page/85 via-transparent to-transparent"
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
			</div>
			<div className="flex flex-1 items-end justify-between gap-4 p-5">
				<div className="min-w-0">
					<div className="flex items-baseline gap-2">
						{tone !== undefined && <FamilyDot index={tone} className="relative -top-0.5" />}
						<h2 className="font-display text-xl leading-tight">{product.name}</h2>
					</div>
					<p className="mt-1 text-sm text-ink/75">{soldOut ? "Sold out" : priceDisplay}</p>
				</div>
				<ArrowRightIcon
					width={16}
					height={16}
					className="mb-1 shrink-0 text-gold transition-transform group-hover:translate-x-1"
				/>
			</div>
		</Link>
	);
}
