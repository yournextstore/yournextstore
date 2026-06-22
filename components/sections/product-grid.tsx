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
	title = "Pick your flavor",
	description = "Real fruit, real wobble — handpicked favorites from the snack aisle.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-[var(--background)]">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
					<div>
						<p className="font-display text-xs uppercase tracking-[0.3em] text-[var(--pink)]">The Lineup</p>
						<h2 className="mt-3 font-display text-3xl sm:text-5xl uppercase leading-[1] text-[var(--purple-deep)]">
							{title}
						</h2>
						<p className="mt-3 max-w-xl text-base text-[var(--purple-deep)]/70">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[var(--pink)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-pop transition-transform hover:scale-[1.03]"
						>
							Shop all <span aria-hidden>▸</span>
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{displayProducts.map((product, i) => (
						<ProductCard key={product.id} product={product} index={i} />
					))}
				</div>
			</div>
		</section>
	);
}
