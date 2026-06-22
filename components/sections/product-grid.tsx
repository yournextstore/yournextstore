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
	eyebrow?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	columns?: 3 | 4;
	background?: "white" | "cream";
};

export async function ProductGrid({
	title = "All Products",
	description = "A quietly considered catalog — sofas, seating, tables and accents made to last.",
	eyebrow,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	columns = 4,
	background = "white",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const gridCols =
		columns === 4
			? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
			: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

	const bg = background === "cream" ? "bg-cream-wash" : "bg-background";

	return (
		<section id="products" className={`${bg}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
					<div className="max-w-xl">
						{eyebrow && (
							<div className="text-[11px] uppercase tracking-[0.22em] text-[#c8a57a] mb-3">— {eyebrow}</div>
						)}
						<h2 className="font-display text-4xl sm:text-5xl tracking-[-0.015em] text-[#1f2933]">{title}</h2>
						<p className="mt-3 text-[#1f2933]/60 leading-relaxed">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="group hidden sm:inline-flex items-center gap-2 self-end rounded-full border border-[#1f2933]/15 px-5 py-2.5 text-sm font-medium text-[#1f2933] hover:bg-[#1f2933] hover:text-[#f5f1ea] transition-colors"
						>
							View all
							<ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</YnsLink>
					)}
				</div>

				<div className={`grid ${gridCols} gap-5 sm:gap-6 lg:gap-7`}>
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-10 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 rounded-full border border-[#1f2933]/15 px-5 py-2.5 text-sm font-medium text-[#1f2933]"
						>
							View all products
							<ArrowUpRightIcon className="h-4 w-4" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
