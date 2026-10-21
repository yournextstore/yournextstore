import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

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
			className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
		>
			<div className="relative aspect-[4/5] overflow-hidden bg-[#e9e2d6]">
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
							sizes="(min-width: 1280px) 400px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, calc(100vw - 48px)"
							className="object-cover"
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
				{/* The original's hover veil with a full-width gradient "Shop now" bar. */}
				<div
					aria-hidden
					className="absolute inset-0 z-10 grid items-end opacity-0 transition-all group-hover:bg-black/10 group-hover:opacity-100 group-focus-visible:opacity-100"
				>
					<span className="btn-emerald w-full rounded-none">
						Shop now
						<ArrowRight className="h-5 w-5" />
					</span>
				</div>
			</div>
			<div className="flex flex-1 items-start justify-between gap-4 px-5 py-6 text-zinc-700">
				<span className="min-w-0 group-hover:underline">{product.name}</span>
				{priceDisplay ? <span className="shrink-0 whitespace-nowrap font-bold">{priceDisplay}</span> : null}
			</div>
		</Link>
	);
}
