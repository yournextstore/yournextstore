import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
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

/**
 * "More <category>" under the product. Rendered inside the page's own Suspense, never its own:
 * a nested boundary streams in after the footer has painted and pushes it down.
 */
export async function RelatedProducts({
	productId,
	category,
}: {
	productId: string;
	category?: { name: string; slug: string } | null;
}) {
	const products = await getCategoryProducts(category?.slug);
	const related = products.filter((p) => p.id !== productId).slice(0, 4);

	if (related.length === 0) return null;

	const href = category ? `/category/${category.slug}` : "/products";

	return (
		<section aria-labelledby="related-title" className="pt-20 sm:pt-28">
			<div className="mb-8 flex items-end justify-between gap-4">
				<h2 id="related-title" className="text-[15px] font-normal uppercase tracking-[0.26em]">
					{category ? `More ${category.name}` : "You may also like"}
				</h2>
				<Link href={href} className="link-u shrink-0 text-[10px] uppercase tracking-[0.2em]">
					View all
				</Link>
			</div>
			<div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
				{related.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
