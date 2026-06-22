import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowUpRightIcon } from "lucide-react";
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
	showViewAll?: boolean;
	viewAllHref?: string;
};

export async function ProductGrid({
	eyebrow = "— Bestsellers",
	title = "Most Loved Pieces",
	description = "Quietly considered objects, ranked by your living rooms.",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
				<div>
					<p className="text-xs tracking-[0.22em] uppercase text-muted-foreground mb-3">{eyebrow}</p>
					<h2 className="yns-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.02]">
						{title}
					</h2>
					<p className="mt-3 text-muted-foreground max-w-md">{description}</p>
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
					>
						View all
						<ArrowUpRightIcon className="h-4 w-4" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center sm:hidden">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium"
					>
						View all products
						<ArrowUpRightIcon className="h-4 w-4" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
