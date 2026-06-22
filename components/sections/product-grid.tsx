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
	tone?: "sand" | "bone";
};

export async function ProductGrid({
	title = "Best Sellers",
	description,
	eyebrow = "The Collection",
	products,
	limit = 4,
	showViewAll = true,
	viewAllHref = "/products",
	tone = "sand",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const bg = tone === "sand" ? "bg-sand" : "bg-bone";

	return (
		<section id="products" className={`${bg} relative`}>
			<div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-24 sm:py-32">
				<div className="text-center mb-16">
					<p className="eyebrow text-rosewood mb-5">{eyebrow}</p>
					<h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink font-light leading-[1.05]">
						{title}
					</h2>
					{description && (
						<p className="mt-5 text-ink/65 text-base max-w-md mx-auto leading-relaxed">{description}</p>
					)}
					<span className="mt-8 inline-block w-16 h-px bg-ink/30" />
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-14 sm:gap-x-8">
					{displayProducts.slice(0, limit).map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-20 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-3 eyebrow text-ink border-b border-ink/30 pb-1 hover:border-ink transition-colors"
						>
							View The Full Collection
							<span className="text-base font-light leading-none">→</span>
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
