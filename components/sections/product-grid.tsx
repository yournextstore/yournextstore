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
	title = "Featured products",
	description = "Pieces in the season's quiet rotation.",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex items-end justify-between border-b hairline pb-6 mb-12">
					<div>
						<p className="eyebrow text-[var(--clay)] mb-3">The collection</p>
						<h2 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.05]">
							{title}
						</h2>
						<p className="mt-3 text-foreground/60 max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 text-[0.7rem] tracking-[0.2em] uppercase text-foreground/70 hover:text-foreground border-b hairline pb-1 transition-colors"
						>
							View archive
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.2em] uppercase text-foreground/70 hover:text-foreground border-b hairline pb-1 transition-colors"
						>
							View archive
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
