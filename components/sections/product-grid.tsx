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
	title = "Meet the Flavors",
	description = "Made in small batches with real ingredients you can pronounce.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[#f5e6d3] relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center max-w-2xl mx-auto mb-14">
					<div className="inline-flex items-center gap-2 rounded-full bg-[#fbf4e8] border border-[#d9c1a3] px-4 py-1.5 text-[10px] sm:text-xs font-display font-bold uppercase tracking-[0.24em] text-[#8b5e3c] mb-5">
						<span className="h-1.5 w-1.5 rounded-full bg-[#c99a5e]" />
						The Shop
					</div>
					<h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#4a2c1a] tracking-tight leading-[1]">
						{title}
					</h2>
					<p className="mt-4 text-base sm:text-lg text-[#8b5e3c] leading-relaxed">{description}</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-16 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-[#c99a5e] text-[#4a2c1a] text-xs sm:text-sm font-display font-bold tracking-[0.2em] uppercase border-2 border-[#8b5e3c] shadow-[0_4px_0_0_#8b5e3c] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#8b5e3c] transition-all"
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
