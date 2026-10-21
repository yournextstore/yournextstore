import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SectionHead, Watermark } from "@/components/sections/home";
import { Shelf } from "@/components/shelf";
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
	const related = [...new Map(products.map((p) => [p.id, p])).values()].slice(0, 6);

	if (related.length === 0) return null;

	return (
		<section className="relative mt-[clamp(72px,11vh,130px)] overflow-hidden">
			<Watermark className="-left-[2vw] -top-3.5">Goes with</Watermark>
			<div className="shell relative z-[1] mb-4 flex flex-wrap items-end justify-between gap-6">
				<SectionHead kicker="Goes well with" title={<>From the same shelf.</>} />
				<Link href="/products" className="btn btn-ghost shrink-0">
					All the goods <span aria-hidden="true">→</span>
				</Link>
			</div>
			<Shelf>
				{related.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						sizes="344px"
						className="tilt-card w-[clamp(260px,24vw,320px)] flex-none snap-center"
					/>
				))}
			</Shelf>
		</section>
	);
}
