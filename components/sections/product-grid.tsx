import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SectionTitle } from "@/components/sections/home-sections";
import { commerce } from "@/lib/commerce";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	/** A grid directly under the page's h1 carries its own sr-only heading instead of a visible one. */
	hideTitle?: boolean;
};

export async function ProductGrid({
	title = "Featured products",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	hideTitle = false,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="py-[75px] md:py-[120px]">
			<div className="sp-container">
				{hideTitle ? <h2 className="sr-only">{title}</h2> : <SectionTitle>{title}</SectionTitle>}
				{displayProducts.length === 0 ? (
					<p className="py-12 text-center text-sp-8">No products here yet.</p>
				) : (
					<ul className="grid gap-x-6 gap-y-[60px] md:grid-cols-2 sp-xl:grid-cols-3">
						{displayProducts.map((product, index) => (
							<li key={product.id}>
								<ProductCard product={product} priority={hideTitle && index === 0} />
							</li>
						))}
					</ul>
				)}
				{showViewAll && (
					<div className="mt-[60px] flex justify-center">
						<Link href={viewAllHref} className="btn-brut btn-orange">
							View all products
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
