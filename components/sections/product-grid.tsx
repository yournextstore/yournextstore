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
	eyebrow?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	background?: "background" | "cream";
};

export async function ProductGrid({
	title = "Shop the lineup",
	description = "Still, sparkling, and flavored — each in returnable glass.",
	eyebrow = "Our Water",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	background = "background",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const bgClass = background === "cream" ? "bg-yns-cream" : "bg-background";

	return (
		<section id="products" className={bgClass}>
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
					<div>
						<p className="text-[11px] tracking-[0.22em] uppercase text-yns-green font-medium">{eyebrow}</p>
						<h2 className="mt-4 font-display text-4xl sm:text-5xl text-yns-navy leading-[1.05]">{title}</h2>
						<p className="mt-3 text-foreground/70 text-[15px] max-w-lg">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center justify-center h-11 px-7 rounded-full border border-yns-green text-yns-green text-[12px] tracking-[0.16em] uppercase font-medium hover:bg-yns-green hover:text-white transition-colors self-start sm:self-end"
						>
							Shop All
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
}
