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
	title = "Featured Products",
	description = "Handpicked favorites from our collection",
	eyebrow,
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	if (displayProducts.length === 0) {
		return null;
	}

	return (
		<section id="products" className="relative bg-background">
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
			<div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 sm:py-32">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
					<div className="max-w-xl">
						{eyebrow && (
							<p className="font-sans text-[11px] uppercase tracking-[0.4em] text-muted-foreground mb-4">
								{eyebrow}
							</p>
						)}
						<h2 className="font-serif text-4xl sm:text-5xl font-light leading-tight">{title}</h2>
						<p className="mt-4 text-muted-foreground font-light">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors group"
						>
							View all
							<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>
			</div>
		</section>
	);
}
