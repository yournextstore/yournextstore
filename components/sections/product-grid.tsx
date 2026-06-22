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
	title = "The Shop Edit",
	description = "Hand-picked pieces, in season for now.",
	eyebrow = "in the shop",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-[#f5e4d2]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
					<div>
						<p className="font-script text-[#1f46c2] text-2xl sm:text-3xl leading-none">{eyebrow}</p>
						<h2 className="mt-2 font-display text-4xl sm:text-5xl lg:text-[56px] text-[#2a2622] uppercase tracking-wide leading-[1.02]">
							{title}
						</h2>
						<p className="mt-3 max-w-md text-sm text-[#6b5e4e] leading-relaxed">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-medium text-[#2a2622] hover:text-[#1f46c2] transition-colors"
						>
							View all
							<span aria-hidden>→</span>
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center justify-center gap-2 h-12 px-8 border border-[#2a2622]/60 text-[#2a2622] uppercase tracking-[0.22em] text-[11px] font-medium hover:bg-[#2a2622] hover:text-[#f5e4d2] transition-colors rounded-full"
						>
							Shop the full edit
							<span aria-hidden>→</span>
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
