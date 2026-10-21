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
};

export async function ProductGrid({
	title = "Featured pieces",
	products,
	limit = 4,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="mx-auto max-w-6xl px-5 py-4 sm:py-14">
			<div className="flex items-baseline justify-between gap-4">
				<h2 className="text-[24px] font-bold tracking-tight">{title}</h2>
				{showViewAll && (
					<Link href={viewAllHref} className="shrink-0 text-[14px] text-muted-foreground hover:text-ink">
						View all
					</Link>
				)}
			</div>
			<div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
