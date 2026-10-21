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
};

export async function ProductGrid({
	title = "Featured products",
	description = "Discover our new arrivals",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	columns = "lg:grid-cols-5",
}: ProductGridProps & { columns?: string }) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="py-14 md:py-16">
			<div className="mb-9 text-center">
				<p className="eyebrow mb-2">{description}</p>
				<h2 className="font-heading text-3xl font-semibold text-ink md:text-[2.4rem]">{title}</h2>
			</div>

			<div className={`grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 ${columns}`}>
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center">
					<Link
						href={viewAllHref}
						className="inline-flex items-center gap-1 font-heading text-[15px] text-ink transition-colors hover:text-pine"
					>
						View all products
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				</div>
			)}
		</section>
	);
}
