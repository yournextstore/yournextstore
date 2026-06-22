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
	title = "The Collection",
	description = "Six bottles. Six confessions. Each one poured by hand in our Grasse atelier.",
	eyebrow = "Now in Residence",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-ink py-20 sm:py-28">
			<div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
				<div className="mb-14 flex flex-col gap-6 sm:mb-20 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-[10px] tracking-microcaps text-foreground/55">{eyebrow}</p>
						<h2 className="mt-3 font-serif-display text-4xl leading-[1.02] text-foreground sm:text-6xl">
							{title}
						</h2>
						<p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/65">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="self-start border-b border-foreground/30 pb-1 text-[10px] tracking-microcaps text-foreground/70 transition-colors hover:border-saffron hover:text-saffron sm:self-end"
						>
							View the full library →
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
					{displayProducts.map((product, i) => (
						<div key={product.id} className="group relative">
							<div className="absolute -top-3 left-0 z-10 font-serif-display text-xs italic text-saffron/80">
								{(i + 1).toString().padStart(2, "0")}
							</div>
							<ProductCard product={product} priority={i === 0} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
