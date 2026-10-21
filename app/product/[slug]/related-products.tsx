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
		limit: 9,
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
	const related = [...new Map(products.map((p) => [p.id, p])).values()].slice(0, 4);

	if (related.length === 0) return null;

	return (
		<section className="mt-[clamp(72px,11vh,130px)] bg-lime py-[clamp(56px,9vh,100px)]">
			<div className="shell">
				<div className="mb-10 flex flex-wrap items-end justify-between gap-6">
					<h2 className="display text-section text-ink">You might also like</h2>
					<Link href="/products" className="btn btn-ghost btn-sm shrink-0">
						Shop all
					</Link>
				</div>
				<div className={LISTING_GRID}>
					{related.map((product) => (
						<ProductCard key={product.id} product={product} sizes="(max-width: 768px) 50vw, 25vw" />
					))}
				</div>
			</div>
		</section>
	);
}
