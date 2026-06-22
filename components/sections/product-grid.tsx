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
	title = "Featured Products",
	description = "Handpicked favorites from our collection",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative border-b border-[#E5D3B7] bg-[#F6ECDC]">
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
				<div className="mb-10 flex flex-col items-start justify-between gap-4 sm:mb-14 sm:flex-row sm:items-end">
					<div>
						<span className="inline-flex items-center gap-2 rounded-full border border-[#8C1F2A]/20 bg-[#8C1F2A]/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8C1F2A]">
							<span aria-hidden="true">★</span> Shop the kitchen
						</span>
						<h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight text-[#2A2A2A] sm:text-4xl lg:text-5xl">
							{title}
						</h2>
						<p className="mt-3 max-w-md text-base text-[#5a4a3a]">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch="eager"
							href={viewAllHref}
							className="inline-flex items-center gap-2 rounded-full border border-[#8C1F2A] bg-transparent px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8C1F2A] transition-colors hover:bg-[#8C1F2A] hover:text-[#FAF2E6]"
						>
							View all
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>
			</div>
		</section>
	);
}
