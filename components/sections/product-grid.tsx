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
	title = "The Flavor Lineup",
	description = "Three formulas. One mission. Replace what you sweat.",
	eyebrow = "— 01 / Range",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative granite py-24 sm:py-32 border-t border-white/5">
			<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
					<div>
						<div className="text-[10px] tracking-[0.32em] uppercase text-lilac mb-6">{eyebrow}</div>
						<h2 className="font-display font-light text-bone text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em] max-w-2xl">
							{title}
						</h2>
						<p className="mt-5 text-foreground/65 max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="self-start sm:self-end text-[11px] tracking-[0.25em] uppercase text-foreground/70 hover:text-bone transition-colors"
						>
							View all →
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{displayProducts.map((product, i) => (
						<ProductCard key={product.id} product={product} index={i} />
					))}
				</div>
			</div>
		</section>
	);
}
