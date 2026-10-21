import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { commerce } from "@/lib/commerce";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
};

/** "Top Picks": a four-up row of plain cards with a centred "View All Products" button. */
export async function ProductGrid({
	title = "Top Picks",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	// Without an explicit list, photographed products lead so the row never opens on an empty tile.
	const displayProducts =
		products ??
		(await commerce.productBrowse({ active: true, limit: 100 })).data
			.toSorted((a, b) => Number(!a.images?.[0]) - Number(!b.images?.[0]))
			.slice(0, limit);

	return (
		<section id="products">
			<h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
			<div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
			{showViewAll && (
				<div className="mt-12 grid place-content-center">
					<Button nativeButton={false} render={<Link href={viewAllHref} />}>
						View All Products
					</Button>
				</div>
			)}
		</section>
	);
}
