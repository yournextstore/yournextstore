import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

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
	variant?: "default" | "editorial";
};

export async function ProductGrid({
	title = "The Bestsellers",
	description,
	products,
	limit = 4,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "— Loved by many",
	variant = "editorial",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const gridCols =
		variant === "editorial"
			? "grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 sm:gap-x-8"
			: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8";

	return (
		<section id="products" className="bg-background">
			<div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-20 sm:py-28">
				<div className="flex flex-col items-center text-center mb-14">
					<p className="text-[11px] tracking-arame uppercase text-foreground/55">{eyebrow}</p>
					<h2 className="mt-3 font-serif text-4xl sm:text-5xl text-foreground">{title}</h2>
					{description && <p className="mt-4 text-[15px] text-muted-foreground max-w-xl">{description}</p>}
				</div>

				<div className={`grid ${gridCols}`}>
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-16 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-block font-serif italic text-base text-foreground border-b border-foreground/40 pb-1 hover:border-foreground transition-colors"
						>
							View the full collection
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
