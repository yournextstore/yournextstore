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
	variant?: "hub" | "grid";
};

export async function ProductGrid({
	title = "Product Hub",
	eyebrow = "Curated for you",
	description = "Discover the season's bestselling essentials, lovingly chosen for every nursery and little adventurer.",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	variant = "hub",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	if (variant === "grid") {
		return (
			<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
					<div>
						<p className="text-xs uppercase tracking-[0.25em] text-brand/60 mb-3">{eyebrow}</p>
						<h2 className="font-display text-3xl sm:text-4xl text-foreground">{title}</h2>
						{description && <p className="mt-3 text-muted-foreground max-w-md">{description}</p>}
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/70 transition-colors"
						>
							View all products
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</section>
		);
	}

	return (
		<section id="products" className="bg-cream/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
					<div className="max-w-xl">
						<h2 className="font-display text-3xl sm:text-4xl text-brand">{title}</h2>
						<p className="mt-3 text-sm text-brand/70 leading-relaxed">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="self-start sm:self-auto inline-flex items-center gap-1 h-10 px-5 rounded-full bg-brand/10 text-brand text-sm font-medium hover:bg-brand/15 transition-colors"
						>
							All Products
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{displayProducts.slice(0, 8).map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
}
