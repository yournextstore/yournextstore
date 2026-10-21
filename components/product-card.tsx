import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { Percent } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/** The original's catalogue card: soft slate tile, centred photo, name, orange price, pill action. */
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

	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const compareAt = onlyVariant ? displayPrice(onlyVariant, taxBehavior, "originalPrice") : null;
	const onSale = !!compareAt && !!listing && BigInt(compareAt) > listing.amount;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const inStock = variants?.some((v) => v.stock !== 0) ?? true;
	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant = oneTimeAllowed && onlyVariant && onlyVariant.stock !== 0 ? onlyVariant : null;

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
		<article className="group relative flex size-full flex-col items-center rounded-[20px] bg-shell p-4 transition-shadow duration-500 hover:shadow-xl">
			{onSale && (
				<span className="absolute left-4 top-4 z-10 flex size-[26px] items-center justify-center rounded-full bg-black text-white">
					<Percent aria-hidden className="size-4" strokeWidth={3} />
					<span className="sr-only">On sale</span>
				</span>
			)}
			<Link href={href} className="relative flex w-full flex-1 flex-col items-center text-center">
				<div className="relative mx-auto mt-6 mb-5 aspect-square w-[78%] overflow-hidden rounded-2xl bg-muted">
					{primaryImage &&
						(isVideoUrl(primaryImage) ? (
							<video
								className="absolute inset-0 size-full object-cover"
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
								sizes="(max-width: 480px) 70vw, (max-width: 1024px) 30vw, 200px"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
								priority={priority}
								fetchPriority={priority ? "high" : undefined}
							/>
						))}
				</div>
				<h2 className="line-clamp-2 min-h-10 text-sm leading-5 text-ink">{product.name}</h2>
				<p className="mt-2 flex flex-wrap items-baseline justify-center gap-x-2.5">
					<span className="text-xl font-bold text-tangerine">{priceDisplay}</span>
					{onSale && compareAt && (
						<s className="text-xs text-hush">{formatMoney({ amount: compareAt, currency, locale })}</s>
					)}
				</p>
			</Link>
			<div className="mt-4 flex w-full justify-center">
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
				) : inStock && variants && (variants.length > 1 || !oneTimeAllowed) ? (
					<Link
						href={href}
						aria-label={`${oneTimeAllowed ? "Choose options" : "Subscribe"}, ${product.name}`}
						className="pill pill-outline h-[42px] w-full max-w-40 px-4 text-base"
					>
						{oneTimeAllowed ? "Options" : "Subscribe"}
					</Link>
				) : (
					<span className="pill pill-muted h-[42px] w-full max-w-40 px-4 text-base">Out of stock</span>
				)}
			</div>
		</article>
	);
}
