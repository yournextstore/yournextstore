import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { photographedFirst } from "@/lib/catalog";
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
	/** "8 products" on the right of the heading, as on the original home page. */
	showCount?: boolean;
	showViewAll?: boolean;
	size?: "lg" | "md";
};

export async function ProductGrid({
	title = "In the shop",
	products,
	limit = 8,
	showCount = true,
	showViewAll = false,
	size = "lg",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	// Browse a wider page so photographed, priced products can lead the grid.
	const result = products ? null : await commerce.productBrowse({ active: true, limit: Math.max(limit, 24) });
	const displayProducts = products ?? photographedFirst(result?.data ?? []).slice(0, limit);
	const total = result?.meta.count ?? displayProducts.length;

	return (
		<section id="products" className="mx-auto max-w-6xl px-5 py-4 sm:py-14">
			<div className="flex items-baseline justify-between gap-4">
				<h2
					className={
						size === "lg"
							? "font-display text-3xl font-bold tracking-tight"
							: "font-display text-2xl font-bold tracking-tight"
					}
				>
					{title}
				</h2>
				{showViewAll ? (
					<Link
						href="/products"
						className="shrink-0 text-[14px] font-semibold underline underline-offset-4 hover:text-pine-ink"
					>
						All {total} products
					</Link>
				) : showCount ? (
					<p className="shrink-0 text-[14px] text-muted-foreground">
						{displayProducts.length} {displayProducts.length === 1 ? "product" : "products"}
					</p>
				) : null}
			</div>
			<div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 sm:mt-7 sm:gap-x-5 md:grid-cols-4">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
