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
	title = "The Family",
	description = "A coordinated set of objects, built to outlast trends.",
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
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12">
					<div className="max-w-2xl">
						<span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
							§ 01 — Catalog
						</span>
						<h2 className="mt-3 display-headline text-[clamp(2rem,5vw,3.5rem)] text-foreground">{title}</h2>
						<p className="mt-4 text-base text-muted-foreground max-w-lg">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] font-medium text-foreground hover:text-muted-foreground transition-colors"
						>
							All Products
							<span aria-hidden>→</span>
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-10 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] font-medium text-foreground"
						>
							All Products
							<span aria-hidden>→</span>
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
