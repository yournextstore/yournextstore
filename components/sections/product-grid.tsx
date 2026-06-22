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
	title = "Featured Drops",
	description = "Handpicked from our cool drink lineup",
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
		<section id="products" className="relative bg-black">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex items-end justify-between mb-12">
					<div>
						<p className="text-[11px] uppercase tracking-[0.22em] text-white/40">Shop</p>
						<h2 className="font-display mt-3 text-4xl sm:text-5xl text-white">{title}</h2>
						<p className="mt-3 text-white/55">{description}</p>
					</div>
					{showViewAll && (
						<Link
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-full border border-white/15 px-4 py-2 hover:border-white/40"
						>
							View all
							<ArrowRight className="h-4 w-4" />
						</Link>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={eagerFirstImage && index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<Link
							href={viewAllHref}
							className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
						>
							View all products
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
