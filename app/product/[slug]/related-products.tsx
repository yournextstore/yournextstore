import { cacheLife } from "next/cache";
import Link from "next/link";
import { RuleSquiggle } from "@/components/garden/icons";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { picturedFirst } from "@/lib/garden";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards. Topped up from the whole
// catalogue so a small category still fills the row.
async function getRelatedPool(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const [inCategory, everything] = await Promise.all([
		categorySlug
			? commerce.productBrowse({ active: true, limit: 5, category: categorySlug }).catch(() => ({ data: [] }))
			: Promise.resolve({ data: [] }),
		commerce.productBrowse({ active: true, limit: 9 }).catch(() => ({ data: [] })),
	]);
	const seen = new Set<string>();
	return picturedFirst([...inCategory.data, ...everything.data]).filter((p) =>
		seen.has(p.id) ? false : seen.add(p.id),
	);
}

// No Suspense of its own: it renders inside the page's boundary so it can't push the footer later.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getRelatedPool(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 4);

	if (related.length === 0) return null;

	return (
		<section className="section featured rip rip--top" aria-labelledby="related-title">
			<div className="wrap">
				<div className="featured__inner">
					<div className="featured__intro">
						<div className="inline-block">
							<span className="eyebrow-script">You might also like</span>
							<RuleSquiggle className="hand-rule" width={90} height={9} />
						</div>
						<h2 id="related-title">
							More From
							<br />
							the Shop
						</h2>
						<p>Trees and tools that go well with this one.</p>
						<Link className="btn btn-cut" href="/products">
							View All <span className="arw">&rarr;</span>
						</Link>
					</div>
					<div className="featured__row">
						{related.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
