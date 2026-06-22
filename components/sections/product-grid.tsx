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
};

export async function ProductGrid({
	title = "Best-Selling Flavors",
	description = "Handpicked favorites, poured fresh.",
	eyebrow = "Shop the line",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-[#fbf6ec]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
					<div>
						<p className="text-[11px] tracking-[0.4em] uppercase text-[#e11226] font-semibold">{eyebrow}</p>
						<h2 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl text-[#0f0f10] tracking-tight leading-[1.04]">
							{title.split(" ").map((word, i, arr) =>
								i === arr.length - 1 ? (
									<span key={`${word}-${i}`} className="italic text-[#e11226]">
										{word}
									</span>
								) : (
									<span key={`${word}-${i}`}>{word} </span>
								),
							)}
							<span className="text-[#0f0f10]">.</span>
						</h2>
						<p className="mt-3 max-w-md text-[#0f0f10]/60 text-sm sm:text-base">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="self-start sm:self-end text-[11px] tracking-[0.3em] uppercase font-semibold text-[#0f0f10] border-b border-[#0f0f10] pb-1 hover:text-[#e11226] hover:border-[#e11226] transition-colors"
						>
							Shop all →
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 sm:gap-y-16">
					{displayProducts.map((product, idx) => (
						<ProductCard key={product.id} product={product} index={idx} priority={idx === 0} />
					))}
				</div>
			</div>
		</section>
	);
}
