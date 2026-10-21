import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { ProductRail } from "@/components/product-rail";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards. Too few in the category →
// the rest of the catalog fills the row.
async function getSimilarProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const [inCategory, latest] = await Promise.all([
		categorySlug
			? commerce.productBrowse({ active: true, limit: 9, category: categorySlug }).catch(() => ({ data: [] }))
			: Promise.resolve({ data: [] }),
		commerce.productBrowse({ active: true, limit: 9 }).catch(() => ({ data: [] })),
	]);
	const seen = new Set<string>();
	return [...inCategory.data, ...latest.data].filter((product) => {
		if (seen.has(product.id)) return false;
		seen.add(product.id);
		return true;
	});
}

// No Suspense of its own: it renders inside the page's boundary, so it cannot stream in
// after the footer has painted and push it down.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getSimilarProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 8);

	if (related.length === 0) return null;

	return (
		<section className="py-16">
			<h2 className="mb-8 text-2xl tracking-tight text-ink">Similar products</h2>
			<ProductRail label="Similar products">
				{related.map((product) => (
					<div key={product.id} className="w-[calc(50%-0.5rem)] shrink-0 snap-start md:w-[calc(25%-0.75rem)]">
						<ProductCard product={product} sizes="(max-width: 768px) 50vw, 240px" />
					</div>
				))}
			</ProductRail>
		</section>
	);
}
