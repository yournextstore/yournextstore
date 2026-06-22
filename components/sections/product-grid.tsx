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
	title = "New Releases",
	description = "This week's freshest picks — handpicked from the YNS catalog.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "The Catalog",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="border-b-2 border-foreground bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-20">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
					<div>
						<div className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/60 mb-3">
							{eyebrow}
						</div>
						<h2 className="font-display uppercase text-3xl sm:text-5xl lg:text-6xl leading-[0.95] text-foreground">
							{title}
						</h2>
						<p className="mt-3 text-muted-foreground max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink prefetch={"eager"} href={viewAllHref} className="yns-btn-pill self-start sm:self-auto">
							View all
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
					{displayProducts.map((product, i) => (
						<div key={product.id} className="relative">
							<div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 text-foreground/50 flex items-center justify-between">
								<span>YNS · {String(i + 1).padStart(2, "0")}</span>
								<span className="h-1.5 w-1.5 rounded-full bg-[#d4ff3a] border border-foreground" />
							</div>
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
