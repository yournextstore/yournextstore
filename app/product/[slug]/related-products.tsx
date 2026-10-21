import { cacheLife } from "next/cache";
import { ProductGrid } from "@/components/sections/product-grid";
import { Separator } from "@/components/separator";
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

// No Suspense of its own: it renders inside the page's boundary, so it lands with the
// details instead of streaming in after the footer has painted (layout shift).
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
		<>
			<Separator className="my-8" />
			<ProductGrid
				title="More products"
				description="Other things you might like from the shop."
				products={related}
				showViewAll
			/>
		</>
	);
}
