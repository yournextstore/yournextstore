import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { picturedFirst } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { cn } from "@/lib/utils";

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
	columns?: 3 | 4;
	className?: string;
};

/** Fluid's featured-products section: a heading with "View all" on one line over the card grid. */
export async function ProductGrid({
	title = "Featured products",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	columns = 3,
	className,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts =
		products ??
		picturedFirst(
			(await commerce.productBrowse({ active: true, limit: Math.max(limit * 2, 12) })).data,
		).slice(0, limit);

	return (
		<section id="products" className={cn("container py-14 sm:py-20", className)}>
			<div className="mb-5 flex items-baseline justify-between gap-4 sm:mb-4">
				<h2 className="text-section sm:text-[2.34rem]">{title}</h2>
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="shrink-0 rounded-lg px-2 py-2 text-base font-semibold transition-colors hover:bg-secondary"
					>
						View all
					</Link>
				)}
			</div>

			<div
				className={cn(
					"grid grid-cols-1 gap-5 sm:grid-cols-2",
					columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
				)}
			>
				{displayProducts.map((product, index) => (
					<ProductCard
						key={product.id}
						product={product}
						priority={index === 0}
						sizes={
							columns === 4
								? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
								: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						}
					/>
				))}
			</div>
		</section>
	);
}
