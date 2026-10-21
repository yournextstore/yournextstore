import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { photographedFirst } from "@/lib/editorial";
import { cn } from "@/lib/utils";

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
	/** Four narrower columns (related products) instead of the original's three. */
	dense?: boolean;
	/** Visually hide the heading, as the original's home grid does. */
	hideTitle?: boolean;
	className?: string;
};

export async function ProductGrid({
	title = "Featured Products",
	description = "A selection from the shop",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	dense = false,
	hideTitle = false,
	className,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts =
		products ??
		photographedFirst(
			(await commerce.productBrowse({ active: true, limit: Math.max(limit, 48) })).data,
		).slice(0, limit);

	return (
		<section id="products" className={cn("container py-16 sm:py-20", className)}>
			<div className={cn("flex items-end justify-between gap-6", hideTitle ? "sr-only" : "mb-8")}>
				<div>
					<h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
					{description ? <p className="mt-1 text-gray-600">{description}</p> : null}
				</div>
			</div>

			<div
				className={cn(
					"grid gap-12",
					dense
						? "grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
						: "md:grid-cols-2 lg:grid-cols-3",
				)}
			>
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index < 3 && !dense} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center">
					<Link href={viewAllHref} className="font-semibold text-emerald-900 hover:text-emerald-700">
						View all products
						<span aria-hidden> &rarr;</span>
					</Link>
				</div>
			)}
		</section>
	);
}
