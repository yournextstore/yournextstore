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
	kicker?: string;
	title?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
};

/** A centred kicker + title over a row of the original's white cards on the grey page. */
export async function ProductGrid({
	kicker = "New arrivals",
	title = "Just Landed",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;
	if (displayProducts.length === 0) return null;

	return (
		<section id="products" className="kara-container py-12">
			<div className="mb-8 flex flex-col items-center">
				<p className="mb-3 text-sm font-bold uppercase text-violet">{kicker}</p>
				<h2 className="text-center text-kara-section font-bold text-black md:text-kara-section-lg">
					{title}
				</h2>
			</div>
			<div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
				{displayProducts.map((product, index) => (
					<div key={product.id} className={index >= 4 ? "max-lg:hidden" : undefined}>
						<ProductCard product={product} />
					</div>
				))}
			</div>
			{showViewAll && (
				<div className="mt-10 flex justify-center">
					<Link
						href={viewAllHref}
						className="flex items-center gap-2 rounded bg-zinc-900 px-8 py-2.5 text-base text-white shadow-sm shadow-zinc-500 transition hover:bg-zinc-700"
					>
						View all products
						<ArrowRight className="h-4 w-4" aria-hidden="true" />
					</Link>
				</div>
			)}
		</section>
	);
}
