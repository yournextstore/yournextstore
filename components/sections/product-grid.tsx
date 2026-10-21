import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { Search, SlidersHorizontal } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_GRID_CLASS } from "@/components/product-grid-skeleton";
import { commerce } from "@/lib/commerce";
import { photographedFirst } from "@/lib/shop";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	headingLevel?: "h1" | "h2";
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
};

/** The original's "STORE" bar: an uppercase title on the left, small icon links on the right. */
export function StoreBar({
	title,
	headingLevel: Heading = "h2",
	children,
}: {
	title: string;
	headingLevel?: "h1" | "h2";
	children?: ReactNode;
}) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-8 py-4">
			<Heading className="nordic-title">{title}</Heading>
			{children && <div className="flex items-center gap-1 text-foreground">{children}</div>}
		</div>
	);
}

export const iconLinkClass =
	"inline-flex h-9 w-9 items-center justify-center transition-colors hover:text-black";

export function StoreBarIcons() {
	return (
		<>
			<Link href="/products" aria-label="Browse and filter all products" className={iconLinkClass}>
				<SlidersHorizontal aria-hidden className="h-5 w-5" strokeWidth={1.5} />
			</Link>
			<Link href="/search" aria-label="Search" className={iconLinkClass}>
				<Search aria-hidden className="h-5 w-5" strokeWidth={1.75} />
			</Link>
		</>
	);
}

export async function ProductGrid({
	title = "Store",
	headingLevel = "h2",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts =
		products ??
		photographedFirst(
			(await commerce.productBrowse({ active: true, limit: Math.max(limit, 48) })).data,
		).slice(0, limit);

	return (
		<section id="products" className="bg-background py-8">
			<div className="container mx-auto pt-4 pb-12">
				<StoreBar title={title} headingLevel={headingLevel}>
					<StoreBarIcons />
				</StoreBar>
				{displayProducts.length > 0 ? (
					<div className={`${PRODUCT_GRID_CLASS} px-6 pt-6`}>
						{displayProducts.map((product, index) => (
							<ProductCard key={product.id} product={product} priority={index === 0} />
						))}
					</div>
				) : (
					<p className="px-8 py-12">Nothing here yet. Have a look around the rest of the shop.</p>
				)}
				{showViewAll && (
					<div className="mt-12 px-8 text-center">
						<Link href={viewAllHref} className="nordic-link text-lg">
							view all products
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
