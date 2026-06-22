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
	tone?: "light" | "blush";
};

export async function ProductGrid({
	title = "From the pantry",
	description = "Slow-blended, hand-poured, and tinned in small batches.",
	eyebrow = "Featured tins",
	products,
	limit = 4,
	showViewAll = true,
	viewAllHref = "/products",
	tone = "light",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const bg = tone === "blush" ? "bg-[#fbe5ea]" : "bg-[#fffaf7]";

	return (
		<section id="products" className={`${bg} py-20 sm:py-28`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
					<div>
						<p className="text-[11px] uppercase tracking-[0.3em] text-[#b81e26] font-semibold">{eyebrow}</p>
						<h2 className="mt-3 font-display italic text-3xl sm:text-5xl text-[#7a0e15] tracking-tight">
							{title}
						</h2>
						<p className="mt-3 text-[15px] text-[#2b2120]/70 max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[#b81e26] hover:text-[#7a0e15] underline-offset-4 hover:underline"
						>
							Shop all tins →
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-6">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-1 text-sm font-medium text-[#b81e26]"
						>
							Shop all tins →
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
