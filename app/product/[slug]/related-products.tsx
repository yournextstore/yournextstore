import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getCatalogProducts, pad2 } from "@/lib/catalog";

/** Same room first, then the rest of the catalogue, so a one-piece room still gets three. */
async function getRelated(productId: string, categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const products = (await getCatalogProducts()).filter((p) => p.id !== productId);
	const sameRoom = products.filter((p) => categorySlug && p.category?.slug === categorySlug);
	const others = products.filter((p) => !sameRoom.includes(p));
	return { related: [...sameRoom, ...others].slice(0, 3), total: products.length + 1 };
}

// Rendered without its own Suspense: inside the page's boundary it lands with the details,
// instead of streaming in after the footer has painted and pushing it down.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const { related, total } = await getRelated(productId, categorySlug);
	if (related.length === 0) return null;

	return (
		<section className="mt-32 md:mt-44">
			<div
				className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t border-border pt-8"
				data-reveal
			>
				<h2 className="type-h2 max-w-[16ch]">Pieces that sit well together</h2>
				<Link href="/products" className="link link-mono pb-1.5 text-muted-foreground">
					All {pad2(total)} pieces
				</Link>
			</div>
			<div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 md:mt-14 md:grid-cols-3">
				{related.map((product, index) => (
					<ProductCard key={product.id} product={product} headingLevel="h3" revealDelay={index * 110} />
				))}
			</div>
		</section>
	);
}
