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
	eyebrow?: string;
};

export async function ProductGrid({
	title = "The Collection",
	description = "Considered objects, photographed in natural light.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "Vol. 07 · Featured",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				{/* Editorial header */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
					<div className="lg:col-span-7">
						<p className="editorial-eyebrow text-muted-foreground">{eyebrow}</p>
						<h2 className="mt-4 font-display italic tracking-tight text-foreground text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
							{title}
						</h2>
					</div>
					<div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-border/70 flex flex-col gap-4">
						<p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
						{showViewAll && (
							<YnsLink
								prefetch={"eager"}
								href={viewAllHref}
								className="inline-flex w-fit items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] font-medium border-b border-foreground/40 hover:border-foreground transition-colors pb-0.5"
							>
								View the full index
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={1.5}
									className="h-3.5 w-3.5"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
								</svg>
							</YnsLink>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} index={index} />
					))}
				</div>
			</div>
		</section>
	);
}
