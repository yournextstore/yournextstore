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
	title = "The Flavors",
	description = "Three signature sauces, each a study in heat and shadow.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-cream-paper">
			<div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
				<div className="flex flex-col items-center text-center">
					<p className="divider-ornament">Hand-poured · Hand-labeled</p>
					<h2 className="mt-5 font-display text-4xl tracking-tight text-[color:#0f2a3f] sm:text-5xl lg:text-[56px]">
						{title}
					</h2>
					<p className="mt-4 max-w-xl text-base leading-relaxed text-[color:#0f2a3f]/70 sm:text-lg">
						{description}
					</p>
				</div>

				<div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-16 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex h-12 items-center gap-2 rounded-full border border-[color:#0f2a3f]/20 bg-transparent px-8 text-sm font-semibold uppercase tracking-[0.18em] text-[color:#0f2a3f] transition-colors hover:bg-[color:#0f2a3f] hover:text-[color:#f6efe2]"
						>
							View the full cellar
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
