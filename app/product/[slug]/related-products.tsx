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

// No Suspense of its own: it renders inside the product page's boundary, so it lands with the
// details instead of streaming in after the footer has painted and pushing it down.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 4);

	if (related.length === 0) return null;

	return (
		<div className="-mx-4">
			{/* Four fill the two-column phone grid; the fourth hides where the grid has three columns. */}
			<ProductGrid
				title="You may also like"
				products={related}
				showViewAll={false}
				gridClassName="lg:[&>*:nth-child(4)]:hidden"
			/>
		</div>
	);
}
