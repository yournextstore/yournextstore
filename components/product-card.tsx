import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { BookCover } from "@/components/book-cover";
import { formatMoney } from "@/lib/money";
import { listingPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn } from "@/lib/utils";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

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

	const primaryImage = product.images?.[0] ?? variants?.flatMap((v) => v.images ?? [])[0];

	// Quick-add buys once, so it's only offered where a one-time purchase is allowed.
	const oneTimeAllowed = !("subscriptionMode" in product) || product.subscriptionMode === "optional";
	const singleVariant =
		oneTimeAllowed && variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;
	const soldOut = variants?.length === 1 && variants[0]?.stock === 0;

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

	return (
		<article
			className={cn(
				"flex flex-col gap-y-2 rounded bg-card shadow-[0_1px_3px_0_rgb(0_0_0/0.1),0_1px_2px_-1px_rgb(0_0_0/0.1)] transition-shadow hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)]",
				className,
			)}
		>
			<Link
				href={href}
				tabIndex={-1}
				aria-hidden="true"
				className="group block rounded border-2 border-shelf bg-shelf p-4 sm:p-8 md:p-4 lg:p-8"
			>
				<div className="flex h-44 w-full justify-center transition-transform duration-200 group-hover:scale-105">
					<BookCover
						src={primaryImage}
						alt=""
						priority={priority}
						sizes="(min-width: 1024px) 140px, (min-width: 640px) 25vw, 40vw"
					/>
				</div>
			</Link>
			<div className="flex flex-1 flex-col px-4 pb-4">
				<p className="line-clamp-2 h-10 text-sm leading-5">
					<Link href={href} className="hover:underline">
						{product.name}
					</Link>
				</p>
				<p className="mt-auto mb-1 pt-1 font-medium tabular-nums">{priceDisplay}</p>
				<div className="flex gap-x-2">
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
					) : soldOut ? (
						<span className="btn-shelf h-9 flex-1 cursor-not-allowed px-1 text-sm opacity-70">Sold Out</span>
					) : (
						<Link href={href} className="btn-shelf h-9 flex-1 px-1 text-sm">
							Choose Options
						</Link>
					)}
					<Link
						href={href}
						aria-label={`View ${product.name}`}
						className="btn-outline-shelf h-9 w-9 shrink-0 lg:w-11"
					>
						<ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
					</Link>
				</div>
			</div>
		</article>
	);
}
