import { cacheLife } from "next/cache";
import { ProductCells } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 5,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

/** Rendered without its own Suspense boundary: it streams with the page, so nothing shifts after. */
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
		<section className="mt-10 lg:mt-[70px]">
			<h2 className="mb-5 text-uk-h2">Related products</h2>
			<ProductCells products={related} priorityCount={0} />
		</section>
	);
}
