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
};

export async function ProductGrid({
	title = "Loved by every body",
	eyebrow = "Best Sellers",
	description = "The cult favorites — silky-soft, second-skin, and made to move with you.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
				<div>
					<span className="text-[11px] tracking-[0.28em] uppercase text-magenta font-semibold">
						{eyebrow}
					</span>
					<h2 className="mt-2 font-display text-4xl sm:text-5xl text-foreground tracking-tight leading-tight">
						{title}
					</h2>
					<p className="mt-3 max-w-md text-[15px] text-muted-foreground leading-relaxed">{description}</p>
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-2 self-end rounded-full border border-foreground/15 px-5 py-2.5 text-[12px] font-semibold tracking-[0.18em] uppercase text-foreground hover:bg-blush-soft hover:border-magenta hover:text-magenta transition-all"
					>
						Shop all
						<ArrowRight className="h-3.5 w-3.5" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 sm:gap-x-8">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center sm:hidden">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-sm font-medium text-magenta hover:text-magenta-deep transition-colors"
					>
						View all products
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
