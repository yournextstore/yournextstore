import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { EyeIcon } from "lucide-react";
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

/**
 * The FreshCart product card: hairline card that turns green on hover, packshot with a sale
 * badge and a hover "quick view" button, category caption, name, price with the struck list
 * price, and a green "+ Add". The `deal` layout is the "Daily Best Sells" card: price on the
 * name's row and a full-width "Add to Cart".
 */
export async function ProductCard({
	product,
	priority = false,
	layout = "grid",
	sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw",
}: {
	product: CardProduct;
	priority?: boolean;
	layout?: "grid" | "deal";
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const minPrice = listing?.amount ?? null;
	const priceDisplay = listing ? `${listing.from ? "From " : ""}${fmt(listing.amount)}` : null;

	// A struck list price only when every variant agrees on one sale: single-variant products.
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice =
		onlyVariant && "originalPrice" in onlyVariant
			? displayPrice(onlyVariant, taxBehavior, "originalPrice")
			: null;
	const compareAt = listPrice && minPrice && BigInt(listPrice) > minPrice ? BigInt(listPrice) : null;
	const discountPercent =
		compareAt && minPrice ? Math.round((Number(compareAt - minPrice) / Number(compareAt)) * 100) : null;

	const primaryImage = (product.images ?? []).find((img) => !isVideoUrl(img)) ?? product.images?.[0];
	const category = "category" in product ? product.category : null;

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant = oneTimeAllowed && onlyVariant && onlyVariant.stock !== 0 ? onlyVariant : null;
	const soldOut = variants !== null && variants.length > 0 && variants.every((v) => v.stock === 0);

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
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

	const addButton = singleVariant ? (
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
			label={layout === "deal" ? "Add to Cart" : "Add"}
			size={layout === "deal" ? "md" : "sm"}
			className={layout === "deal" ? "w-full" : undefined}
		/>
	) : (
		<Link
			href={href}
			aria-label={soldOut ? `Sold out, ${product.name}` : `Options, ${product.name}`}
			className={cn(
				"fc-btn",
				layout === "deal" ? "w-full" : "fc-btn-sm",
				soldOut ? "fc-btn-outline" : "fc-btn-green",
			)}
		>
			{soldOut ? "Sold out" : "Options"}
		</Link>
	);

	const price = priceDisplay ? (
		<div className="flex flex-wrap items-baseline gap-x-1">
			<span className="font-semibold text-gray-900">{priceDisplay}</span>
			{compareAt && <span className="text-gray-500 line-through">{fmt(compareAt)}</span>}
		</div>
	) : null;

	return (
		<div className="fc-card h-full transition duration-200 hover:border-green-500 hover:shadow-[0_5px_12px_rgba(0,0,0,0.12)] group/card">
			<div className="flex flex-auto flex-col p-4">
				<div className="relative mb-3">
					{discountPercent ? (
						<span className="absolute top-0 left-0 z-10 rounded bg-red-600 p-1 text-fc-sm leading-none font-semibold text-white">
							{discountPercent}%
						</span>
					) : null}
					<Link
						href={href}
						tabIndex={-1}
						aria-hidden
						className="relative mx-auto block aspect-square w-full overflow-hidden rounded-md bg-gray-50"
					>
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
									className="object-cover"
									priority={priority}
									fetchPriority={priority ? "high" : undefined}
								/>
							))}
					</Link>
					<div className="invisible absolute bottom-[15%] w-full text-center opacity-0 transition duration-200 group-hover/card:visible group-hover/card:opacity-100 group-focus-within/card:visible group-focus-within/card:opacity-100">
						<Link
							href={href}
							aria-label={`Quick view, ${product.name}`}
							className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-white text-gray-600 shadow transition hover:bg-green-600 hover:text-white"
						>
							<EyeIcon className="size-4" aria-hidden />
						</Link>
					</div>
				</div>
				<div className="flex flex-1 flex-col gap-3">
					{category ? (
						<Link
							href={`/category/${category.slug}`}
							className="text-fc-sm text-gray-500 transition hover:text-green-600"
						>
							{category.name}
						</Link>
					) : null}
					{layout === "deal" ? (
						<div className="flex flex-col gap-2">
							<h2 className="truncate text-fc-base">
								<Link href={href} className="text-gray-800 transition hover:text-green-600">
									{product.name}
								</Link>
							</h2>
							{price}
						</div>
					) : (
						<h2 className="truncate text-fc-base">
							<Link href={href} className="text-gray-800 transition hover:text-green-600">
								{product.name}
							</Link>
						</h2>
					)}
					<div
						className={cn("mt-auto", layout === "deal" ? "grid" : "flex items-center justify-between gap-2")}
					>
						{layout === "deal" ? null : price}
						{addButton}
					</div>
				</div>
			</div>
		</div>
	);
}
