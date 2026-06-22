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
		<section id="products" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="flex items-end justify-between mb-12 flex-wrap gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.22em] text-ember/90 font-medium">The collection</p>
					<h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-bone">
						{title}
					</h2>
					<p className="mt-3 text-muted-foreground max-w-md">{description}</p>
				</div>
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-bone hover:text-ember transition-colors"
					>
						View everything
						<ArrowRight className="h-4 w-4" />
					</Link>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={eagerFirstImage && index === 0} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center sm:hidden">
					<Link
						href={viewAllHref}
						className="inline-flex items-center gap-2 text-sm font-medium text-bone hover:text-ember transition-colors"
					>
						View everything
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			)}
		</section>
	);
}
