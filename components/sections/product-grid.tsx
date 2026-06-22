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
	title = "The systems",
	description = "Bottle + cap + capsules. Built around how you actually use them.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-black">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex items-end justify-between mb-10 sm:mb-14">
					<div className="max-w-2xl">
						<p className="text-[11px] uppercase tracking-[0.32em] text-white/45 font-medium">The lineup</p>
						<h2 className="mt-4 font-display text-3xl sm:text-5xl leading-[1.02] text-white">{title}</h2>
						<p className="mt-3 text-base sm:text-lg text-white/55 leading-relaxed">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 px-5 h-11 text-[13px] font-medium text-white hover:border-[var(--yns-lime)] hover:text-[var(--yns-lime)] transition-colors"
						>
							View all
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 h-11 text-[13px] font-medium text-white"
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
