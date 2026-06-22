import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { DEMO_PRODUCTS } from "@/lib/demo-products";

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
	previewMode?: boolean;
	columns?: 3 | 4;
	/** Load the first card's image eagerly. Off for grids below the fold (related products). */
	eagerFirstImage?: boolean;
};

async function getProducts(previewMode: boolean, limit: number) {
	if (previewMode) {
		return DEMO_PRODUCTS.slice(0, limit);
	}
	return (await commerce.productBrowse({ active: true, limit })).data;
}

export async function ProductGrid({
	title,
	description,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	previewMode = false,
	columns = 4,
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await getProducts(previewMode, limit));

	const gridCols =
		columns === 4 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

	const computedViewAllHref = previewMode
		? viewAllHref.includes("?")
			? `${viewAllHref}&preview=1`
			: `${viewAllHref}?preview=1`
		: viewAllHref;

	return (
		<section id="products" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
			{title ? (
				<div className="flex items-end justify-between mb-8 sm:mb-10 border-t border-border pt-8">
					<div>
						<h2 className="font-display text-3xl sm:text-4xl font-light text-foreground tracking-tight">
							{title}
						</h2>
						{description ? (
							<p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
								{description}
							</p>
						) : null}
					</div>
					{showViewAll && (
						<Link
							href={computedViewAllHref}
							className="hidden sm:inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-foreground border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
						>
							View all
						</Link>
					)}
				</div>
			) : null}

			<div className={`grid ${gridCols} gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14`}>
				{displayProducts.map((product, index) => (
					<ProductCard
						key={product.id}
						product={product}
						previewMode={previewMode}
						priority={eagerFirstImage && index === 0}
					/>
				))}
			</div>

			{showViewAll && (
				<div className="mt-10 text-center sm:hidden">
					<Link
						href={computedViewAllHref}
						className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-foreground border-b border-foreground pb-1"
					>
						View all products
					</Link>
				</div>
			)}
		</section>
	);
}
