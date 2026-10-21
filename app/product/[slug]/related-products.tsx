import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { Em } from "@/components/brand/em";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 4,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

export function RelatedProducts(props: { productId: string; categorySlug?: string; categoryName?: string }) {
	return (
		<Suspense>
			<RelatedProductsContent {...props} />
		</Suspense>
	);
}

/** "More from the … family": the rest of the product's category as scent cards. */
async function RelatedProductsContent({
	productId,
	categorySlug,
	categoryName,
}: {
	productId: string;
	categorySlug?: string;
	categoryName?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 3);

	if (related.length === 0) return null;

	return (
		<section className="container-page pb-24 md:pb-32">
			<h2 className="font-display text-title-lg md:text-title-xl">
				{categoryName ? (
					<>
						More from <Em>{categoryName.toLowerCase()}</Em>
					</>
				) : (
					<>
						You might <Em>also like</Em>
					</>
				)}
			</h2>
			<div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
				{related.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
