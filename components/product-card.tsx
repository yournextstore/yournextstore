import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export type TileProduct = BrowseProduct | CollectionProduct | FullProduct;

/** Square white tile with the product photo and a frosted name/price pill. */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
	labelPosition = "bottom",
	heading = "h2",
	className,
}: {
	product: TileProduct;
	priority?: boolean;
	sizes?: string;
	labelPosition?: "bottom" | "center";
	heading?: "h2" | "h3";
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;

	const image = getProductThumbnail([
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []) ?? []),
	]);

	// A single-variant tile deep-links to that variant; a bare link would show the product's default.
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const variantSearch = (() => {
		if (!onlyVariant || !("combinations" in onlyVariant) || onlyVariant.combinations.length === 0) {
			return "";
		}
		const params = new URLSearchParams(
			onlyVariant.combinations.map((c) => [c.variantValue.variantType.label, c.variantValue.value]),
		);
		return `?${params.toString()}`;
	})();

	const Heading = heading;

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className={cn("relative block h-full w-full rounded-lg", className)}
		>
			<div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white hover:border-blue-600 dark:border-neutral-800 dark:bg-black dark:hover:border-blue-600">
				{image ? (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes={sizes}
						priority={priority}
						fetchPriority={priority ? "high" : undefined}
						className="relative h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
					/>
				) : null}
				<div
					className={cn(
						"@container/label absolute bottom-0 left-0 flex w-full px-4 pb-4",
						labelPosition === "center" && "lg:px-20 lg:pb-[35%]",
					)}
				>
					<div className="flex items-center rounded-full border border-neutral-200 bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
						<Heading className="mr-4 line-clamp-2 grow pl-2 leading-none tracking-tight">
							{product.name}
						</Heading>
						{listing ? (
							<p className="flex-none rounded-full bg-blue-600 p-2 text-white">
								{listing.from ? "From " : ""}
								{formatMoney({ amount: listing.amount, currency, locale })}
								<span className="ml-1 hidden @[275px]/label:inline">{currency.toUpperCase()}</span>
							</p>
						) : null}
					</div>
				</div>
			</div>
		</Link>
	);
}
