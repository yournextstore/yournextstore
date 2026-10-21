import type { APIProductsBrowseResult } from "commerce-kit";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-grid-skeleton";
import { cn } from "@/lib/utils";

type Product = APIProductsBrowseResult["data"][number];

const GRID = "grid gap-x-6 gap-y-[60px] md:grid-cols-2";

/** A listing page's product grid: two columns beside the filters, three when there are none. */
export function ListingGrid({ products, withFilters }: { products: Product[]; withFilters: boolean }) {
	return (
		<>
			<h2 className="sr-only">Products</h2>
			<ul className={cn(GRID, withFilters ? "sp-2xl:grid-cols-3" : "sp-xl:grid-cols-3")}>
				{products.map((product, index) => (
					<li key={product.id}>
						<ProductCard product={product} priority={index === 0} size={withFilters ? "rail" : "grid"} />
					</li>
				))}
			</ul>
		</>
	);
}

export function ListingGridSkeleton({ withFilters, count = 6 }: { withFilters: boolean; count?: number }) {
	return (
		<div className={cn(GRID, withFilters ? "sp-2xl:grid-cols-3" : "sp-xl:grid-cols-3")}>
			{Array.from({ length: count }, (_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}

export function ListingEmpty() {
	return (
		<div className="border-2 border-ink px-6 py-20 text-center shadow-brut">
			<p className="font-title text-sp-6">Nothing here yet</p>
			<p className="mt-3 text-base">No products match these filters. Try clearing some of them.</p>
		</div>
	);
}
