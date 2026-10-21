import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 7,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

export function RelatedProducts(props: { productId: string; categorySlug?: string }) {
	return (
		<Suspense>
			<RelatedProductsContent {...props} />
		</Suspense>
	);
}

async function RelatedProductsContent({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 6);

	if (related.length === 0) return null;

	return (
		<section className="card mx-1 mt-1 bg-white" aria-labelledby="related-title">
			<h2 id="related-title">More pieces</h2>
			<div className="scroll-row mt-12 lg:mt-16">
				<ul className="flex">
					{related.map((product) => (
						<li key={product.id} className="w-[240px] flex-none pr-3 lg:w-[calc((100%-132px)*3/12+36px)]">
							<ProductCard product={product} sizes="(width >= 64rem) 25vw, 240px" />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
