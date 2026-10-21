import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/** A small white label in the image's corner: red "Sale", grey "Sold out". */
export function Badge({ label, tone = "default" }: { label: string; tone?: "default" | "critical" }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-sm bg-white px-1.5 py-1 text-ui-sm leading-none",
				tone === "critical" ? "text-sale" : "text-darkgray",
			)}
		>
			{label}
		</span>
	);
}

/** Card copy shared with the tiles and pills: the price pair, the category line, the option count. */
export async function getCardDetails(product: CardProduct) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : [];
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	// The lowest variant price, marked "From" when the variants are priced differently.
	const listing = listingPrice(variants, taxBehavior);
	const first = variants[0];
	const listPrice = first && variants.length === 1 ? displayPrice(first, taxBehavior, "originalPrice") : null;
	const onSale = Boolean(first && listPrice && listing && BigInt(listPrice) > listing.amount);

	return {
		price: listing ? `${listing.from ? "From " : ""}${fmt(listing.amount)}` : null,
		compareAt: onSale && listPrice ? fmt(BigInt(listPrice)) : null,
		soldOut: variants.length > 0 && variants.every((variant) => variant.stock === 0),
		category: "category" in product && product.category ? product.category.name : null,
		options: variants.length > 1 ? `${variants.length} options` : null,
		image: [...(product.images ?? []), ...variants.flatMap((v) => v.images ?? [])].find(
			(image) => !isVideoUrl(image),
		),
	};
}

export function PriceLine({ price, compareAt }: { price: string | null; compareAt: string | null }) {
	return (
		<div className="flex flex-wrap font-bold">
			{compareAt && (
				<s className="mr-2.5 text-darkgray decoration-sale-line">
					<span className="sr-only">Was </span>
					{compareAt}
				</s>
			)}
			{price && (
				<span>
					{compareAt && <span className="sr-only">Now </span>}
					{price}
				</span>
			)}
		</div>
	);
}

export async function ProductCard({
	product,
	priority = false,
	aspectClassName = "aspect-square",
	imageOnly = false,
	sizes = "(max-width: 768px) 100vw, 50vw",
}: {
	product: CardProduct;
	priority?: boolean;
	aspectClassName?: string;
	imageOnly?: boolean;
	sizes?: string;
}) {
	const details = await getCardDetails(product);
	const variants = "variants" in product ? product.variants : null;
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
	const href = `/product/${product.slug}${variantSearch}`;

	return (
		<div className="group relative">
			<div
				className={cn(
					aspectClassName,
					"relative flex items-center justify-center overflow-hidden rounded-md bg-lightgray transition-[border-radius] duration-500 ease-out hover:rounded-xl",
				)}
			>
				<Link href={href} className="absolute inset-0" aria-label={imageOnly ? product.name : undefined}>
					{details.image && (
						<YNSMedia
							src={details.image}
							alt={imageOnly ? "" : product.name}
							fill
							sizes={sizes}
							className={cn("object-cover", details.soldOut && "opacity-60")}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					)}
					<span className="absolute top-4 left-4 flex gap-1">
						{details.compareAt && !details.soldOut && <Badge label="Sale" tone="critical" />}
						{details.soldOut && <Badge label="Sold out" />}
					</span>
				</Link>
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
			{!imageOnly && (
				<div className="mt-3 text-ui-md">
					<div className="space-y-1">
						<h2>
							<Link href={href} tabIndex={-1} className="font-bold hover:underline">
								{product.name}
							</Link>
						</h2>
						{details.category && <div className="text-darkgray">{details.category}</div>}
						{details.options && <div className="text-darkgray">{details.options}</div>}
					</div>
					<div className="mt-3">
						<PriceLine price={details.price} compareAt={details.compareAt} />
					</div>
				</div>
			)}
		</div>
	);
}
