import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

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
	/** Load the first card's image eagerly. Off for grids below the fold (related products). */
	eagerFirstImage?: boolean;
};

export async function ProductGrid({
	title = "Pick your flavor",
	description = "Three feel-good crunches, zero guilt.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center mb-14">
					<p className="text-[var(--cobalt)] uppercase tracking-[0.25em] text-xs font-semibold mb-3">
						Good Stuff · Zero Fluff
					</p>
					<h2 className="font-display text-[var(--cobalt)] text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]">
						{title}
					</h2>
					<p className="mt-4 text-[var(--cobalt)]/75 max-w-xl mx-auto text-base sm:text-lg">{description}</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{displayProducts.map((product, i) => (
						<div
							key={product.id}
							className="rounded-[28px] p-4 sm:p-5 transition-transform hover:-translate-y-1 cloud-shadow"
							style={{
								backgroundColor: i % 3 === 0 ? "#e3d4f0" : i % 3 === 1 ? "#d9c8e8" : "#cbb7e0",
							}}
						>
							<ProductCard product={product} priority={eagerFirstImage && i === 0} />
						</div>
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 text-center">
						<Link
							href={viewAllHref}
							className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[var(--cobalt)] text-white text-sm font-bold uppercase tracking-wider hover:bg-[var(--cobalt-light)] transition-colors"
						>
							Shop all flavors
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
