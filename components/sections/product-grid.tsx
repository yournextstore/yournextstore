import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	eyebrow?: string;
	description?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	/** Load the first card's image eagerly. Off for grids below the fold (related products). */
	eagerFirstImage?: boolean;
};

export async function ProductGrid({
	title = "Shop The Lineup",
	eyebrow = "The Drop",
	description = "Pouches engineered for clean, focused energy.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
				<div className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/60">{eyebrow}</p>
						<h2 className="mt-3 font-display text-5xl uppercase tracking-tight text-foreground sm:text-6xl lg:text-7xl">
							{title}
						</h2>
						<p className="mt-4 max-w-md text-base text-muted-foreground">{description}</p>
					</div>
					{showViewAll && (
						<Link
							href={viewAllHref}
							className="hidden items-center gap-2 self-end text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-foreground/60 sm:inline-flex"
						>
							View All
							<ArrowRight className="h-4 w-4" />
						</Link>
					)}
				</div>

				<div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={eagerFirstImage && index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<Link
							href={viewAllHref}
							className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground"
						>
							View All Products
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
