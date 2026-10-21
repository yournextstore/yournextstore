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
	headingLevel?: "h1" | "h2";
};

/** A titled run of the edge-to-edge grid: a 12px label row, then the cards. */
export async function ProductGrid({
	title,
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	headingLevel = "h2",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;
	const Heading = headingLevel;

	return (
		<section className="py-[var(--main-padding)]">
			{(title || showViewAll) && (
				<div className="flex items-baseline justify-between gap-4 px-[var(--main-gap)] pb-[var(--main-padding)] max-[480px]:px-[calc(var(--main-gap)/2)]">
					{title ? <Heading>{title}</Heading> : <span />}
					{showViewAll && (
						<Link href={viewAllHref} className="inline-flex min-h-6 items-center">
							View all ↗
						</Link>
					)}
				</div>
			)}
			<div className="photon-grid">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
		</section>
	);
}
