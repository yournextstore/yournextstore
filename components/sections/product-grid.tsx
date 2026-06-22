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
	eyebrow?: string;
	description?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	columns?: 2 | 3 | 4;
};

export async function ProductGrid({
	title = "The Collection",
	eyebrow = "Chapter Three",
	description = "Pieces chosen one at a time, kept for the long haul.",
	products,
	limit = 4,
	showViewAll = true,
	viewAllHref = "/products",
	columns = 4,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const colClass =
		columns === 4
			? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
			: columns === 3
				? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
				: "grid-cols-1 sm:grid-cols-2";

	return (
		<section id="products" className="bg-[#f2ebdd]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center mb-14 sm:mb-20">
					{eyebrow && (
						<p className="text-[10px] tracking-[0.45em] uppercase text-foreground/55 font-light">{eyebrow}</p>
					)}
					<h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-[-0.015em] leading-[1.05]">
						{title}
					</h2>
					{description && (
						<p className="mt-5 max-w-md mx-auto text-[15px] leading-[1.8] text-foreground/65">
							{description}
						</p>
					)}
				</div>

				<div className={`grid ${colClass} gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16`}>
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-16 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="realm-pill inline-flex items-center justify-center h-11 px-8 rounded-full border border-foreground/30 text-foreground text-[11px] tracking-[0.32em] uppercase font-medium hover:bg-foreground hover:text-background transition-colors"
						>
							View the full collection
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
