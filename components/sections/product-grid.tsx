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
	title = "The Bestsellers",
	description = "Liquid jewels coveted by collectors and connoisseurs alike.",
	eyebrow = "Editor's Edit",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-luxe-canvas">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-luxe-violet)]">
							{eyebrow}
						</p>
						<h2 className="mt-3 font-display text-5xl sm:text-6xl tracking-tight text-foreground">{title}</h2>
						<p className="mt-3 max-w-md text-sm text-muted-foreground">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex h-11 items-center gap-2 self-start rounded-full border border-foreground/20 bg-white/60 px-5 text-sm font-semibold text-foreground backdrop-blur transition-all hover:bg-foreground hover:text-background sm:self-end"
						>
							View all
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
}
