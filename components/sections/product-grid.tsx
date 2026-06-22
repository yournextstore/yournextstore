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
};

export async function ProductGrid({
	title = "The Hot Shelf",
	description = "Small batch, big mouth. Available until the pot runs dry.",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-background">
			<div
				aria-hidden
				className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/30 to-transparent"
			/>
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
					<div>
						<span className="inline-flex items-center gap-3 text-[11px] font-condensed tracking-[0.32em] text-ember">
							<span aria-hidden className="h-px w-10 bg-ember/60" />
							The Pantry
						</span>
						<h2 className="mt-4 font-display text-5xl sm:text-6xl text-soot leading-[1.02]">{title}</h2>
						<p className="mt-3 text-muted-foreground max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 font-condensed text-xs tracking-[0.22em] text-soot border-b-2 border-ember pb-1 hover:text-ember transition-colors"
						>
							All Sauces
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 font-condensed text-xs tracking-[0.22em] text-soot border-b-2 border-ember pb-1"
						>
							All Sauces <ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
