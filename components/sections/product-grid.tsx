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
	title = "Featured Products",
	description = "Handpicked favorites from our collection",
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
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
				<div>
					<p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground mb-3">
						Subscribe & save · 15% off
					</p>
					<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
						{title}
					</h2>
					<p className="mt-3 text-muted-foreground max-w-md">{description}</p>
				</div>
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-background hover:bg-foreground/90 transition-colors"
					>
						Shop all
						<ArrowRight className="h-4 w-4" />
					</Link>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={eagerFirstImage && index === 0} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center sm:hidden">
					<Link
						href={viewAllHref}
						className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-background hover:bg-foreground/90 transition-colors"
					>
						Shop all
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			)}
		</section>
	);
}
