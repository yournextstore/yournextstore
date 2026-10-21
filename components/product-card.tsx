import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { optionsLabel } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { displayPrice, listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/** The original's white product tile: grey photo well, price, name, blue options line, navy cart bar. */
export async function ProductCard({
	product,
	priority = false,
	headingLevel = "h3",
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	headingLevel?: "h2" | "h3";
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing
		? `${listing.from ? "from " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
		: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant = oneTimeAllowed && onlyVariant && onlyVariant.stock !== 0 ? onlyVariant : null;

	// Sale badge ("-25%") from the variant's own list price; nothing is invented.
	const listPrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior, "originalPrice") : null;
	const salePrice = onlyVariant ? displayPrice(onlyVariant, taxBehavior) : null;
	const onSale = listPrice && salePrice && BigInt(listPrice) > BigInt(salePrice);
	const discountPercent = onSale
		? Math.round((Number(BigInt(listPrice) - BigInt(salePrice)) / Number(BigInt(listPrice))) * 100)
		: null;

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
	const Heading = headingLevel;
	const soldOut = variants !== null && variants.length > 0 && variants.every((v) => v.stock === 0);

	return (
		<article
			className={cn(
				"group flex h-full flex-col rounded-xl bg-card p-2 shadow-[0_2px_16px_rgb(4_38_80/0.12)] transition-shadow hover:shadow-[0_6px_24px_rgb(4_38_80/0.18)]",
				className,
			)}
		>
			<Link
				href={href}
				tabIndex={-1}
				aria-hidden="true"
				className="relative block aspect-square overflow-hidden rounded-lg bg-tile"
			>
				{discountPercent ? (
					<span className="absolute top-3 left-3 z-10 rounded border border-alert bg-[#fff1f1] px-2 py-0.5 text-xs font-medium text-alert">
						-{discountPercent}%
					</span>
				) : null}
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
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
							className={cn(
								"object-cover transition duration-500 group-hover:scale-[1.03]",
								secondaryImage && !isVideoUrl(secondaryImage) && "group-hover:opacity-0",
							)}
							priority={priority}
							fetchPriority={priority ? "high" : undefined}
						/>
					))}
				{secondaryImage && !isVideoUrl(secondaryImage) && (
					<YNSMedia
						src={secondaryImage}
						alt=""
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
						className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					/>
				)}
			</Link>
			<div className="flex flex-1 flex-col px-2 pt-3 pb-2">
				<div className="flex items-start justify-between gap-3">
					<Heading className="min-w-0 text-lg leading-snug text-ink sm:text-xl">
						<Link href={href} className="hover:text-main">
							{product.name}
						</Link>
					</Heading>
					<p className="shrink-0 pt-0.5 text-right text-base text-ink">
						{onSale && listPrice ? (
							<span className="mr-2 text-sm text-steel line-through">
								{formatMoney({ amount: BigInt(listPrice), currency, locale })}
							</span>
						) : null}
						{priceDisplay}
					</p>
				</div>
				{variants && variants.length > 0 && (
					<p className="mt-1 text-sm text-[#1d5fd0]">
						{soldOut ? "Sold out" : optionsLabel(variants.length)}
					</p>
				)}
				<div className="mt-auto pt-4">
					{singleVariant ? (
						<QuickAddButton
							variant={{
								id: singleVariant.id,
								sku: "sku" in singleVariant ? singleVariant.sku : null,
								price: singleVariant.price,
								priceGross: "priceGross" in singleVariant ? singleVariant.priceGross : null,
								images: singleVariant.images,
							}}
							product={{
								id: product.id,
								name: product.name,
								slug: product.slug,
								images: product.images ?? [],
							}}
						/>
					) : (
						<Link
							href={href}
							className="relative inline-flex h-10 w-full items-center justify-center rounded-md border border-main px-4 text-sm font-medium uppercase tracking-wide text-main transition-colors hover:bg-main hover:text-page"
						>
							{soldOut ? "View product" : "Choose options"}
							<span className="sr-only">, {product.name}</span>
						</Link>
					)}
				</div>
			</div>
		</article>
	);
}
