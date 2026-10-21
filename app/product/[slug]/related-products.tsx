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

// No Suspense of its own: a nested boundary streams in after the footer has painted and pushes it
// down. It renders inside the product page's boundary instead (the browse is cached).
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const inCategory = (await getCategoryProducts(categorySlug)).filter((p) => p.id !== productId);
	// Thin categories (one or two products) top up from the whole catalogue.
	const topUp =
		inCategory.length < 4 && categorySlug
			? (await getCategoryProducts()).filter(
					(p) => p.id !== productId && !inCategory.some((c) => c.id === p.id),
				)
			: [];
	const related = [...inCategory, ...topUp].slice(0, 6);

	if (related.length === 0) return null;

	return <ProductGrid title="You might also like" products={related} showViewAll={false} layout="carousel" />;
}
