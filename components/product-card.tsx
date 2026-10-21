import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { CartPlusIcon } from "@/components/gf/icons";
import { splitProductName, unitLabel } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/** The Grofresh tile: a white card on a soft halo, photo well, name, unit, price and a green cart-plus. */
export async function ProductCard({
	product,
	priority = false,
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : [];
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	const listing = listingPrice(variants, taxBehavior);
	const min = listing?.amount ?? null;
	const first = variants[0];
	const listPrice =
		variants.length === 1 && first ? (displayPrice(first, taxBehavior, "originalPrice") ?? null) : null;
	const compareAt = listPrice && min !== null && BigInt(listPrice) > min ? BigInt(listPrice) : null;
	const percent =
		compareAt && min !== null ? Math.round((Number(compareAt - min) / Number(compareAt)) * 100) : 0;
	const price = min === null || min === 0n ? null : fmt(min);
	const isRange = listing?.from ?? false;

	const image =
		getProductThumbnail(product.images ?? []) ?? getProductThumbnail(variants.flatMap((v) => v.images ?? []));
	const [title, descriptor] = splitProductName(product.name);
	const unit =
		descriptor ?? unitLabel({ variants, category: "category" in product ? product.category : null });

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant = oneTimeAllowed && variants.length === 1 && first && first.stock !== 0 ? first : null;

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const variantSearch = (() => {
		if (!first || variants.length !== 1 || !("combinations" in first) || first.combinations.length === 0) {
			return "";
		}
		const params = new URLSearchParams();
		for (const combination of first.combinations) {
			params.set(combination.variantValue.variantType.label, combination.variantValue.value);
		}
		return `?${params.toString()}`;
	})();

	return (
		<article
			className={cn(
				"group relative flex min-w-0 flex-col gap-2.5 rounded-[30px] bg-white p-2.5 gf-shadow transition-shadow focus-within:outline-2 focus-within:outline-green-500 hover:outline hover:outline-green-500",
				className,
			)}
		>
			<div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-white gf-shadow">
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="(max-width: 640px) 45vw, 190px"
						className="gf-photo object-cover"
						priority={priority}
						fetchPriority={priority ? "high" : undefined}
					/>
				)}
				{percent > 0 && (
					<span className="absolute top-2 left-2 rounded-full bg-green-500 px-2 py-[3px] text-gf-xs font-bold text-white">
						-{percent}%
					</span>
				)}
			</div>
			<div className="flex flex-1 flex-col px-1">
				<h2 className="line-clamp-2 text-gf-h5 font-bold">
					<Link
						href={`/product/${product.slug}${variantSearch}`}
						className="outline-none after:absolute after:inset-0 after:rounded-[30px]"
					>
						<span className="sr-only">{product.name}</span>
						<span aria-hidden="true">{title}</span>
					</Link>
				</h2>
				{unit && <p className="mt-[5px] line-clamp-1 text-gf-h6 text-muted-foreground">{unit}</p>}
				<div className="mt-auto flex items-center justify-between gap-2 pt-[7px]">
					<span className="flex min-w-0 flex-wrap items-baseline gap-x-[5px]">
						{isRange && <span className="w-full text-gf-xs text-muted-foreground">from</span>}
						{price && <b className="text-gf-h6 font-bold whitespace-nowrap">{price}</b>}
						{compareAt && <s className="text-gf-xs text-muted-foreground">{fmt(compareAt)}</s>}
					</span>
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
					) : (
						<span
							aria-hidden="true"
							className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-green-500 text-white"
						>
							<CartPlusIcon />
						</span>
					)}
				</div>
			</div>
		</article>
	);
}
