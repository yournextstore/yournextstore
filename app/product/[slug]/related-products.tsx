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
		<section className="mt-[clamp(4rem,9vw,7rem)]">
			<div className="mb-9 flex flex-wrap items-end justify-between gap-6">
				<div>
					<p className="kicker mb-4">[ More from the shelf ]</p>
					<h2 className="text-section">
						Worth a <em className="swipe">second look.</em>
					</h2>
				</div>
				<Link href="/products" className="btn btn-ghost">
					The whole range <span aria-hidden="true">→</span>
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
