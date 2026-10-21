import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { picturedFirst } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	kicker?: string;
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
	title = "Newest Arrivals",
	kicker = "Fresh Picks",
	products,
	limit = 4,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts =
		products ??
		picturedFirst((await commerce.productBrowse({ active: true, limit: 24 })).data).slice(0, limit);

	return (
		<section id="products" className="wrapper py-20 lg:py-28">
			<div className="mb-12 flex items-end justify-between gap-4">
				<div>
					{kicker && <p className="kicker mb-2">{kicker}</p>}
					<h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">{title}</h2>
				</div>
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gold-ink transition-colors hover:bg-accent/20"
					>
						View All <ArrowRight aria-hidden="true" className="size-4" />
					</Link>
				)}
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
