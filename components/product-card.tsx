import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;
export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/** The original's model card: a white tile with a rounded square photo, a bold two-line name and a centred price. */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 24vw",
	tabIndex,
}: {
	product: CardProduct;
	priority?: boolean;
	sizes?: string;
	tabIndex?: number;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const priceDisplay =
		minPrice !== null && maxPrice !== null && minPrice !== maxPrice
			? `${fmt(minPrice)} – ${fmt(maxPrice)}`
			: minPrice !== null
				? fmt(minPrice)
				: null;

	// Sale price: only when every variant shares one price, as on the original's card.
	const firstVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice = firstVariant ? displayPrice(firstVariant, taxBehavior, "originalPrice") : null;
	const salePrice = firstVariant ? BigInt(displayPrice(firstVariant, taxBehavior)) : null;
	const compareAt =
		listPrice && salePrice !== null && BigInt(listPrice) > salePrice ? BigInt(listPrice) : null;
	const discountPercent =
		compareAt && salePrice !== null
			? Math.round((Number(compareAt - salePrice) / Number(compareAt)) * 100)
			: null;

	const image = [...(product.images ?? []), ...(variants?.flatMap((v) => v.images ?? []) ?? [])][0];

	return (
		<Link
			href={`/product/${product.slug}`}
			tabIndex={tabIndex}
			className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-card p-2 shadow-sm transition-shadow duration-300 hover:shadow-md sm:rounded-3xl lg:p-3 dark:border-neutral-800"
		>
			<div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
				{image &&
					(isVideoUrl(image) ? (
						<video
							className="absolute inset-0 h-full w-full object-cover"
							src={image}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<YNSMedia
							src={image}
							alt=""
							fill
							sizes={sizes}
							priority={priority}
							className="object-cover transition duration-300 ease-in-out group-hover:scale-105"
						/>
					))}
				{discountPercent ? (
					<span className="absolute end-2 top-3 rounded-full bg-neutral-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
						-{discountPercent}%
					</span>
				) : null}
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-2 px-1 pt-3 pb-2 text-start sm:pt-4">
				<p className="line-clamp-2 text-sm font-semibold break-words text-neutral-900 sm:text-base dark:text-neutral-100">
					{product.name}
				</p>
				{priceDisplay ? (
					<p className="mt-auto flex min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-xs sm:text-sm">
						{compareAt ? (
							<span className="text-neutral-500 line-through dark:text-neutral-400">
								<span className="sr-only">Was </span>
								{fmt(compareAt)}
							</span>
						) : null}
						<span
							className={cn(
								compareAt
									? "font-semibold text-red-700 dark:text-red-400"
									: "text-neutral-900 dark:text-neutral-100",
							)}
						>
							{compareAt ? <span className="sr-only">Now </span> : null}
							{priceDisplay}
						</span>
					</p>
				) : null}
			</div>
		</Link>
	);
}
