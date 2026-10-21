import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { displayName } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";
import { SplitPrice } from "./split-price";

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

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant =
		oneTimeAllowed && variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;
	const outOfStock = variants?.length === 1 && variants[0]?.stock === 0;

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
	const name = displayName(product.name);

	return (
		<article className="group relative flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
			<Link
				href={href}
				tabIndex={-1}
				aria-hidden="true"
				className="relative block aspect-square overflow-hidden bg-muted"
			>
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
							className="object-cover transition-transform duration-500 group-hover:scale-105"
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
				<span className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10" />
			</Link>
			<div className="flex flex-1 flex-col p-4">
				<h2 className="mb-2 line-clamp-1 font-display text-lg font-semibold text-foreground">
					<Link href={href} className="after:absolute after:inset-0 after:content-['']">
						{name}
					</Link>
				</h2>
				<div className="mt-auto flex items-center justify-between gap-3">
					<span className="text-xs tracking-wide text-muted-foreground">
						{variants && variants.length > 1
							? `${variants.length} options`
							: outOfStock
								? "Sold out"
								: "In stock"}
					</span>
					{priceDisplay && <SplitPrice value={priceDisplay} className="text-lg" />}
				</div>
			</div>
			{singleVariant ? (
				<div className="relative z-10 px-4 pb-4">
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
				</div>
			) : variants && (variants.length > 1 || (!oneTimeAllowed && !outOfStock)) ? (
				<div className="relative z-10 px-4 pb-4">
					<Link
						href={href}
						className="flex h-9 w-full items-center justify-center rounded-md border border-accent text-sm font-medium text-foreground transition-colors hover:bg-accent/20"
					>
						{oneTimeAllowed ? "Choose options" : "Choose a plan"}
					</Link>
				</div>
			) : null}
		</article>
	);
}
