import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import type { ReactNode } from "react";
import { SectionHead } from "@/components/field/section-head";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	eyebrow?: string;
	gridRef?: string;
	title?: ReactNode;
	description?: ReactNode;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	id?: string;
};

export async function ProductGrid({
	eyebrow = "THE FULL RANGE",
	gridRef,
	title = "Everything in the kit",
	description,
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	id = "products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id={id} className="section-x section-y">
			<SectionHead gridRef={gridRef} eyebrow={eyebrow} title={title} lead={description}>
				{showViewAll && (
					<Link href={viewAllHref} className="btn btn-ghost">
						View all products <span aria-hidden="true">→</span>
					</Link>
				)}
			</SectionHead>
			<div className="frame grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} index={index} />
				))}
			</div>
		</section>
	);
}
