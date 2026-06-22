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
	title = "Cookies Fresh from the Oven",
	eyebrow = "BESTSELLERS",
	description = "Hand-baked in small batches, always butter-real and chip-loaded.",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-[var(--background)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center mb-14">
					<p className="text-xs font-bold tracking-[0.3em] text-[var(--candy)] uppercase">{eyebrow}</p>
					<h2 className="mt-3 font-display italic text-[var(--maroon)] text-4xl sm:text-5xl lg:text-6xl tracking-tight">
						{title}
					</h2>
					<p className="mt-4 max-w-xl mx-auto text-[var(--ink)]/70 leading-relaxed">{description}</p>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-16 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[var(--candy)] text-white text-sm font-bold tracking-[0.18em] uppercase hover:bg-[var(--maroon)] transition-colors shadow-md"
						>
							Shop All Cookies
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
