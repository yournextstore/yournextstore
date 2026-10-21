import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { listingPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/** HiyoRi's product card: square photo, bold name, two-line blurb, price, round basket button. */
export async function ProductCard({
	product,
	priority = false,
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const listing = variants ? listingPrice(variants, taxBehavior) : null;
	const priceDisplay = listing
		? `${listing.from ? "From " : ""}${formatMoney({ amount: listing.amount, currency, locale })}`
		: null;
	const { max: maxOriginal } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior, "originalPrice") : { max: null };
	const onSale = Boolean(listing && maxOriginal && maxOriginal > listing.amount);

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant =
		oneTimeAllowed && variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

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
	const href = `/product/${product.slug}${variantSearch}`;
	const summary = "summary" in product ? product.summary : null;

	return (
		<article className={cn("relative flex w-full flex-col py-3", className)}>
			<div className="relative mb-5 overflow-hidden">
				<Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-square bg-card">
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
								sizes="(max-width: 1024px) 50vw, 25vw"
								className="object-cover object-center transition-all duration-500 hover:scale-[1.02] hover:opacity-70"
								priority={priority}
								fetchPriority={priority ? "high" : undefined}
							/>
						))}
				</Link>
				{onSale && (
					<span className="absolute top-0 left-0 bg-sale px-2.5 py-0.5 text-xs font-semibold text-white">
						Sale
					</span>
				)}
			</div>

			<div className="mb-3 space-y-1.5 md:mb-5">
				<h2 className="text-lg leading-tight font-semibold tracking-tight md:text-2xl">
					<Link href={href} className="block hover:underline">
						{product.name}
					</Link>
				</h2>
				{summary && (
					<p className="hidden max-w-[240px] text-sm text-muted-foreground md:line-clamp-2">{summary}</p>
				)}
				{priceDisplay && <p className="text-sm md:text-base">{priceDisplay}</p>}
			</div>

			<div className="mt-auto flex items-center gap-x-2 md:gap-x-5">
				{singleVariant ? (
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
				) : (
					<Link
						href={href}
						aria-label={`Choose options, ${product.name}`}
						className="flex h-8 w-8 items-center justify-center rounded-full border border-primary transition-colors hover:bg-primary hover:text-primary-foreground"
					>
						<ArrowRight className="h-4 w-4" aria-hidden="true" />
					</Link>
				)}
			</div>
		</article>
	);
}
