import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/**
 * UIkit E-commerce Template's `tm-product-card`: a white grid cell with a contained packshot,
 * a small type label, a three-line title, the old price struck above the price, and a round
 * blue cart button. Below 640px the card turns into the template's list row (photo left, 40%).
 */
export async function ProductCard({
	product,
	priority = false,
	headingLevel = "h3",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	headingLevel?: "h2" | "h3";
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const priceDisplay =
		minPrice !== null && maxPrice !== null && minPrice !== maxPrice
			? `from ${fmt(minPrice)}`
			: minPrice !== null
				? fmt(minPrice)
				: null;

	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice = onlyVariant
		? BigInt(
				displayPrice(onlyVariant, taxBehavior, "originalPrice") ?? displayPrice(onlyVariant, taxBehavior),
			)
		: null;
	const compareAt = listPrice !== null && minPrice !== null && listPrice > minPrice ? fmt(listPrice) : null;

	const image = getProductThumbnail([
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []) ?? []),
	]);
	const singleVariant = onlyVariant && onlyVariant.stock !== 0 ? onlyVariant : null;
	const soldOut = variants !== null && variants.length > 0 && variants.every((v) => v.stock === 0);
	const label = "category" in product && product.category ? product.category.name : null;

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
	const Heading = headingLevel;

	return (
		<article className="group relative grid h-full grid-cols-[40%_minmax(0,1fr)] gap-x-[15px] bg-card p-[15px] transition-shadow hover:z-10 hover:shadow-[0_14px_25px_rgba(0,0,0,0.16)] sm:flex sm:flex-col sm:p-5">
			<div className="relative aspect-square sm:mb-5 sm:aspect-[5/4]">
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="(max-width: 640px) 40vw, (max-width: 1024px) 45vw, 300px"
						className="object-contain"
						priority={priority}
					/>
				)}
				{(compareAt || soldOut) && (
					<span className="absolute top-0 right-0 flex flex-col items-end gap-[2px]">
						{compareAt && <span className="uk-label bg-sale">Sale</span>}
						{soldOut && <span className="uk-label bg-ink">Sold out</span>}
					</span>
				)}
			</div>
			<div className="flex min-w-0 flex-1 flex-col">
				{label && <p className="mb-[5px] text-uk-sm text-muted-foreground">{label}</p>}
				<Heading className="line-clamp-3 text-uk-md text-foreground sm:text-[18px] sm:leading-6">
					<Link
						href={href}
						className="after:absolute after:inset-0 after:content-[''] group-hover:text-primary"
					>
						{product.name}
					</Link>
				</Heading>
				<div className="mt-auto flex items-end justify-between gap-[10px] pt-[15px]">
					<div className="min-w-0">
						{compareAt && <del className="block text-uk-sm text-muted-foreground">{compareAt}</del>}
						{priceDisplay && (
							<p className={cn("text-uk-lg font-medium text-foreground", !compareAt && "pt-0")}>
								{priceDisplay}
							</p>
						)}
					</div>
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
						!soldOut && (
							<Link
								href={href}
								tabIndex={-1}
								aria-hidden
								className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-[#115eab]"
							>
								<ShoppingCartIcon aria-hidden className="size-[18px]" strokeWidth={1.5} />
							</Link>
						)
					)}
				</div>
			</div>
		</article>
	);
}
