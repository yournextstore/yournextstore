import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { CardMedia } from "@/components/card-media";
import { sentenceCase } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export const CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw";

export async function ProductCard({
	product,
	priority = false,
	sizes = CARD_SIZES,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing
		? `${listing.from ? "From " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
		: null;

	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice =
		onlyVariant && "originalPrice" in onlyVariant
			? displayPrice(onlyVariant, taxBehavior, "originalPrice")
			: null;
	const compareAt =
		listPrice && listing && BigInt(listPrice) > listing.amount
			? formatMoney({ amount: BigInt(listPrice), currency, locale })
			: null;

	const images = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	]
		.filter((image) => !isVideoUrl(image))
		.slice(0, 5);

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
	const category = "category" in product && product.category ? product.category.name : null;

	return (
		<article className="group flex h-full flex-col rounded-2xl bg-card p-2">
			<CardMedia href={href} images={images} name={product.name} priority={priority} sizes={sizes} />
			<div className="mt-3 flex flex-1 flex-col gap-3 px-1 pb-1">
				<div>
					<h2>
						<Link href={href} className="line-clamp-2 text-base font-medium text-neutral-900 hover:underline">
							{product.name}
						</Link>
					</h2>
					{category && <p className="mt-0.5 text-xs text-muted-foreground">{sentenceCase(category)}</p>}
				</div>
				<div className="mt-auto flex items-center justify-between gap-2">
					<p className="flex flex-wrap items-baseline gap-x-2 text-lg font-semibold text-black">
						{priceDisplay}
						{compareAt && <s className="text-sm font-normal text-muted-foreground">{compareAt}</s>}
					</p>
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
			</div>
		</article>
	);
}
