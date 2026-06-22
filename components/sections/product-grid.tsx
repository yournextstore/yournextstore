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
	eyebrow?: string;
	description?: string;
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
	title = "The wardrobe",
	eyebrow = "— Capsule 003 —",
	description,
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
			<div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
				<div className="flex items-end justify-between mb-12">
					<div>
						{eyebrow && <p className="font-eyebrow text-[10px] text-muted-foreground mb-3">{eyebrow}</p>}
						<h2 className="font-serif font-light text-foreground text-[36px] sm:text-[48px] tracking-tight leading-none">
							{title}
						</h2>
						{description && <p className="mt-3 text-sm text-muted-foreground max-w-xl">{description}</p>}
					</div>
					{showViewAll && (
						<Link
							href={viewAllHref}
							className="hidden sm:inline-block font-eyebrow text-[11px] text-foreground/80 editorial-underline"
						>
							Shop all
						</Link>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-12">
					{displayProducts.map((product, i) => (
						<ProductCard key={product.id} product={product} priority={eagerFirstImage && i === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 flex justify-center sm:hidden">
						<Link href={viewAllHref} className="font-eyebrow text-[11px] text-foreground editorial-underline">
							Shop all
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
