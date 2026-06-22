import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	description?: string;
	eyebrow?: string;
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
	title = "Featured Strips",
	description = "Bestsellers, restocks, and limited-edition drops.",
	eyebrow = "shop the line",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[#fef7f0]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
					<div>
						{eyebrow && <p className="font-marker text-[#f4884a] text-xl mb-2 -rotate-2">{eyebrow}</p>}
						<h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1a0f4d]">{title}</h2>
						<p className="mt-3 text-[#1a0f4d]/70 text-base max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch="eager"
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#4b1fb5] hover:text-[#1a0f4d] transition-colors"
						>
							View All
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch="eager"
							href={viewAllHref}
							className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#4b1fb5] hover:text-[#1a0f4d] transition-colors"
						>
							View All Products
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
