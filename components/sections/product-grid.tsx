import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ChevronRight } from "lucide-react";
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
	title = "Shop Our Best Sellers",
	description,
	products,
	limit = 4,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-24">
				<div className="flex items-end justify-between mb-10 sm:mb-14">
					<div>
						<h2 className="yns-display text-2xl sm:text-3xl lg:text-4xl text-yns-ink uppercase tracking-tight not-italic">
							{title}
						</h2>
						{description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-1 text-[11px] tracking-[0.22em] uppercase font-bold text-yns-ink hover:opacity-60 transition"
						>
							View All
							<ChevronRight className="h-3.5 w-3.5" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
					{displayProducts.slice(0, 4).map((product, index) => (
						<div key={product.id} className="group">
							<div className="relative">
								<div
									aria-hidden="true"
									className="absolute inset-x-4 inset-y-6 rounded-full yns-product-halo opacity-80 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
								/>
								<div className="relative">
									<ProductCard product={product} />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
