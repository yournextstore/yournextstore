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
	eyebrow?: string;
	title?: string;
	description?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	columns?: 3 | 4;
	showViewAll?: boolean;
	viewAllHref?: string;
};

export async function ProductGrid({
	eyebrow,
	title = "Featured Products",
	description,
	products,
	limit = 8,
	columns = 4,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const gridCols =
		columns === 4 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

	return (
		<section id="products" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
				<div className="flex items-end justify-between mb-10 gap-6">
					<div>
						{eyebrow && (
							<p className="text-[11px] uppercase tracking-[0.22em] text-[--oxblood] font-semibold mb-3">
								{eyebrow}
							</p>
						)}
						<h2 className="display-section text-3xl sm:text-4xl text-foreground tracking-tight">{title}</h2>
						{description && <p className="mt-3 text-muted-foreground max-w-xl">{description}</p>}
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] font-semibold text-foreground/70 hover:text-foreground transition-colors"
						>
							Shop All
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					)}
				</div>

				<div className={`grid ${gridCols} gap-x-5 gap-y-10`}>
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-10 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] font-semibold text-foreground/70 hover:text-foreground transition-colors"
						>
							Shop All <ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
