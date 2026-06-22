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
	eyebrow?: string;
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
	title = "Flagship blends",
	description,
	eyebrow = "The collection",
	products,
	limit = 3,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 sm:py-24">
				<div className="text-center max-w-2xl mx-auto">
					<p className="text-[11px] tracking-[0.4em] uppercase text-[color:var(--color-yns-blue-400)]">
						{eyebrow}
					</p>
					<h2 className="mt-5 font-serif font-light text-4xl sm:text-5xl text-[color:var(--color-yns-navy)] leading-[1.05]">
						{title}
					</h2>
					{description && (
						<p className="mt-5 text-base text-[color:var(--color-yns-navy)]/65 leading-relaxed">
							{description}
						</p>
					)}
				</div>

				<div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 text-[12px] tracking-[0.32em] uppercase text-[color:var(--color-yns-navy)] border-b border-[color:var(--color-yns-navy)] pb-1 hover:gap-3 transition-all"
						>
							Shop all blends
							<span aria-hidden="true">→</span>
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
