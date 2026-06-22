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
	eyebrow?: string;
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
	eyebrow = "— The Collection —",
	title = "Shop our small-batch apothecary.",
	description = "A short list of considered formulations — each made in small runs and lab-verified.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center max-w-xl mx-auto mb-14">
					<p className="text-[10px] tracking-[0.32em] uppercase text-primary mb-4">{eyebrow}</p>
					<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-foreground">
						{title}
					</h2>
					<p className="mt-4 text-muted-foreground text-base leading-relaxed">{description}</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-16 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center justify-center h-11 px-9 rounded-full border border-foreground/25 text-[11px] tracking-[0.28em] uppercase font-semibold text-foreground hover:bg-foreground hover:text-background transition-colors"
						>
							View all products
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
