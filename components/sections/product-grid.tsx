import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	viewAllLabel?: string;
};

export async function ProductGrid({
	title = "Featured",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	viewAllLabel = "View all",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section className="mx-auto max-w-[1640px] px-4 pt-20 sm:px-5 sm:pt-28 lg:px-9">
			<div className="mb-8 flex items-end justify-between gap-4">
				<h2 className="text-[15px] font-normal uppercase tracking-[0.26em]">{title}</h2>
				{showViewAll && (
					<Link href={viewAllHref} className="link-u shrink-0 text-[10px] uppercase tracking-[0.2em]">
						{viewAllLabel}
					</Link>
				)}
			</div>
			<div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
