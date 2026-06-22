import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowUpRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

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
	/** Load the first card's image eagerly. Off for grids below the fold (related products). */
	eagerFirstImage?: boolean;
};

export async function ProductGrid({
	title = "Best-sellers, on repeat",
	description = "The bottles your bag, desk and gym shelf will fight over.",
	eyebrow = "Shop the lineup",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[#f5efe6] py-20 sm:py-28">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
					<div className="max-w-2xl">
						<span className="inline-block px-3 py-1 rounded-full bg-[#e4daf5] text-[#5e3ca8] text-[11px] font-semibold uppercase tracking-[0.18em]">
							{eyebrow}
						</span>
						<h2 className="mt-4 font-display text-[44px] sm:text-[56px] leading-[1] tracking-[-0.025em] text-[#14111c]">
							{title}
						</h2>
						<p className="mt-4 text-[15px] text-[#14111c]/65 max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<Link
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#5e3ca8] hover:text-[#3a2575] transition-colors"
						>
							View Everything
							<ArrowUpRight className="h-4 w-4" />
						</Link>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={eagerFirstImage && index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<Link
							href={viewAllHref}
							className="inline-flex items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#5e3ca8] hover:text-[#3a2575] transition-colors"
						>
							View Everything
							<ArrowUpRight className="h-4 w-4" />
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
