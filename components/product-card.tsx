import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ImageOff } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/**
 * The original's editorial product card: a framed photograph, a two-line name reserved at two
 * lines so every price in a row shares one baseline, then price, was-price and a green "% off".
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(min-width: 1280px) 22vw, (min-width: 900px) 24vw, 46vw",
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	sizes?: string;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const range = variants && variants.length > 0 ? priceRange(variants, taxBehavior) : null;
	const hasRange = range !== null && range.min !== range.max;

	// The struck-through list price only reads when every variant carries the same sale.
	const single = variants?.length === 1 ? variants[0] : null;
	const listPrice =
		single && "originalPrice" in single ? (displayPrice(single, taxBehavior, "originalPrice") ?? null) : null;
	const nowPrice = range?.min ?? null;
	const wasPrice = listPrice && nowPrice !== null && BigInt(listPrice) > nowPrice ? BigInt(listPrice) : null;
	const percentOff =
		wasPrice && nowPrice !== null ? Math.round((Number(wasPrice - nowPrice) / Number(wasPrice)) * 100) : null;

	const image = [...(product.images ?? []), ...(variants?.flatMap((v) => v.images ?? []) ?? [])].find(
		(src) => !isVideoUrl(src),
	);

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const variantSearch = (() => {
		if (!single || !("combinations" in single) || single.combinations.length === 0) return "";
		const params = new URLSearchParams();
		for (const combination of single.combinations) {
			params.set(combination.variantValue.variantType.label, combination.variantValue.value);
		}
		return `?${params.toString()}`;
	})();
	const href = `/product/${product.slug}${variantSearch}`;

	return (
		<article className={cn("group relative flex w-full flex-col @container", className)}>
			<Link href={href} className="relative block" aria-label={product.name}>
				<figure className="relative m-0 aspect-[3/4] overflow-hidden rounded-lg border border-transparent bg-card">
					{image ? (
						<YNSMedia
							src={image}
							alt=""
							fill
							sizes={sizes}
							priority={priority}
							className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-safe:group-hover:scale-[1.03]"
						/>
					) : (
						<div className="grid h-full w-full place-items-center border border-border bg-card">
							<ImageOff
								className="h-[22px] w-[22px] text-muted-foreground opacity-60"
								strokeWidth={1.25}
								aria-hidden
							/>
						</div>
					)}
				</figure>
			</Link>
			<div className="flex flex-col gap-[3px] pt-2">
				<Link href={href} tabIndex={-1} aria-hidden className="block">
					<span className="line-clamp-2 min-h-[2.7em] text-[0.8125rem] font-medium leading-[1.35] text-foreground transition-colors group-hover:text-primary-hover">
						{product.name}
					</span>
				</Link>
				<p className="m-0 flex min-h-[2.4rem] flex-wrap content-start items-baseline gap-x-[5px] gap-y-0.5 leading-[1.25] tabular-nums">
					{hasRange && <span className="text-xs font-medium text-muted-foreground">From</span>}
					{nowPrice !== null && (
						<span className="text-sm font-bold text-foreground">
							{formatMoney({ amount: nowPrice, currency, locale })}
						</span>
					)}
					{wasPrice && (
						<span className="text-xs text-muted-foreground line-through">
							{formatMoney({ amount: wasPrice, currency, locale })}
						</span>
					)}
					{percentOff ? (
						<span className="basis-full whitespace-nowrap text-xs font-semibold uppercase tracking-[0.02em] text-success">
							{percentOff}% off
						</span>
					) : null}
				</p>
			</div>
		</article>
	);
}
