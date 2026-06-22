import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { DEMO_PRODUCTS, previewHref } from "@/lib/demo-products";
import { YnsLink } from "../yns-link";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	eyebrow?: string;
	description?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	columns?: 3 | 4;
	showViewAll?: boolean;
	viewAllHref?: string;
	isPreview?: boolean;
};

export async function ProductGrid({
	title = "Best sellers",
	eyebrow = "Shelf favorites",
	description = "What our regulars keep returning for, season after season.",
	products,
	limit = 8,
	columns = 4,
	showViewAll = true,
	viewAllHref = "/products",
	isPreview = false,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const fetched = products
		? products
		: isPreview
			? DEMO_PRODUCTS.slice(0, limit)
			: (await commerce.productBrowse({ active: true, limit })).data;

	const gridCols =
		columns === 4 ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

	return (
		<section id="products" className="bg-cream py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between mb-12">
					<div className="max-w-md">
						{eyebrow && (
							<p className="text-[11px] uppercase tracking-[0.32em] text-clay/80 mb-3">{eyebrow}</p>
						)}
						<h2 className="font-serif text-3xl sm:text-5xl text-walnut tracking-tight text-balance">
							{title}
						</h2>
						{description && <p className="mt-3 text-base text-espresso/65 leading-relaxed">{description}</p>}
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={previewHref(viewAllHref, isPreview)}
							className="hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-espresso/70 hover:text-espresso transition-colors"
						>
							View all
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					)}
				</div>

				<div className={`grid ${gridCols} gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-12`}>
					{fetched.map((product) => (
						<ProductCard key={product.id} product={product} isPreview={isPreview} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={previewHref(viewAllHref, isPreview)}
							className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-espresso/70 hover:text-espresso"
						>
							View all products
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
