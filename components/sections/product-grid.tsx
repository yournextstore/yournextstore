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
	title = "The Menu",
	description = "A curated rotation of seating, objects and editions in stock today.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "Vol. 01",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-background">
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-12 gap-6 items-end mb-12 sm:mb-16">
					<div className="col-span-12 md:col-span-8">
						<div className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground mb-4 flex items-center gap-3">
							<span aria-hidden className="block h-px w-8 bg-foreground" />
							<span className="text-accent/80">(</span>
							<span className="px-1">{eyebrow}</span>
							<span className="text-accent/80">)</span>
						</div>
						<h2 className="font-editorial italic font-light text-5xl md:text-6xl leading-[0.95] tracking-tight text-foreground">
							{title}
						</h2>
						<p className="mt-4 font-grotesk text-sm text-muted-foreground max-w-md">{description}</p>
					</div>
					<div className="col-span-12 md:col-span-4 md:text-right">
						{showViewAll && (
							<YnsLink
								prefetch={"eager"}
								href={viewAllHref}
								className="inline-flex items-center gap-2 font-grotesk text-[11px] uppercase tracking-eyebrow text-foreground border-b border-foreground/70 pb-1 hover:gap-3 transition-all"
							>
								the full archive
								<ArrowRight className="h-3.5 w-3.5" />
							</YnsLink>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
					{displayProducts.map((product, idx) => (
						<div key={product.id} className="relative">
							<div
								aria-hidden="true"
								className="absolute -top-3 -left-2 font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 z-10"
							>
								{String(idx + 1).padStart(2, "0")} <span className="text-accent/70">/</span>{" "}
								{String(displayProducts.length).padStart(2, "0")}
							</div>
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
