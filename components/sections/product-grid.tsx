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
	colorful?: boolean;
};

const cardTints = [
	"bg-[#f8c8c1]", // coral pastel
	"bg-[#bfe09a]", // green pastel
	"bg-[#ffb673]", // orange pastel
	"bg-[#f5d97a]", // mustard pastel
	"bg-[#f8c8c1]",
	"bg-[#bfe09a]",
];

export async function ProductGrid({
	title = "Enjoy Our Your Next Store",
	description = "Three flavors, one mission: make snacking feel like dessert.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	colorful = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-brand-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col items-center text-center mb-12">
					<span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-coral">
						Shop the line
					</span>
					<h2 className="mt-3 font-display text-3xl sm:text-5xl tracking-tight text-brand-ink">{title}</h2>
					<p className="mt-3 max-w-xl text-brand-ink/70">{description}</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{displayProducts.map((product, i) => (
						<ProductCard
							key={product.id}
							product={product}
							tintClass={colorful ? cardTints[i % cardTints.length] : undefined}
						/>
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center">
						<YnsLink prefetch={"eager"} href={viewAllHref} className="btn-pill bg-brand-ink text-white">
							View all products
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
