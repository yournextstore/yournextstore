import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { pad2 } from "@/lib/pad";
import { listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/** A short descriptor under the name: the category, else the first variant values, else the summary. */
function descriptor(product: CardProduct) {
	if ("category" in product && product.category && typeof product.category === "object") {
		return product.category.name;
	}
	const variants = "variants" in product ? product.variants : [];
	if (variants.length > 1) return `${variants.length} options`;
	return product.summary ?? null;
}

export async function ProductCard({
	product,
	priority = false,
	index,
	headingLevel = "h2",
	revealDelay = 0,
	reveal = true,
}: {
	product: CardProduct;
	priority?: boolean;
	/** Position in the list, rendered as a mono reference number. */
	index?: number;
	/** Keeps a valid outline: h2 under a page h1, h3 under a section h2. */
	headingLevel?: "h2" | "h3";
	revealDelay?: number;
	/** Off for cards in the first viewport, so the largest paint never waits on hydration. */
	reveal?: boolean;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	// A free set (price 0) shows no price rather than "$0.00".
	const priceDisplay =
		listing && (listing.from || listing.amount > 0n)
			? `${listing.from ? "From " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
			: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

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

	const Heading = headingLevel;
	const sub = descriptor(product);

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className="group block"
			data-reveal={reveal ? "" : undefined}
			style={
				reveal && revealDelay ? ({ "--reveal-delay": `${revealDelay}ms` } as React.CSSProperties) : undefined
			}
		>
			<div className="relative aspect-[4/5] overflow-hidden bg-surface">
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
							sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className={`object-cover transition-[transform,opacity] duration-[1100ms] ease-out group-hover:scale-[1.04] ${secondaryImage && !isVideoUrl(secondaryImage) ? "group-hover:opacity-0" : ""}`}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
				{secondaryImage && !isVideoUrl(secondaryImage) && (
					<YNSMedia
						src={secondaryImage}
						alt=""
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
						className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
					/>
				)}
			</div>

			<div className="card-meta mt-4 flex items-baseline justify-between gap-4 pt-3">
				<div className="flex min-w-0 items-baseline gap-3">
					{index !== undefined && (
						<span className="mono shrink-0 text-[0.6875rem] text-muted-foreground">{pad2(index + 1)}</span>
					)}
					<div className="min-w-0">
						<Heading className="truncate text-[0.9375rem] font-medium tracking-[-0.015em]">
							{product.name}
						</Heading>
						{sub && <p className="mt-1 truncate text-[0.8125rem] text-muted-foreground">{sub}</p>}
					</div>
				</div>
				{priceDisplay && <span className="mono shrink-0 text-[0.8125rem]">{priceDisplay}</span>}
			</div>
		</Link>
	);
}
