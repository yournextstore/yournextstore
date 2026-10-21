import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { CARD_GRID } from "@/components/product-grid-skeleton";
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
	className?: string;
};

/** Titled card grid: the original's "Similar products" block (small uppercase label over five columns). */
export async function ProductGrid({
	title = "New arrivals",
	products,
	limit = 10,
	showViewAll = true,
	viewAllHref = "/products",
	className = "frame py-10",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	// Without a given list: the newest pieces, photographed ones first so a bare card never leads the rail.
	const displayProducts =
		products ??
		(await commerce.productBrowse({ active: true, limit: Math.max(limit, 24) })).data
			.map((product, index) => ({ product, index, pictured: (product.images?.length ?? 0) > 0 }))
			.sort((a, b) => Number(b.pictured) - Number(a.pictured) || a.index - b.index)
			.map(({ product }) => product)
			.slice(0, limit);

	return (
		<section className={className}>
			<div className="mb-5 flex items-end justify-between gap-4">
				<h2 className="text-lg uppercase text-ink">{title}</h2>
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="text-sm font-bold uppercase text-tangerine transition-colors hover:text-tangerine-deep"
					>
						View all
					</Link>
				)}
			</div>
			<div className={CARD_GRID}>
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
