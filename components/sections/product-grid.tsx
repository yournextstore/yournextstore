import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	description?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
};

export async function ProductGrid({
	title = "The Collection",
	description = "Field-tested, workshop-built.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[color:var(--color-yns-cream)]">
			<div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 lg:mb-14 border-b border-[color:var(--color-yns-ink)]/15 pb-8">
					<div>
						<p className="text-xs tracking-utility font-semibold text-[color:var(--color-yns-wood)] mb-3">
							CHAPTER 03 — THE GOODS
						</p>
						<h2 className="font-display text-4xl sm:text-5xl lg:text-[64px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-[color:var(--color-yns-ink)]">
							{title}
						</h2>
						<p className="mt-3 text-base text-[color:var(--color-yns-ink)]/65">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-3 text-[11px] tracking-utility font-bold text-[color:var(--color-yns-ink)] border-b-2 border-[color:var(--color-yns-ink)] pb-1.5 hover:border-[color:var(--color-yns-wood)] hover:text-[color:var(--color-yns-wood)] transition-colors self-end"
						>
							SHOP ALL
							<span aria-hidden="true">&rarr;</span>
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[color:var(--color-yns-ink)]/10 border border-[color:var(--color-yns-ink)]/10">
					{displayProducts.map((product, index) => (
						<div key={product.id} className="bg-[color:var(--color-yns-cream)] p-3 sm:p-5">
							<ProductCard product={product} />
						</div>
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 text-[11px] tracking-utility font-bold text-[color:var(--color-yns-ink)] border-b-2 border-[color:var(--color-yns-ink)] pb-1.5"
						>
							SHOP ALL
							<span aria-hidden="true">&rarr;</span>
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
