import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { LISTING_GRID } from "@/components/product-grid-skeleton";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 6,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

// No Suspense boundary of its own: it renders inside the page's boundary, so it lands with
// the details instead of streaming in after the footer has painted (CLS).
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const inCategory = (await getCategoryProducts(categorySlug)).filter((p) => p.id !== productId);
	// A thin category leaves too little to suggest: top up with the newest pieces in the shop.
	const products =
		inCategory.length >= 3 || !categorySlug
			? inCategory
			: [...inCategory, ...(await getCategoryProducts()).filter((p) => p.id !== productId)];
	const related = [...new Map(products.map((p) => [p.id, p])).values()].slice(0, 3);

	if (related.length === 0) return null;

	return (
		<section aria-labelledby="pairs-title" className="rule-top mt-16 pt-16">
			<h2 id="pairs-title" className="section-title">
				Pairs Well With
			</h2>
			<div className={LISTING_GRID}>
				{related.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
			<div className="mt-12 text-center">
				<Link href="/products" className="btn">
					The full menu <span aria-hidden="true">→</span>
				</Link>
			</div>
		</section>
	);
}
