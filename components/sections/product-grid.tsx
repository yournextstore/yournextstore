import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
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
	title = "Popular picks",
	description,
	products,
	limit = 4,
	showViewAll = false,
	viewAllHref = "/products",
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="text-center mb-12">
				<h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-foreground">
					{title}
				</h2>
				{description && <p className="mt-2 text-muted-foreground">{description}</p>}
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={eagerFirstImage && index === 0} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center">
					<Link
						href={viewAllHref}
						className="inline-flex items-center px-8 py-3 border border-foreground text-foreground text-xs tracking-widest uppercase hover:bg-foreground hover:text-primary-foreground transition-colors"
					>
						View all
					</Link>
				</div>
			)}
		</section>
	);
}
