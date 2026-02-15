import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	description?: string;
	products?: (Product | APICollectionGetByIdResult["productCollections"][number]["product"])[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	columns?: 3 | 4;
};

export async function ProductGrid({
	title = "Featured Products",
	description,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	columns = 4,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const gridCols =
		columns === 4 ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="flex items-end justify-between mb-8">
				<div>
					<h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-light text-foreground">
						{title}
					</h2>
					{description && <p className="mt-2 text-muted-foreground text-sm">{description}</p>}
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						Shop All Products
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-10 text-center">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-foreground hover:text-accent transition-colors"
					>
						Shop All Products
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
