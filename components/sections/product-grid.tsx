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
	tone?: "default" | "stone";
};

export async function ProductGrid({
	title = "Best Sellers",
	description = "Apothecary essentials in amber glass and minimal aluminum.",
	eyebrow = "The Catalogue",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	tone = "default",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const bg = tone === "stone" ? "bg-[#F2F2F0]" : "bg-background";

	return (
		<section id="products" className={`${bg} border-t border-border/70`}>
			<div className="px-4 sm:px-8 lg:px-12 py-20 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
					<div>
						{eyebrow && (
							<p className="uppercase-display text-[10.5px] tracking-[0.24em] text-muted-foreground">
								{eyebrow}
							</p>
						)}
						<h2 className="mt-3 uppercase-display text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
							{title}
						</h2>
						{description && <p className="mt-3 max-w-md text-foreground/70 leading-relaxed">{description}</p>}
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 uppercase-display text-[11px] tracking-[0.22em] text-foreground border-b border-foreground pb-1 hover:text-foreground/70 transition-colors"
						>
							View all
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-1 uppercase-display text-[11px] tracking-[0.22em] text-foreground border-b border-foreground pb-1"
						>
							View all products
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
