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
	eyebrow?: string;
	tone?: "cream" | "white";
	/** Load the first card's image eagerly. Off for grids below the fold (related products). */
	eagerFirstImage?: boolean;
};

export async function ProductGrid({
	title = "Bestsellers",
	description = "Quiet favorites from the collection.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "Loved most",
	tone = "cream",
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const bg = tone === "cream" ? "bg-[#F5F1EB]" : "bg-background";

	return (
		<section id="products" className={bg}>
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
				<div className="mb-12 text-center">
					<p className="text-[11px] yns-letter-spacing-mid uppercase text-muted-foreground">{eyebrow}</p>
					<h2 className="mt-3 font-serif text-4xl sm:text-5xl font-light text-foreground">{title}</h2>
					{description && (
						<p className="mt-3 font-serif text-lg italic text-muted-foreground">{description}</p>
					)}
				</div>

				<div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={eagerFirstImage && index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-16 text-center">
						<Link
							href={viewAllHref}
							className="inline-flex border-b border-foreground/60 pb-1 text-[11px] yns-letter-spacing-mid uppercase text-foreground hover:border-foreground"
						>
							View all
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
