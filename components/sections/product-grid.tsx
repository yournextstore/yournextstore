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
	title = "The catalog",
	description = "Built around the way people actually move.",
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
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
					<div className="max-w-2xl">
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ink/60">
							<span className="block h-px w-8 bg-brick" />
							No. 01 — The Catalog
						</span>
						<h2 className="font-display-wide text-[clamp(2rem,5vw,4rem)] leading-[0.95] uppercase mt-4 text-balance">
							{title}
						</h2>
						<p className="mt-4 text-base text-muted-foreground max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="self-start sm:self-end inline-flex items-center gap-2 px-5 h-11 border border-ink text-[11px] tracking-[0.28em] uppercase font-medium hover:bg-ink hover:text-bone transition-colors"
						>
							View all
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
					{displayProducts.map((product, idx) => (
						<div key={product.id} className="group">
							<div className="flex items-center justify-between mb-3 text-[10px] tracking-[0.3em] uppercase text-ink/50">
								<span>No. {String(idx + 1).padStart(2, "0")}</span>
								<span className="block h-px flex-1 mx-3 bg-ink/15" />
								<span>The Edit</span>
							</div>
							<ProductCard product={product} priority={idx === 0} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
