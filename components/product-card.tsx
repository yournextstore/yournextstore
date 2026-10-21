import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export async function ProductCard({
	product,
	priority = false,
	headingLevel = "h3",
	showSummary = true,
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	headingLevel?: "h2" | "h3";
	showSummary?: boolean;
	className?: string;
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

	const summary = "summary" in product && typeof product.summary === "string" ? product.summary.trim() : "";
	const href = `/product/${product.slug}${variantSearch}`;
	const Title = headingLevel;

	// The original's "Featured Delight" card: 4:3 photograph, then on desktop a sand card with a
	// hairline frame; burgundy Merriweather title over grey Roboto copy. The title link stretches
	// over the whole card, so the quick-add button stays a sibling, never nested in the link.
	return (
		<article
			className={cn(
				"group relative flex h-full flex-col gap-5 lg:gap-0 lg:rounded-md lg:bg-surface lg:shadow-soft",
				className,
			)}
		>
			<div className="relative aspect-video overflow-hidden rounded-md bg-surface shadow-soft lg:aspect-[4/3] lg:rounded-b-none lg:shadow-none">
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
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
							className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
			</div>
			<div className="flex flex-1 flex-col gap-3 lg:rounded-b-md lg:border-x lg:border-b lg:border-line-soft lg:p-8">
				<Title className="font-serif text-heading-xl font-bold text-brand">
					<Link
						href={href}
						className="rounded-sm after:absolute after:inset-0 after:rounded-md hover:text-brand-hover focus-visible:outline-none focus-visible:after:ring-3 focus-visible:after:ring-brand-hover"
					>
						{product.name}
					</Link>
				</Title>
				{summary && showSummary ? (
					<p className="line-clamp-3 font-sans text-body-md text-muted-foreground">{summary}</p>
				) : null}
				<div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
					<p className="font-serif text-heading-xl text-foreground tabular-nums">{priceDisplay}</p>
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
					) : null}
				</div>
			</div>
		</article>
	);
}
