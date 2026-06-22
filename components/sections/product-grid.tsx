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
	columns?: 3 | 4;
};

export async function ProductGrid({
	title = "Best Sellers",
	description,
	eyebrow = "Loved By You",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	columns = 4,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const gridCols = columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

	return (
		<section id="products" className="bg-background">
			<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
				<div className="flex flex-col items-center text-center mb-10 sm:mb-14">
					{eyebrow && (
						<p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground mb-3">{eyebrow}</p>
					)}
					<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink">{title}</h2>
					{description && (
						<p className="mt-4 max-w-md text-sm sm:text-base text-muted-foreground font-light">
							{description}
						</p>
					)}
				</div>

				<div
					className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 ${gridCols} gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14`}
				>
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 sm:mt-16 text-center">
						<YnsLink
							prefetch="eager"
							href={viewAllHref}
							className="inline-flex items-center justify-center h-12 px-10 border border-ink/30 text-ink text-[11px] font-semibold tracking-[0.22em] uppercase hover:bg-ink hover:text-cream transition-colors"
						>
							View All
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
