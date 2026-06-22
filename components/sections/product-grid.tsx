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

const TILE_TINTS = [
	"bg-grid-paper-mint",
	"bg-grid-paper-marigold",
	"bg-grid-paper-peach",
	"bg-grid-paper",
	"bg-grid-paper-mint",
	"bg-grid-paper-marigold",
];

export async function ProductGrid({
	title = "Shop the seasoning shelf",
	description = "Three pantry essentials. Endless ways to use them.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[#fbe9d7]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
					<div className="max-w-xl">
						<span className="inline-flex items-center gap-2 rounded-full border border-[#1b2a2e]/15 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1b2a2e]">
							<span className="h-1.5 w-1.5 rounded-full bg-[#9f9cf5]" />
							Shop the collection
						</span>
						<h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-[#1b2a2e]">
							{title}
						</h2>
						<p className="mt-3 text-base sm:text-lg text-[#1b2a2e]/70 leading-relaxed">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#1b2a2e] underline underline-offset-4 decoration-[#f5a623] decoration-2 hover:decoration-[#1b2a2e] transition-colors"
						>
							View all
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{displayProducts.map((product, idx) => (
						<div
							key={product.id}
							className={`group rounded-3xl ${TILE_TINTS[idx % TILE_TINTS.length]} border border-[#1b2a2e]/10 p-3 transition-transform duration-300 hover:-translate-y-1`}
						>
							<ProductCard product={product} />
						</div>
					))}
				</div>

				{showViewAll && (
					<div className="mt-10 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-1 text-sm font-semibold text-[#1b2a2e] underline underline-offset-4 decoration-[#f5a623] decoration-2"
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
