import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ArrowLongRightIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { picturedFirst } from "@/lib/pictured";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	eyebrow?: string;
	title?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	linkLabel?: string | null;
	linkHref?: string;
};

/**
 * The original's product banner: a small grey eyebrow, a centred two-line statement, an
 * underlined link and one row of four cards (two per row on phones).
 */
export async function ProductGrid({
	eyebrow = "Introducing Our Latest Products",
	title = "Limited reservations on upcoming products and restocks.",
	products,
	limit = 4,
	linkLabel = "See more products",
	linkHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts =
		products ??
		picturedFirst(
			(
				await commerce.productBrowse({
					active: true,
					limit: 24,
					orderBy: "createdAt",
					orderDirection: "desc",
				})
			).data,
		).slice(0, limit);

	if (displayProducts.length === 0) return null;

	return (
		<section className="container-wide py-12 sm:py-24">
			<div className="mb-12 flex flex-col items-center pb-6">
				<p className="mb-6 text-ink-soft">{eyebrow}</p>
				<h2 className="mb-4 max-w-[32rem] text-center text-display-1 font-medium">{title}</h2>
				{linkLabel && (
					<Link href={linkHref} className="arrow-link">
						{linkLabel}
						<ArrowLongRightIcon className="size-6" />
					</Link>
				)}
			</div>
			<div className="grid grid-cols-2 gap-x-4 lg:grid-cols-4">
				{displayProducts.slice(0, limit).map((product) => (
					<ProductCard key={product.id} product={product} sizes="(max-width: 1024px) 50vw, 25vw" />
				))}
			</div>
		</section>
	);
}
