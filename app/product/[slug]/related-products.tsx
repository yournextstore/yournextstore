import { cacheLife } from "next/cache";
import { ProductGrid } from "@/components/sections/product-grid";
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

// No Suspense of its own: it renders inside the page's boundary, so it cannot stream in
// after the footer has painted and push it down.
export function RelatedProducts(props: { productId: string; categorySlug?: string }) {
	return <RelatedProductsContent {...props} />;
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
		<ProductGrid
			title="You Might Also Like"
			kicker="From the Shelf"
			products={related.slice(0, 4)}
			showViewAll={false}
		/>
	);
}
