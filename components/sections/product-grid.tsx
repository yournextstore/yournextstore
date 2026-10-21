import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { CARD_GRID } from "@/components/product-grid-skeleton";
import { SectionIntro } from "@/components/sections/frntr";
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
	title = "Featured",
	description,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="frame mt-24">
			<SectionIntro title={title} text={description} />
			<div className={CARD_GRID}>
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
			{showViewAll && (
				<Link
					href={viewAllHref}
					className="mt-10 inline-flex h-12 items-center bg-peach px-8 text-base font-bold text-foreground transition-colors hover:bg-pink"
				>
					See everything
				</Link>
			)}
		</section>
	);
}
