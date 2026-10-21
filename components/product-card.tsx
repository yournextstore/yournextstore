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

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export type TileProduct = BrowseProduct | CollectionProduct | FullProduct;

/**
 * The reference's double-bezel card: a hairline outer shell around an inner core with its own
 * panel surface and a smaller radius; 4:3 photo fading into the panel, name, amber mono price.
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw",
	badge,
	heading = "h2",
	className,
}: {
	product: TileProduct;
	priority?: boolean;
	sizes?: string;
	badge?: string;
	heading?: "h2" | "h3";
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const hasVariants = variants !== null && variants.length > 0;
	const { min } = hasVariants ? priceRange(variants, taxBehavior) : { min: null };
	const listMax = hasVariants ? priceRange(variants, taxBehavior, "originalPrice").max : null;
	const compare = min !== null && listMax !== null && listMax > min ? listMax : null;
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

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
			className={cn(
				"group relative block h-full rounded-[1.75rem] border border-line bg-white/[0.02] p-1.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-amber/35",
				className,
			)}
		>
			<div className="flex h-full flex-col overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-panel shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
				<div className="relative aspect-[4/3] overflow-hidden bg-panel-2">
					{image ? (
						<YNSMedia
							src={image}
							alt=""
							fill
							sizes={sizes}
							priority={priority}
							className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
						/>
					) : null}
					<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
					{badge ? (
						<span className="absolute top-4 left-4 rounded-full bg-amber px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-ink-amber uppercase">
							{badge}
						</span>
					) : null}
				</div>
				<div className="flex flex-1 flex-col gap-3 p-5">
					<Heading className="text-[15px] leading-snug font-medium tracking-normal text-bone">
						{product.name}
					</Heading>
					{min ? (
						<p className="mt-auto flex items-baseline gap-2.5">
							<span className="aq-spec text-lg font-semibold text-amber">{fmt(min)}</span>
							{compare !== null ? (
								<s className="aq-spec text-sm text-[#8a9a9c]">
									<span className="sr-only">Was </span>
									{fmt(compare)}
								</s>
							) : null}
						</p>
					) : null}
				</div>
			</div>
		</Link>
	);
}
