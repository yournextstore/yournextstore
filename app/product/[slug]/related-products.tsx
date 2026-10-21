import { cacheLife } from "next/cache";
import { ProductMarquee } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 9,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	if (data.length > 3 || !categorySlug) return data;
	// A thin category still gets a full row: top it up from the whole catalogue.
	const { data: more } = await commerce.productBrowse({ active: true, limit: 9 });
	return [...data, ...more.filter((p) => !data.some((d) => d.id === p.id))];
}

// No Suspense of its own: it renders inside the page's boundary, so it lands with the
// details instead of streaming in later and pushing the footer down.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 8);
	if (related.length === 0) return null;

	return <ProductMarquee title="Related products" products={related} align="start" />;
}
