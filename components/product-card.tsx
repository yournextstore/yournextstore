import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { chipToneClass, productChips } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export type CardProduct = BrowseProduct | CollectionProduct | FullProduct;

/**
 * FRNTR product tile: a bordered photo with attribute chips along its bottom edge and a red
 * discount tag in the corner, then the name and price in bold beneath.
 */
export async function ProductCard({
	product,
	priority = false,
	className,
	imageClassName = "aspect-[4/5]",
	sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
}: {
	product: CardProduct;
	priority?: boolean;
	className?: string;
	imageClassName?: string;
	sizes?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : [];
	const { min, max } = variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	const cheapest = variants.find(
		(variant) => min !== null && BigInt(displayPrice(variant, taxBehavior)) === min,
	);
	const listRaw = cheapest ? displayPrice(cheapest, taxBehavior, "originalPrice") : null;
	const list = listRaw ? BigInt(listRaw) : null;
	const onSale = min !== null && list !== null && list > min;
	const discount = onSale && list ? Math.round((Number(list - min) / Number(list)) * 100) : 0;

	const priceLabel =
		min === null ? null : max !== null && max !== min ? `${fmt(min)} – ${fmt(max)}` : fmt(min);

	const image =
		getProductThumbnail(product.images ?? []) ??
		getProductThumbnail(variants.flatMap((variant) => variant.images ?? []));
	const chips = productChips(product as Parameters<typeof productChips>[0]);

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const onlyVariant = variants.length === 1 ? variants[0] : null;
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
		<Link href={`/product/${product.slug}${variantSearch}`} className={cn("group relative block", className)}>
			<div className={cn("relative overflow-hidden border border-border bg-white", imageClassName)}>
				{image && (
					<YNSMedia
						src={image}
						alt=""
						fill
						sizes={sizes}
						priority={priority}
						className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
					/>
				)}
				{discount > 0 && (
					<span className="absolute top-2 right-2 rounded-xs bg-sale px-2.5 py-1 text-sm font-bold text-white">
						-{discount}%
					</span>
				)}
				{chips.length > 0 && (
					<span className="absolute inset-x-1 bottom-1 flex gap-1 overflow-hidden">
						{chips.map((chip) => (
							<span
								key={`${chip.tone}-${chip.label}`}
								className={cn(
									"shrink-0 rounded-xs px-2 py-1 text-xs whitespace-nowrap sm:text-sm",
									chipToneClass[chip.tone],
								)}
							>
								{chip.label}
							</span>
						))}
					</span>
				)}
			</div>
			<span className="mt-1.5 block text-base leading-tight font-bold text-foreground group-hover:underline">
				{product.name}
			</span>
			{priceLabel && (
				<span className="mt-1 flex items-baseline gap-1.5 text-base font-bold">
					<span className={onSale ? "text-sale" : "text-foreground"}>{priceLabel}</span>
					{onSale && list && <s className="text-[0.8rem] font-medium text-muted-foreground">{fmt(list)}</s>}
				</span>
			)}
		</Link>
	);
}
