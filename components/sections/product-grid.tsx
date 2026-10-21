import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Arrow } from "@/components/bakery/arrow";
import { SectionHeader } from "@/components/bakery/section-header";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { buttonClass } from "@/lib/ui";

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
	viewAllLabel?: string;
};

export async function ProductGrid({
	title = "Featured Favourites",
	description = "A few bakes that steal the spotlight this week",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	viewAllLabel = "See the shop",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bake-container flex flex-col gap-8 py-16 lg:gap-16 lg:py-24">
			<SectionHeader title={title} subtitle={description} />
			<ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{displayProducts.map((product, index) => (
					<li key={product.id}>
						<ProductCard product={product} priority={index === 0} />
					</li>
				))}
			</ul>
			{showViewAll && (
				<Link href={viewAllHref} className={buttonClass({ className: "lg:mx-auto lg:w-fit" })}>
					<span>{viewAllLabel}</span>
					<Arrow />
				</Link>
			)}
		</section>
	);
}
