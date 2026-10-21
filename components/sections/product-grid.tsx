import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/product-card";
import { SectionHead } from "@/components/rack/section-head";
import { commerce } from "@/lib/commerce";
import { cn } from "@/lib/utils";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	kicker?: string;
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
	/** Faded giant label behind the section, like the original's "±12V". */
	watermark?: string;
	band?: boolean;
};

export async function ProductGrid({
	kicker = "The modules",
	title = "The whole line",
	description,
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	id = "modules",
	watermark,
	band = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id={id} className={cn("section-x section-y relative overflow-hidden", band && "band")}>
			{watermark && (
				<span aria-hidden="true" className="watermark">
					{watermark}
				</span>
			)}
			<SectionHead kicker={kicker} title={title} lead={description}>
				{showViewAll && (
					<Link href={viewAllHref} className="btn btn-ghost">
						See the whole line <span aria-hidden="true">→</span>
					</Link>
				)}
			</SectionHead>
			<div className="frame relative z-[1] grid grid-cols-1 gap-[1.1rem] xs:grid-cols-2 lg:grid-cols-3">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} index={index} />
				))}
			</div>
		</section>
	);
}
