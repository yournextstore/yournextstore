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
	title = "Best sellers",
	description = "The pops the whole pool deck keeps texting about.",
	eyebrow = "Featured drops",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-14 gap-4">
					<div>
						<p className="text-[11px] uppercase tracking-[0.28em] font-semibold text-primary">{eyebrow}</p>
						<h2 className="mt-2 font-display text-4xl sm:text-5xl uppercase text-pop-ink leading-[0.95]">
							{title}
						</h2>
						<p className="mt-3 text-pop-ink/70 max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-pop-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] font-semibold text-white hover:bg-primary transition-colors"
						>
							Shop all →
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
}
