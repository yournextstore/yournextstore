import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
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
	eyebrow?: string;
};

const SWATCHES = ["#f47b7b", "#7fb8d6", "#f8a98a", "#fcefa8", "#e8456a", "#3a4a8c"] as const;
const SALE_TILT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-1"] as const;

export async function ProductGrid({
	title = "Shop The Lineup",
	description = "Three classic flavors, freshly milled, ready to bake.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "Bestsellers",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-[#fdf6cf] overflow-hidden">
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="text-center mb-12 sm:mb-14">
					{eyebrow && (
						<span className="inline-block rounded-full bg-[#3a4a8c] text-[#fcefa8] px-4 py-1.5 text-[11px] tracking-[0.22em] font-bold uppercase shadow-pop">
							{eyebrow}
						</span>
					)}
					<h2 className="mt-4 font-heading font-black text-3xl sm:text-5xl text-[#3a4a8c] leading-[1.05] tracking-tight">
						{title}
					</h2>
					<p className="mt-3 text-[#3a4a8c]/70 max-w-xl mx-auto">{description}</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{displayProducts.map((product, idx) => (
						<ProductCard
							key={product.id}
							product={product}
							accent={SWATCHES[idx % SWATCHES.length]}
							saleTilt={SALE_TILT[idx % SALE_TILT.length]}
							showSaleTag={idx % 2 === 0}
						/>
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#e8456a] text-[#fcefa8] text-xs tracking-[0.22em] font-extrabold uppercase shadow-sticker hover:-translate-y-0.5 transition-transform"
						>
							View the whole shop
							<svg
								viewBox="0 0 24 24"
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden
							>
								<path d="M5 12h14M13 5l7 7-7 7" />
							</svg>
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
