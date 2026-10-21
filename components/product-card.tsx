import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { capitalize } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

async function cardData(product: CardProduct) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min, max } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	// Penny prints "$229.00 to $249.00" for a range, the single price otherwise.
	const price =
		min !== null && max !== null && min !== max ? `${fmt(min)} to ${fmt(max)}` : min ? fmt(min) : null;

	const images = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const image = images.find((url) => !isVideoUrl(url)) ?? null;

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const params = new URLSearchParams();
	if (onlyVariant && "combinations" in onlyVariant) {
		for (const combination of onlyVariant.combinations) {
			params.set(combination.variantValue.variantType.label, combination.variantValue.value);
		}
	}
	const href = `/product/${product.slug}${params.size ? `?${params}` : ""}`;
	const category = "category" in product && product.category ? capitalize(product.category.name) : null;
	return { price, image, href, category };
}

/** Penny's category grid cell: rounded photo, centred name and price (the bordered grid draws the cell). */
/** A product without photos still gets a quiet tile instead of an empty box. */
function NoImage() {
	return (
		<span className="absolute inset-0 grid place-items-center text-gray-400">
			<ImageIcon className="h-8 w-8" aria-hidden="true" />
		</span>
	);
}

export async function ProductCard({
	product,
	priority = false,
}: {
	product: CardProduct;
	priority?: boolean;
}) {
	const { price, image, href } = await cardData(product);

	return (
		<div className="group relative border-r border-b border-gray-200 p-4 sm:p-6">
			<div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
				{!image && <NoImage />}
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="(min-width: 1280px) 290px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
						className="object-cover object-center"
						priority={priority}
						fetchPriority={priority ? "high" : undefined}
					/>
				)}
			</div>
			<div className="pt-10 pb-4 text-center">
				<h3 className="text-sm font-medium text-gray-900">
					<Link href={href}>
						<span aria-hidden="true" className="absolute inset-0" />
						{product.name}
					</Link>
				</h3>
				{price && <p className="mt-4 text-base font-medium text-gray-900">{price}</p>}
			</div>
		</div>
	);
}

/** Penny's home-page "collection" item: photo, a small grey kicker, the name and the price. */
export async function ShelfCard({ product, priority = false }: { product: CardProduct; priority?: boolean }) {
	const { price, image, href, category } = await cardData(product);

	return (
		<div className="group relative">
			<div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
				{!image && <NoImage />}
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes="(min-width: 1024px) 296px, 256px"
						className="object-cover object-center"
						priority={priority}
						fetchPriority={priority ? "high" : undefined}
					/>
				)}
			</div>
			<div className="mt-6">
				{category && <p className="text-sm text-gray-500">{category}</p>}
				<h3 className="mt-1 font-semibold text-gray-900">
					<Link href={href}>
						<span className="absolute inset-0" />
						{product.name}
					</Link>
				</h3>
				{price && <p className="mt-1 text-gray-900">{price}</p>}
			</div>
		</div>
	);
}
