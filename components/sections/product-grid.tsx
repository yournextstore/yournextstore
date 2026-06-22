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
	title = "Pick your flavor",
	description = "Cold-brewed, cow-approved.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-background border-b-2 border-foreground/10">
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
					<div className="max-w-xl">
						<p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-pink)] mb-3">
							The lineup
						</p>
						<h2 className="display text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]">{title}</h2>
						<p className="mt-3 text-foreground/70 text-base sm:text-lg">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="self-start inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-foreground hover:text-[var(--color-leaf-deep)] transition-colors group"
						>
							Shop all
							<span aria-hidden className="transition-transform group-hover:translate-x-1">
								→
							</span>
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{displayProducts.map((product, i) => (
						<ProductCard key={product.id} product={product} index={i} />
					))}
				</div>
			</div>
		</section>
	);
}
