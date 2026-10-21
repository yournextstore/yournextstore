import { cacheLife } from "next/cache";
import Link from "next/link";
import { BtnLabel } from "@/components/grilli/btn-label";
import { MenuCard } from "@/components/grilli/menu-card";
import { SectionHeading } from "@/components/grilli/section-heading";
import { toMenuItem } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getRelatedMenu(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({
			active: true,
			limit: 12,
			...(categorySlug ? { category: categorySlug } : {}),
		})
		.catch(() => ({ data: [] }));
	return Promise.all(data.map(toMenuItem));
}

/**
 * "You may also like" as the original's two-column menu list. Rendered inside the page's own
 * boundary (no Suspense of its own): streaming it in late would push the footer down.
 */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	// Same-category pieces first, topped up from the whole shop; pictured ones lead, and the count
	// stays even so the two ruled columns end level.
	const [inCategory, everything] = await Promise.all([
		categorySlug ? getRelatedMenu(categorySlug) : Promise.resolve([]),
		getRelatedMenu(),
	]);
	const seen = new Set([productId]);
	const merged = [...inCategory, ...everything].filter((item) => {
		if (seen.has(item.id)) return false;
		seen.add(item.id);
		return true;
	});
	const ordered = [...merged.filter((item) => item.image), ...merged.filter((item) => !item.image)];
	const items = ordered.slice(0, ordered.length >= 6 ? 6 : ordered.length - (ordered.length % 2));
	if (items.length === 0) return null;

	return (
		<section aria-labelledby="related-title" className="bg-eerie py-[70px] lg:py-[100px]">
			<div className="container-g">
				<SectionHeading
					id="related-title"
					kicker="Special Selection"
					title="You May Also Like"
					className="mb-10"
				/>
				<ul className="relative mb-[50px] grid gap-10 md:grid-cols-2 lg:gap-x-[90px] lg:before:absolute lg:before:inset-y-0 lg:before:left-1/2 lg:before:border-l lg:before:border-line lg:before:content-[''] xl:gap-x-[200px] xl:gap-y-[55px]">
					{items.map((item) => (
						<li key={item.id}>
							<MenuCard item={item} />
						</li>
					))}
				</ul>
				<Link href="/products" className="btn-g mx-auto flex">
					<BtnLabel>View All Products</BtnLabel>
				</Link>
			</div>
		</section>
	);
}
