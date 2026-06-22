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
	eyebrow?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	/** Load the first card's image eagerly. Off for grids below the fold (related products). */
	eagerFirstImage?: boolean;
};

export async function ProductGrid({
	title = "The Bestsellers",
	description = "The pieces our community keeps coming back for.",
	eyebrow = "Shop the edit",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col items-center text-center mb-12 sm:mb-16">
					{eyebrow && (
						<p className="text-[11px] tracking-[0.3em] uppercase text-terracotta font-medium mb-4">
							{eyebrow}
						</p>
					)}
					<h2 className="font-serif text-4xl sm:text-5xl text-espresso">
						{title.includes(" ") ? (
							<>
								{title.split(" ").slice(0, -1).join(" ")}{" "}
								<span className="italic">{title.split(" ").slice(-1)[0]}</span>
							</>
						) : (
							title
						)}
					</h2>
					{description && (
						<p className="mt-4 text-base sm:text-lg text-walnut/70 max-w-xl leading-relaxed">{description}</p>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 sm:gap-x-8 sm:gap-y-14">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={eagerFirstImage && index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 text-center">
						<Link
							href={viewAllHref}
							className="inline-flex items-center h-12 px-10 border border-espresso text-espresso text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-espresso hover:text-cream transition-colors"
						>
							Shop all
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
