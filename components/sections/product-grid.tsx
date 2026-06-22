import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowUpRight } from "lucide-react";
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
	asymmetric?: boolean;
	eyebrow?: string;
};

const EMPHASIS_INDEXES = new Set([1, 4]);

export async function ProductGrid({
	title = "The Edit",
	description,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	asymmetric = true,
	eyebrow,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12 lg:py-20">
				{(title || description || eyebrow) && (
					<div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
						<div>
							{eyebrow && (
								<p className="text-[11px] uppercase tracking-[0.28em] text-lilac-deep">{eyebrow}</p>
							)}
							{title && (
								<h2 className="font-display mt-2 text-3xl font-medium tracking-[-0.01em] text-foreground sm:text-4xl">
									{title}
								</h2>
							)}
							{description && (
								<p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
							)}
						</div>
						{showViewAll && (
							<YnsLink
								prefetch={"eager"}
								href={viewAllHref}
								className="group inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-foreground"
							>
								View All
								<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</YnsLink>
						)}
					</div>
				)}

				<div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
					{displayProducts.map((product, index) => {
						const tall = asymmetric && EMPHASIS_INDEXES.has(index % 6);
						return (
							<div key={product.id} className={tall ? "row-span-2 [&_.product-card-image]:aspect-[3/5]" : ""}>
								<ProductCard product={product} />
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
