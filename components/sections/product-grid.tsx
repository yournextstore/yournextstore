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
	title = "Shop the flavors",
	description = "Bold marinades. Better protein. Pick your pouch.",
	products,
	limit = 3,
	showViewAll = true,
	viewAllHref = "/products",
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
					<div>
						<p className="font-display text-[11px] tracking-[0.32em] uppercase text-chili">
							Featured flavors
						</p>
						<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-charcoal">
							{title}
						</h2>
						<p className="mt-3 font-script italic text-lg text-mahogany/80">{description}</p>
					</div>
					{showViewAll && (
						<Link
							href={viewAllHref}
							className="group hidden sm:inline-flex items-center gap-2 text-sm font-display uppercase tracking-[0.18em] text-mahogany hover:text-chili transition-colors"
						>
							Shop all
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={eagerFirstImage && index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<Link
							href={viewAllHref}
							className="inline-flex items-center gap-2 rounded-full bg-chili px-7 py-3 font-display text-sm uppercase tracking-[0.18em] text-cream"
						>
							Shop all flavors
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
