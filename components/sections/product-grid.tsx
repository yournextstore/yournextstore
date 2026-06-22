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
	description = "Premium natural wellness products",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			{/* Section header with view toggle style matching reference */}
			<div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
				<h2 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h2>
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
					>
						View all
						<ArrowRight className="h-4 w-4" />
					</Link>
				)}
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={eagerFirstImage && index === 0} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-8 text-center sm:hidden">
					<Link
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
					>
						View all products
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			)}
		</section>
	);
}
