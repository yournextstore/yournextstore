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
	title = "Shop the Flavors",
	description,
	eyebrow,
	products,
	limit = 3,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-cream-section py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
				<div className="text-center mb-14">
					{eyebrow && <p className="font-script text-2xl text-terracotta mb-3">{eyebrow}</p>}
					<h2 className="font-display text-4xl sm:text-5xl text-espresso">{title}</h2>
					{description && (
						<p className="mt-4 text-espresso/65 max-w-xl mx-auto leading-relaxed">{description}</p>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-16 text-center">
						<YnsLink prefetch={"eager"} href={viewAllHref} className="btn-outline-espresso">
							View All Products
							<ArrowRight className="h-3 w-3" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
