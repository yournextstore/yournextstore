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

// No Suspense of its own: it renders inside the page's boundary so it lands with the details
// instead of streaming in after the footer has painted (CLS).
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const [inCategory, catalogue] = await Promise.all([
		getCategoryProducts(categorySlug),
		getCategoryProducts(),
	]);
	const pictured = (p: (typeof catalogue)[number]) =>
		(p.images?.length ?? 0) > 0 && p.variants.some((v) => Number(v.price) > 0);
	// Same category first, topped up from the catalogue to a full row of three (or six).
	const pool = [...inCategory.filter(pictured), ...catalogue.filter(pictured)].filter(
		(p, i, all) => p.id !== productId && all.findIndex((q) => q.id === p.id) === i,
	);
	const related = pool.slice(0, pool.length >= 6 ? 6 : 3);

	if (related.length === 0) return null;

	return (
		<ProductGrid
			gridRef="61.22°N / 149.90°W"
			eyebrow="ALSO IN THE RANGE"
			title={
				<>
					Carry it
					<br />
					with these.
				</>
			}
			products={related.slice(0, 3)}
			id="related"
		/>
	);
}
