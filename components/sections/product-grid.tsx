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
	title = "The protocol",
	description = "Three formulations. One daily ritual.",
	eyebrow = "Featured",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-14">
					<div>
						<p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</p>
						<h2 className="mt-4 font-display text-[2rem] sm:text-[2.7rem] leading-[1.05] tracking-[-0.03em] text-foreground">
							{title}
						</h2>
						<p className="mt-3 max-w-md text-[0.95rem] text-muted-foreground">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-foreground/80 hover:text-foreground"
						>
							All products
							<span aria-hidden="true">→</span>
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
}
