import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_GRID } from "@/components/product-grid-skeleton";
import { photographedFirst } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { gfMoreLink } from "@/lib/gf-styles";

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
	priorityCount?: number;
};

/** A titled product shelf ("Popular now"): h4 title, "See all" link, the two/three-up grid. */
export async function ProductGrid({
	title = "Popular now",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	priorityCount = 0,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts =
		products ??
		photographedFirst(
			(await commerce.productBrowse({ active: true, limit: Math.max(limit, 24) })).data,
		).slice(0, limit);
	if (displayProducts.length === 0) {
		return null;
	}

	return (
		<section className="mt-[30px]">
			<div className="mb-[18px] flex items-center justify-between gap-4">
				<h2 className="text-gf-h4 font-bold">{title}</h2>
				{showViewAll && (
					<Link href={viewAllHref} className={gfMoreLink}>
						See all
					</Link>
				)}
			</div>
			<div className={PRODUCT_GRID}>
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index < priorityCount} />
				))}
			</div>
		</section>
	);
}
