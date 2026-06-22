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
	description = "An edited selection of objects — sculptural, archival, made to last.",
	eyebrow = "Catalogue No. 01",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-paper" style={{ backgroundColor: "#F4F1EC" }}>
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
				<div className="grid grid-cols-12 gap-6 items-end mb-14">
					<div className="col-span-12 lg:col-span-8">
						<div
							className="flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase text-ember mb-6"
							style={{ color: "#c97a2b" }}
						>
							<span className="block h-px w-10 bg-current" />
							<span>{eyebrow}</span>
						</div>
						<h2 className="display-italic text-5xl sm:text-6xl lg:text-7xl tracking-[-0.02em] leading-[0.95]">
							{title}
						</h2>
						<p className="mt-5 max-w-xl text-foreground/70 text-base leading-relaxed">{description}</p>
					</div>
					{showViewAll && (
						<div className="col-span-12 lg:col-span-4 lg:text-right">
							<YnsLink
								prefetch={"eager"}
								href={viewAllHref}
								className="inline-flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase text-foreground/70 hover:text-foreground transition-colors group"
							>
								<span className="block h-px w-10 bg-foreground/30 group-hover:w-16 transition-all duration-300" />
								View all objects
								<ArrowRight className="h-3.5 w-3.5" />
							</YnsLink>
						</div>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
					{displayProducts.map((product, i) => (
						<div key={product.id} className="relative">
							<div className="absolute -top-3 left-0 text-[10px] tracking-[0.22em] uppercase text-foreground/40 z-10">
								No. {String(i + 1).padStart(2, "0")}
							</div>
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
