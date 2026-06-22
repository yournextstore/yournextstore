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
	title = "The Lineup",
	description = "Real fruit. Real peanut butter. Pop & go.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[#ffe9ec]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12 sm:mb-16">
					<div>
						<span className="inline-block bg-white text-[#c8132b] text-[11px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-[#f7d4d9]">
							Shop now
						</span>
						<h2 className="font-display uppercase text-4xl sm:text-6xl lg:text-7xl mt-5 text-[#c8132b] leading-[0.9]">
							{title}
						</h2>
						<p className="mt-4 text-[#7a4b53] text-base sm:text-lg max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#1a0810] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#c8132b] transition-colors"
						>
							View all
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{displayProducts.map((product, idx) => (
						<div
							key={product.id}
							className="group relative bg-white rounded-[28px] p-4 border border-[#f7d4d9] transition-all hover:-translate-y-1 hover:shadow-[0_25px_55px_rgba(200,19,43,0.18)]"
						>
							<div className="absolute top-6 left-6 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#c8132b] px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-white">
								<span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
								{idx === 0 ? "Bestseller" : idx === 1 ? "New" : idx === 2 ? "Fan Fave" : "Stock Up"}
							</div>
							<ProductCard product={product} />
						</div>
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#1a0810] text-white text-xs font-bold uppercase tracking-[0.2em]"
						>
							View all products
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
