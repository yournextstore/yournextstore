import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowUpRightIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

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
};

export async function ProductGrid({
	title = "Botanica essentials",
	description = "Single-origin formulas, sustainably sourced and gently crafted.",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
				<div className="max-w-xl">
					<p className="text-xs uppercase tracking-[0.2em] text-leaf-700 font-semibold">
						Shop the collection
					</p>
					<h2 className="mt-3 font-display text-4xl sm:text-5xl tracking-tight text-foreground text-balance">
						{title}
					</h2>
					<p className="mt-3 text-base text-muted-foreground leading-relaxed text-pretty">{description}</p>
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="group inline-flex items-center gap-2 self-start sm:self-end h-11 px-5 rounded-full text-sm font-medium text-foreground bg-secondary hover:bg-foreground hover:text-background transition-colors"
					>
						View all products
						<ArrowUpRightIcon className="h-4 w-4 group-hover:rotate-45 transition-transform" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
