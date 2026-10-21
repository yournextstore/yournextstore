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
	title = "Featured Products",
	description = "Handpicked favorites from our collection",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products">
			<div className="flex items-end justify-between gap-6 px-4 pb-5 pt-12 md:px-[2vw] md:pt-[4vw]">
				<div>
					<h2 className="text-nav">{title}</h2>
					{description ? <p className="mt-1 text-foot text-muted-foreground">{description}</p> : null}
				</div>
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="shrink-0 text-foot underline underline-offset-[0.3em] hover:no-underline"
					>
						View all
					</Link>
				)}
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-3">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
		</section>
	);
}
