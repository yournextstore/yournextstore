import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	description?: string;
	products?: (Product | APICollectionGetByIdResult["productCollections"][number]["product"])[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
};

export async function ProductGrid({
	title = "Our Goods",
	description = "You'll be cooking like a pro in no time.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-[1820px] mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<h2 className="font-[family-name:var(--font-prompt)] text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground">
						{title}
					</h2>
					<p className="mt-3 text-muted-foreground text-lg">{description}</p>
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground hover:text-[#ff2524] transition-colors"
					>
						View all
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center sm:hidden">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-foreground hover:text-[#ff2524] transition-colors"
					>
						View all products
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
