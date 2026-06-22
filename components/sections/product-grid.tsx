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
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	eyebrow?: string;
};

export async function ProductGrid({
	title = "The Edit",
	description = "Apothecary-grade essentials, thoughtfully curated.",
	products,
	limit = 4,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "Bestsellers",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
					<div>
						<div className="font-serif text-xs tracking-[0.4em] uppercase text-muted-foreground">
							{eyebrow}
						</div>
						<h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground">{title}</h2>
						<p className="mt-3 text-muted-foreground max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 text-sm tracking-[0.25em] uppercase text-foreground border-b border-foreground/30 pb-1 hover:border-foreground transition-colors self-start sm:self-auto"
						>
							View all
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
}
