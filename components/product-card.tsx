import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { HoverPhoto } from "@/components/hover-photo";
import { QuickAdd, type QuickAddOption } from "@/components/quick-add";
import { sentenceCase, stills } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

type CardVariant = {
	id: string;
	price: string;
	priceGross?: string | null;
	sku?: string | null;
	images: string[];
	stock: number | null;
	combinations?: { variantValue: { value: string; variantType: { label: string } } }[];
};

/** "jasny beż" → "Jasny beż": an option's values, readable. */
export function variantLabel(variant: Pick<CardVariant, "combinations">) {
	const values = variant.combinations?.map((combination) => combination.variantValue.value) ?? [];
	return values.length > 0 ? sentenceCase(values.join(" / ")) : "One size";
}

/** A single-variant card deep-links to that variant; a bare link would show the product's default. */
function variantSearch(variants: CardVariant[] | null) {
	const only = variants?.length === 1 ? variants[0] : null;
	if (!only?.combinations?.length) return "";
	const params = new URLSearchParams(
		only.combinations.map((combination) => [
			combination.variantValue.variantType.label,
			combination.variantValue.value,
		]),
	);
	return `?${params.toString()}`;
}

/**
 * A product card: a 24px photo tile on the photo ground, name and price below. Pointed at,
 * the piece's worn shot rises over the packshot and a glass quick-add capsule comes up.
 * The tile itself never lifts or casts a shadow.
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 1023px) 50vw, 25vw",
	meta,
	className,
}: {
	product: CardProduct;
	priority?: boolean;
	sizes?: string;
	/** The line under the name; defaults to the product's category. */
	meta?: string | null;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants: CardVariant[] | null = "variants" in product ? (product.variants as CardVariant[]) : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceText = listing
		? `${listing.from ? "from " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
		: null;

	const photos = stills([
		...(product.images ?? []),
		...(variants?.flatMap((variant) => variant.images ?? []) ?? []),
	]);
	// Quick add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const primary = photos[0];
	const next = photos[1];
	const href = `/product/${product.slug}${variantSearch(variants)}`;
	const category = "category" in product && product.category ? sentenceCase(product.category.name) : null;
	const metaLine = meta === undefined ? category : meta;
	const soldOut = variants ? variants.length > 0 && variants.every((variant) => variant.stock === 0) : false;
	const options: QuickAddOption[] = (variants ?? []).map((variant) => ({
		id: variant.id,
		sku: variant.sku ?? null,
		price: variant.price,
		priceGross: variant.priceGross,
		images: variant.images ?? [],
		label: variantLabel(variant),
		available: variant.stock !== 0,
	}));

	return (
		<article className={cn("group/piece flex min-w-0 flex-col gap-3", className)}>
			<div className="relative overflow-hidden rounded-photo bg-photo">
				{/* The name below is the link people read; this one is for the pointer. */}
				<Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[3/4]">
					{primary ? (
						<YNSMedia
							src={primary}
							alt=""
							fill
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
							sizes={sizes}
							className="object-cover"
						/>
					) : null}
					{next && next !== primary ? <HoverPhoto src={next} sizes={sizes} /> : null}
				</Link>
				{soldOut ? (
					<span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-[#111214] backdrop-blur-md">
						Sold out
					</span>
				) : null}
				{oneTimeAllowed && options.length > 0 && !soldOut ? (
					<QuickAdd
						product={{ id: product.id, name: product.name, slug: product.slug, images: product.images ?? [] }}
						options={options}
						href={href}
					/>
				) : null}
			</div>
			<div className="flex flex-col gap-1 px-1">
				<Link href={href} className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-3">
					<span className="min-w-0 truncate text-sm font-medium sm:whitespace-normal sm:text-[15px]">
						{product.name}
					</span>
					{priceText ? (
						<span className="shrink-0 whitespace-nowrap text-sm tabular-nums sm:text-[15px]">
							{priceText}
						</span>
					) : null}
				</Link>
				{metaLine ? <span className="truncate text-[13px] text-muted-foreground">{metaLine}</span> : null}
			</div>
		</article>
	);
}

/** The price a single variant shows, in the store's tax basis. */
export function variantPriceText(
	variant: CardVariant,
	config: { currency: string; locale: string; taxBehavior: Parameters<typeof displayPrice>[1] },
) {
	return formatMoney({
		amount: BigInt(displayPrice(variant, config.taxBehavior)),
		currency: config.currency,
		locale: config.locale,
	});
}
