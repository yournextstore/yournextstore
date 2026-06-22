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
	eyebrow?: string;
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
	description = "Quick-add a pint or build your own four-pack.",
	eyebrow = "The Lineup",
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
		<section id="products" className="bg-black text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
					<div>
						<div className="font-display uppercase tracking-[0.2em] text-xs text-[var(--yns-cyan)]">
							{eyebrow}
						</div>
						<h2 className="mt-3 font-display uppercase text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
							{title}
						</h2>
						<p className="mt-4 text-white/60 max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<Link
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 font-display uppercase text-xs tracking-[0.18em] text-white/70 hover:text-white transition-colors"
						>
							View All
							<ArrowRight className="h-4 w-4" />
						</Link>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={eagerFirstImage && index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<Link
							href={viewAllHref}
							className="inline-flex items-center gap-2 font-display uppercase text-xs tracking-[0.18em] text-white/80"
						>
							View All
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
