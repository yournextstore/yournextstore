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
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section
			id="products"
			className="relative bg-[var(--tropic-cream)] text-[#15323b] rounded-t-[40px] sm:rounded-t-[64px]"
		>
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
					<div className="max-w-2xl">
						<span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--tropic-red)] font-semibold">
							<span className="h-px w-8 bg-[var(--tropic-red)]" />
							The Lineup
						</span>
						<h2 className="font-display italic mt-3 text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#15323b]">
							{title}
						</h2>
						<p className="mt-3 text-base sm:text-lg text-[#486870] leading-relaxed max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex h-12 items-center gap-2 rounded-full bg-[#15323b] px-6 text-sm font-semibold text-[var(--tropic-yellow)] hover:bg-[#0a1f24] transition-colors"
						>
							Shop all
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 text-sm font-semibold text-[#15323b] hover:text-[var(--tropic-red)] transition-colors"
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
