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
	eyebrow?: string;
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
	eyebrow = "Shop The Drop",
	title = "Made for laundry day (and every day after)",
	description,
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[#F5EFE6]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
					<div className="max-w-xl">
						{eyebrow && (
							<p className="uppercase tracking-[0.24em] text-xs text-[#6B92AC] font-semibold mb-3">
								{eyebrow}
							</p>
						)}
						<h2 className="headline-display text-3xl sm:text-4xl lg:text-5xl text-[#1F2A33] leading-[0.95]">
							{title}
						</h2>
						{description && <p className="mt-4 text-[#3B4856] text-base sm:text-lg">{description}</p>}
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] font-semibold text-[#1F2A33] hover:text-[#6B92AC] transition-colors"
						>
							Shop All
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] font-semibold text-[#1F2A33]"
						>
							Shop All
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
