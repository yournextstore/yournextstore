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
	overline?: string;
};

const SWATCHES = [
	"var(--tizz-orange)",
	"var(--tizz-blue)",
	"var(--tizz-yellow)",
	"var(--tizz-purple)",
	"var(--tizz-green)",
	"var(--tizz-orange)",
	"var(--tizz-blue)",
	"var(--tizz-yellow)",
];

export async function ProductGrid({
	title = "Bestsellers",
	description = "The fridge favorites. Order more than once and it's basically rationed.",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	overline = "Top of the charts",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[var(--tizz-cream)] py-16 sm:py-24">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between mb-10 flex-wrap gap-4">
					<div>
						{overline && <p className="tizz-overline text-[var(--tizz-orange)] text-xs mb-3">{overline}</p>}
						<h2 className="tizz-display text-[var(--tizz-deep)] text-4xl sm:text-5xl lg:text-6xl leading-[0.9]">
							{title}
						</h2>
						<p className="mt-3 max-w-md text-[var(--tizz-deep)]/70">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--tizz-deep)] text-[var(--tizz-cream)] tizz-overline text-xs hover:bg-[var(--tizz-orange)] transition-colors"
						>
							Shop everything →
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{displayProducts.map((product, i) => (
						<ProductCard key={product.id} product={product} swatch={SWATCHES[i % SWATCHES.length]} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--tizz-deep)] text-[var(--tizz-cream)] tizz-overline text-xs"
						>
							Shop everything →
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
