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
	title = "Featured Drinks",
	description = "Crisp, clean, never sugary. Crack one open.",
	eyebrow = "Shop The Bar",
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
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
					<div>
						<p className="text-xs uppercase tracking-[0.35em] font-bold text-fizz-sky mb-3">{eyebrow}</p>
						<h2 className="font-display uppercase text-fizz-ink text-3xl sm:text-5xl leading-[0.95] tracking-tight">
							{title}
						</h2>
						<p className="mt-3 text-base sm:text-lg text-fizz-ink/70 font-medium max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="self-start sm:self-end inline-flex items-center justify-center px-6 h-11 rounded-full bg-fizz-ink text-fizz-yellow text-sm font-bold hover:bg-fizz-berry transition-colors"
						>
							View all
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>
			</div>
		</section>
	);
}
