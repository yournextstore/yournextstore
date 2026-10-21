import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ChevronRightIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { cn } from "@/lib/utils";

export type Product = APIProductsBrowseResult["data"][number];
type AnyProduct =
	| Product
	| APICollectionGetByIdResult["productCollections"][number]["product"]
	| NonNullable<APIProductGetByIdResult>;

/** The template's card grid: one white card, cells split by hairlines (box-shadow, clipped at the edge). */
export function ProductCells({
	products,
	className,
	priorityCount = 1,
	headingLevel = "h3",
}: {
	products: AnyProduct[];
	className?: string;
	priorityCount?: number;
	headingLevel?: "h2" | "h3";
}) {
	return (
		<ul
			className={cn(
				"uk-card grid grid-cols-1 overflow-hidden sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				className,
			)}
		>
			{products.map((product, index) => (
				<li key={product.id} className="shadow-[1px_0_0_var(--border),0_1px_0_var(--border)]">
					<ProductCard product={product} priority={index < priorityCount} headingLevel={headingLevel} />
				</li>
			))}
		</ul>
	);
}

type ProductGridProps = {
	title?: string;
	products?: AnyProduct[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	viewAllLabel?: string;
	className?: string;
};

export async function ProductGrid({
	title = "Trending items",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	viewAllLabel = "Shop all",
	className,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className={cn("uk-section", className)}>
			<div className="uk-container">
				<h2 className="mb-10 text-center text-uk-h2 lg:text-[2rem]">{title}</h2>
				<ProductCells products={displayProducts} />
				{showViewAll && (
					<p className="mt-10 text-center">
						<Link href={viewAllHref} className="uk-link-all">
							{viewAllLabel}
							<ChevronRightIcon aria-hidden className="size-3" strokeWidth={1.5} />
						</Link>
					</p>
				)}
			</div>
		</section>
	);
}
