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
	title = "The lineup",
	description,
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "EVERY FLAVOR. EVERY BOX.",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-espresso">
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
				<div className="text-center mb-14 sm:mb-20">
					{eyebrow && (
						<p className="font-display tracking-[0.32em] text-[11px] text-bronze-light mb-5">{eyebrow}</p>
					)}
					<h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-cream leading-[0.9]">{title}</h2>
					{description && <p className="mt-5 text-cream/60 max-w-xl mx-auto">{description}</p>}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-16 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center justify-center h-12 px-10 border border-cream/30 text-cream font-display tracking-[0.18em] text-sm hover:border-bronze-light hover:text-bronze-light transition-colors"
						>
							SHOP EVERYTHING →
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
