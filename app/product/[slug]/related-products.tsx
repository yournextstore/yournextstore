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

// No Suspense of its own: it renders inside the product page's boundary, so it lands
// together with the details instead of pushing the footer after first paint.
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
		<section className="section">
			<div className="shell">
				<div className="mb-6 text-center md:mb-14">
					<h2 className="cp-h2 mb-2">Related Products</h2>
				</div>
				<div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
					{related.map((product) => (
						<ProductCard key={product.id} product={product} compact />
					))}
				</div>
				<div className="mt-8 flex justify-center md:mt-14">
					<Link href="/products" className="cp-btn cp-btn-sm md:cp-btn-lg font-medium">
						+ See All Products
					</Link>
				</div>
			</div>
		</section>
	);
}
