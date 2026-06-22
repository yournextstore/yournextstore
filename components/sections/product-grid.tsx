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
	title = "Featured Selection",
	description,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background border-b border-foreground py-20 md:py-28 px-5 md:px-20">
			<div className="max-w-[1280px] mx-auto">
				<div className="text-center mb-14">
					<span className="label-caps text-[var(--color-on-surface-variant)]">Shop the edit</span>
					<h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-3 leading-tight">{title}</h2>
					{description && (
						<p className="mt-4 max-w-xl mx-auto text-[var(--color-on-surface-variant)] text-base leading-relaxed">
							{description}
						</p>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="label-caps inline-flex items-center justify-center neo-border px-8 py-4 bg-[var(--color-surface-container-lowest)] hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)] transition-colors"
						>
							View All Products
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
