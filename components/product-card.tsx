import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { sentenceCase } from "@/lib/catalog-names";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

// The original's five card grounds, one per card in turn: foam, denim, coral, slate, sand.
const GROUNDS = [
	"bg-[linear-gradient(160deg,#e7ddc8,#efe7d8)]",
	"bg-[linear-gradient(160deg,#dfe4e9,#e9e6da)]",
	"bg-[linear-gradient(160deg,#f0dfd2,#efe7d8)]",
	"bg-[linear-gradient(160deg,#e4e2d6,#ece5d4)]",
	"bg-[linear-gradient(160deg,#eee4cd,#e6dcc5)]",
];

/**
 * The original's shelf card: a foam card, slightly askew, with the photograph on a tinted ground,
 * the name in Bebas beside a mono price, a mono line in denim and two mono chips (fit, stock).
 */
export async function ProductCard({
	product,
	priority = false,
	sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px",
	subtitle,
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	sizes?: string;
	/** Small mono line under the name; defaults to the product's category. */
	subtitle?: string;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing
		? `${listing.from ? "from " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
		: null;

	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const listPrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior, "originalPrice") : null;
	const salePrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior) : null;
	const onSale = listPrice && salePrice && BigInt(listPrice) > BigInt(salePrice);

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant =
		oneTimeAllowed && variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

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

	const category = "category" in product && product.category ? sentenceCase(product.category.name) : null;
	const line = subtitle ?? category;

	// Stock chips: null stock means the store does not track it, so it reads as in stock.
	const stocks = variants?.map((v) => v.stock) ?? [];
	const soldOut = stocks.length > 0 && stocks.every((stock) => stock === 0);
	const tracked = stocks.filter((stock): stock is number => typeof stock === "number");
	const units = tracked.reduce((sum, stock) => sum + stock, 0);
	const low = !soldOut && tracked.length === stocks.length && stocks.length > 0 && units <= 3;
	const fit = variants && variants.length > 1 ? `${variants.length} options` : "one size";
	const ground = GROUNDS[(product.id.charCodeAt(product.id.length - 1) || 0) % GROUNDS.length];

	return (
		<article
			className={cn(
				"group relative flex flex-col overflow-hidden rounded-tile border border-line bg-foam shadow-card transition-[translate,box-shadow] duration-600 ease-ocean hover:-translate-y-1.5 hover:shadow-card-hover motion-reduce:hover:translate-y-0",
				className,
			)}
		>
			<div className={cn("relative overflow-hidden border-b border-line-soft", ground)}>
				<Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[4/5]">
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
								sizes={sizes}
								draggable={false}
								className={`object-cover transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
								priority={priority}
								fetchPriority={priority ? "high" : undefined}
							/>
						))}
					{secondaryImage && !isVideoUrl(secondaryImage) && (
						<YNSMedia
							src={secondaryImage}
							alt=""
							fill
							sizes={sizes}
							draggable={false}
							className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					)}
				</Link>
				{singleVariant && (
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
				)}
			</div>
			<div className="flex flex-1 flex-col px-5 pb-[22px] pt-[18px]">
				<div className="flex items-baseline justify-between gap-2.5">
					<h2 className="display line-clamp-2 min-w-0 text-[1.5rem] leading-none tracking-[0.03em]">
						<Link href={href} className="after:absolute after:inset-0 after:content-['']">
							{product.name}
						</Link>
					</h2>
					<p className="mono flex shrink-0 flex-col items-end text-right text-[0.92rem] font-bold">
						<span>{priceDisplay}</span>
						{onSale && listPrice ? (
							<del className="text-[0.7rem] font-normal text-faint">
								{formatMoney({ amount: listPrice, currency, locale })}
							</del>
						) : null}
					</p>
				</div>
				{line && <p className="label-mono mt-1.5 text-denim-deep">{line}</p>}
				<div className="mt-auto flex flex-wrap gap-2 pt-3.5">
					<span className="chip">{fit}</span>
					{soldOut ? (
						<span className="chip chip-soon">sold out</span>
					) : low ? (
						<span className="chip chip-low">low stock</span>
					) : (
						<span className="chip chip-ok">in stock</span>
					)}
					{onSale ? <span className="chip chip-low">on sale</span> : null}
				</div>
			</div>
		</article>
	);
}
