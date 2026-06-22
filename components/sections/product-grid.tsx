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
	tone?: "cream" | "indigo";
};

export async function ProductGrid({
	title = "Best-Selling Scents",
	description = "Bold, iconic, full-volume bars our customers can't stop reordering.",
	eyebrow = "shop the shelf",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	tone = "cream",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const sectionClass = tone === "indigo" ? "bg-[#1a1a2e] text-[#fdf6ee]" : "bg-[#fdf6ee] text-[#1a1a2e]";

	return (
		<section id="products" className={`${sectionClass}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
					<div>
						{eyebrow && (
							<p
								className={`font-script text-2xl ${tone === "indigo" ? "text-[#f2c9a6]" : "text-[#4d4bc4]"}`}
							>
								{eyebrow}
							</p>
						)}
						<h2 className="mt-1 font-display text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
						<p className={`mt-3 max-w-xl ${tone === "indigo" ? "text-[#fdf6ee]/70" : "text-[#5c5b78]"}`}>
							{description}
						</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className={`hidden sm:inline-flex items-center gap-2 h-11 px-6 rounded-full text-sm font-semibold tracking-wide uppercase transition-colors ${tone === "indigo" ? "bg-[#fdf6ee] text-[#1a1a2e] hover:bg-[#fdf6ee]/90" : "bg-[#1a1a2e] text-[#fdf6ee] hover:bg-[#4d4bc4]"}`}
						>
							Shop All
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-10 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 h-11 px-6 rounded-full text-sm font-semibold tracking-wide uppercase bg-[#1a1a2e] text-[#fdf6ee]"
						>
							Shop all products
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
