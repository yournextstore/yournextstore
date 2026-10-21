import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { CardAddButton, CardShareButton, cardPillClass } from "@/components/product-card-actions";
import { formatMoney } from "@/lib/money";
import { listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/** The original's shadcn card: bordered photo, one-line title and price, an outline pill and share. */
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

	const image =
		getProductThumbnail(product.images ?? []) ??
		getProductThumbnail(variants?.flatMap((variant) => variant.images ?? []) ?? []);

	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const purchasable = oneTimeAllowed && onlyVariant && onlyVariant.stock !== 0 ? onlyVariant : null;
	const soldOut = Boolean(
		variants && variants.length > 0 && variants.every((variant) => variant.stock === 0),
	);

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

	return (
		<div className="flex size-full flex-col overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm transition-all duration-200 ease-in-out hover:bg-accent/30">
			<Link
				href={href}
				aria-label={product.name}
				className="relative block aspect-[4/5] border-b bg-secondary"
			>
				{image ? (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
						className="object-cover"
						priority={priority}
						fetchPriority={priority ? "high" : undefined}
					/>
				) : null}
			</Link>
			<Link href={href} tabIndex={-1} className="block flex-1 space-y-1.5 p-3 sm:p-4">
				<h2 className="line-clamp-2 min-h-[2lh] leading-tight font-semibold tracking-tight">
					{product.name}
				</h2>
				{priceDisplay ? <p className="line-clamp-1 text-sm text-muted-foreground">{priceDisplay}</p> : null}
			</Link>
			<div className="flex w-full items-center gap-2 p-3 pt-0 sm:gap-8 sm:p-4 sm:pt-1">
				{purchasable ? (
					<CardAddButton
						variantId={purchasable.id}
						variantSku={"sku" in purchasable ? purchasable.sku : null}
						variantPrice={purchasable.price}
						variantPriceGross={"priceGross" in purchasable ? purchasable.priceGross : null}
						variantImages={purchasable.images}
						product={{
							id: product.id,
							name: product.name,
							slug: product.slug,
							images: product.images ?? [],
						}}
					/>
				) : soldOut ? (
					<span className={cardPillClass} aria-disabled="true">
						Sold out
					</span>
				) : (
					<Link href={href} className={cardPillClass} aria-label={`Choose options, ${product.name}`}>
						Choose options
					</Link>
				)}
				<CardShareButton
					name={product.name}
					path={`/product/${product.slug}`}
					className="hidden sm:inline-flex"
				/>
			</div>
		</div>
	);
}
