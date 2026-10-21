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
	const related = [...new Map(products.map((p) => [p.id, p])).values()].slice(0, 4);

	if (related.length === 0) return null;

	return (
		<section className="ledger-rule mt-[clamp(80px,12vh,150px)] pt-[clamp(48px,8vh,90px)] [--rule-inset:0px]">
			<div className="mb-10 flex items-end justify-between gap-6">
				<div>
					<p className="kicker mb-[1.2rem]">Nº 03 — From the same shelf</p>
					<h2 className="display text-[clamp(2.1rem,4vw,3rem)] leading-[1.04] text-cream">
						Keep it <em>alongside.</em>
					</h2>
				</div>
				<div className="hidden shrink-0 sm:block">
					<Link href="/products" className="btn [--btn-px:18px] [--btn-py:10px]">
						The whole ledger <span aria-hidden="true">→</span>
					</Link>
				</div>
			</div>
			<div className={LISTING_GRID}>
				{related.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
