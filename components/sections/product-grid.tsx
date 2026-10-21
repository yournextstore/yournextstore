import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowUpRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getHomeFavourites } from "@/lib/catalog";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	eyebrow?: string;
	title?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	viewAllLabel?: string;
	className?: string;
};

/** "Good things, on repeat." — eyebrow, serif title, underlined link and a four-up row. */
export async function ProductGrid({
	eyebrow = "A few favourites",
	title = "Good things, on repeat.",
	products,
	limit = 4,
	showViewAll = true,
	viewAllHref = "/products",
	viewAllLabel = "Shop all pieces",
	className = "frame py-16 lg:py-24",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	// The home row (no products passed) skips products without a photo.
	const displayProducts = products ?? (await getHomeFavourites()).slice(0, limit);

	if (displayProducts.length === 0) {
		return null;
	}

	return (
		<section className={className}>
			<div className="mb-9 flex flex-wrap items-end justify-between gap-5 sm:mb-12">
				<div>
					<p className="eyebrow text-muted-foreground">{eyebrow}</p>
					<h2 className="mt-3 font-display text-4xl tracking-[-0.035em] sm:text-5xl">{title}</h2>
				</div>
				{showViewAll && (
					<Link href={viewAllHref} className="collection-link border-b border-foreground/40 pb-1.5 text-xs">
						{viewAllLabel} <ArrowUpRight size={15} aria-hidden="true" />
					</Link>
				)}
			</div>
			<div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 md:gap-x-6">
				{displayProducts.slice(0, 4).map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
