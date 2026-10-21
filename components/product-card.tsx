import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export async function ProductCard({
	product,
	priority = false,
	className,
}: {
	className?: string;
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing
		? `${listing.from ? "From " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
		: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
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

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className={cn("group flex flex-col rounded-sm border border-border bg-background p-1", className)}
		>
			<div className="relative aspect-square overflow-hidden rounded-xs bg-background">
				<div className="absolute inset-0 transition-transform duration-300 lg:group-hover:-translate-y-14">
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
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
								className="object-contain"
								priority={priority}
								fetchPriority={priority ? "high" : undefined}
							/>
						))}
				</div>
				{/* The original's hover action: a black "See more" bar rises over the photo. */}
				<span
					aria-hidden
					className="absolute inset-x-0 bottom-0 hidden h-12 items-center justify-center rounded-sm bg-primary text-label uppercase text-primary-foreground lg:group-hover:flex"
				>
					See more
				</span>
			</div>
			<div className="min-w-0 p-4">
				<h2 className="truncate text-label-lg font-medium">{product.name}</h2>
				{priceDisplay && <p className="mt-2 text-label-lg font-medium">{priceDisplay}</p>}
			</div>
		</Link>
	);
}
