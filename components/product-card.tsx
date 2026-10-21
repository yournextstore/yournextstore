import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

type Combination = {
	variantValue: { value: string; colorValue: string | null; variantType: { type: string } };
};

export async function ProductCard({
	product,
	priority = false,
	headingLevel = "h3",
	sizes = "(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	headingLevel?: "h2" | "h3";
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing ? `${listing.from ? "from " : ""}${fmt(listing.amount)}` : null;

	// A struck-through list price and a percentage badge, only when every variant agrees on one.
	const first = variants?.length === 1 ? variants[0] : null;
	const listPrice = first ? displayPrice(first, taxBehavior, "originalPrice") : null;
	const salePrice = first ? BigInt(displayPrice(first, taxBehavior)) : null;
	const compareAt =
		listPrice && salePrice !== null && BigInt(listPrice) > salePrice ? BigInt(listPrice) : null;
	const discount =
		compareAt && salePrice !== null
			? Math.round((Number(compareAt - salePrice) / Number(compareAt)) * 100)
			: null;

	const colors = [
		...new Map(
			(variants ?? [])
				.flatMap((variant) => ("combinations" in variant ? (variant.combinations as Combination[]) : []))
				.filter((c) => c.variantValue.variantType.type === "color" && c.variantValue.colorValue)
				.map((c) => [c.variantValue.value, c.variantValue.colorValue ?? ""] as const),
		).values(),
	];

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const variantSearch = (() => {
		if (!first || !("combinations" in first) || first.combinations.length === 0) {
			return "";
		}
		const params = new URLSearchParams();
		for (const combination of first.combinations) {
			params.set(combination.variantValue.variantType.label, combination.variantValue.value);
		}
		return `?${params.toString()}`;
	})();

	const Heading = headingLevel;

	return (
		<Link href={`/product/${product.slug}${variantSearch}`} className="group block">
			<div className="relative aspect-[4/5] overflow-hidden bg-muted">
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
							sizes={sizes}
							className={`object-cover transition duration-700 ease-out motion-safe:md:group-hover:scale-[1.04] ${secondaryImage && !isVideoUrl(secondaryImage) ? "md:group-hover:opacity-0" : ""}`}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
				{secondaryImage && !isVideoUrl(secondaryImage) && (
					<YNSMedia
						src={secondaryImage}
						alt=""
						fill
						sizes={sizes}
						className="hidden object-cover opacity-0 transition duration-700 ease-out md:block md:group-hover:scale-[1.04] md:group-hover:opacity-100"
					/>
				)}
				{discount ? (
					<span className="absolute left-3 top-3 bg-sale px-2.5 py-1.5 text-[9px] font-medium tracking-[0.08em] text-sale-foreground">
						−{discount}%
					</span>
				) : null}
				<span
					className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/95 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
					aria-hidden="true"
				>
					<ArrowUpRight size={17} strokeWidth={1.25} aria-hidden="true" />
				</span>
			</div>
			<div className="mt-4 flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
				<Heading className="min-w-0 text-xs font-medium leading-5 wrap-break-word sm:text-sm">
					{product.name}
				</Heading>
				{priceDisplay && (
					<p className="flex flex-wrap items-center gap-2 text-xs leading-5 sm:text-sm">
						<span>{priceDisplay}</span>
						{compareAt ? <s className="text-muted-foreground">{fmt(compareAt)}</s> : null}
					</p>
				)}
			</div>
			{colors.length > 0 && (
				<div className="mt-2.5 flex items-center gap-1.5" aria-hidden="true">
					{colors.slice(0, 6).map((color) => (
						<span
							key={color}
							className="h-2.5 w-2.5 rounded-full border border-foreground/20"
							style={{ backgroundColor: color }}
						/>
					))}
					<span className="ml-1 text-[10px] text-muted-foreground">
						{colors.length} {colors.length === 1 ? "colour" : "colours"}
					</span>
				</div>
			)}
		</Link>
	);
}
