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
		<section className="mt-[100px]">
			<div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-4">
				<div>
					<p className="eyebrow mb-5">Something to pair</p>
					<h2 className="type-display text-[clamp(2.4rem,4vw,3.4rem)]">
						You may also <i>love</i>
					</h2>
				</div>
				<Link href="/products" className="link-underline hidden shrink-0 sm:inline-flex">
					Shop all <span aria-hidden="true">→</span>
				</Link>
			</div>
			<div className={LISTING_GRID}>
				{related.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
