import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

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
};

export async function ProductGrid({
	title = "Shop the collection",
	eyebrow = "— Featured",
	description,
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[var(--background)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
				<div className="flex items-end justify-between gap-6 mb-12 lg:mb-16">
					<div>
						{eyebrow && (
							<p className="text-[10px] tracking-[0.32em] uppercase text-foreground/60 mb-3">{eyebrow}</p>
						)}
						<h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] text-foreground">
							{title}
						</h2>
						{description && <p className="mt-4 text-muted-foreground max-w-md">{description}</p>}
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-foreground/70 hover:text-[var(--olive-dark)] transition-colors"
						>
							View all
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 text-center sm:hidden">
						<YnsLink prefetch={"eager"} href={viewAllHref} className="btn-olive">
							View all products
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
