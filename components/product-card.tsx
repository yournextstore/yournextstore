import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

type Heading = "h2" | "h3";

/** The italic line under the name: the original shows the brand, here the category. */
function subtitleOf(product: CardProduct) {
	const category = "category" in product ? product.category : null;
	return category && typeof category === "object" && "name" in category ? String(category.name) : null;
}

function imagesOf(product: CardProduct) {
	const variants = "variants" in product ? product.variants : [];
	return [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
}

// A single-variant card deep-links to that variant; a bare link would show the product's default.
function hrefOf(product: CardProduct) {
	const variants = "variants" in product ? product.variants : null;
	const only = variants?.length === 1 ? variants[0] : null;
	if (!only || !("combinations" in only) || only.combinations.length === 0) {
		return `/product/${product.slug}`;
	}
	const params = new URLSearchParams();
	for (const combination of only.combinations) {
		params.set(combination.variantValue.variantType.label, combination.variantValue.value);
	}
	return `/product/${product.slug}?${params.toString()}`;
}

/**
 * The shop-grid card: a bordered white tile with a grey picture band, centred name, italic
 * subtitle and bold price. On hover the picture band shrinks, the text lifts and an
 * "Add to basket" bar slides up from the bottom edge (single-variant products only).
 */
export async function ProductCard({
	product,
	priority = false,
	as: Name = "h2",
}: {
	product: CardProduct;
	priority?: boolean;
	as?: Heading;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min, max } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const price = min ? formatMoney({ amount: min, currency, locale }) : null;
	const fromPrice = min && max && min !== max;
	const image = getProductThumbnail(imagesOf(product));
	const subtitle = subtitleOf(product);
	const single = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

	return (
		<div className="group relative h-[200px] overflow-hidden border border-border bg-card text-center sm:h-[230px]">
			<Link
				href={hrefOf(product)}
				className="block transition-transform duration-400 ease-in-out group-hover:-translate-y-2.5"
			>
				<div className="relative mx-auto h-20 w-full overflow-hidden bg-[#f6f6f6] transition-all duration-400 ease-in-out sm:h-[100px] sm:group-hover:h-20">
					{image && (
						<YNSMedia
							src={image}
							alt=""
							fill
							sizes="(max-width: 640px) 50vw, 200px"
							className="object-cover"
							priority={priority}
						/>
					)}
				</div>
				<div className="p-4">
					<Name className="mx-auto truncate text-[0.8125rem] font-bold leading-5 text-foreground">
						{product.name}
					</Name>
					<p className="mt-1.5 truncate text-sal-sm font-normal italic text-muted-foreground">
						{subtitle ?? " "}
					</p>
					{price && (
						<p className="mt-4 text-[1.0625rem] font-bold text-black">
							{fromPrice && <span className="sr-only">From </span>}
							{price}
						</p>
					)}
				</div>
			</Link>
			{single && (
				<QuickAddButton
					variantId={single.id}
					variantSku={"sku" in single ? single.sku : null}
					variantPrice={single.price}
					variantPriceGross={"priceGross" in single ? single.priceGross : null}
					variantImages={single.images}
					product={{ id: product.id, name: product.name, slug: product.slug, images: product.images ?? [] }}
					className="absolute inset-x-0 -bottom-full hidden w-full transition-all duration-400 ease-in-out group-hover:bottom-0 group-focus-within:bottom-0 sm:flex"
				/>
			)}
		</div>
	);
}

/**
 * The home "showcase" card: wide bordered tile with a 200px picture that zooms on hover,
 * the name large and the subtitle in italics underneath.
 */
export function DisplayCard({
	product,
	priority = false,
	as: Name = "h3",
	className,
}: {
	product: CardProduct;
	priority?: boolean;
	as?: Heading;
	className?: string;
}) {
	const image = getProductThumbnail(imagesOf(product));
	const subtitle = subtitleOf(product);
	return (
		<Link href={hrefOf(product)} className={cn("group block border border-border", className)}>
			<div className="relative h-[200px] overflow-hidden bg-tile">
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="(max-width: 768px) 100vw, 33vw"
						className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:scale-110"
						priority={priority}
					/>
				)}
			</div>
			<div className="p-5">
				<Name className="text-[1.5rem] font-medium leading-tight text-foreground">{product.name}</Name>
				<p className="mt-1 text-sal-nav font-normal italic text-muted-foreground">{subtitle ?? " "}</p>
			</div>
		</Link>
	);
}

/** Showcase grid: 30rem+ columns (three at desktop), one per row on phones. */
export const DISPLAY_GRID = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3";
