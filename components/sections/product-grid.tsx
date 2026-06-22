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
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	eyebrow?: string;
};

export async function ProductGrid({
	title = "The Collection",
	description = "Quietly considered objects, made to live with — not look at.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "(02) — Catalogue",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative border-t border-border/60 bg-background">
			<div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-12 lg:py-28">
				<div className="grid grid-cols-12 gap-6 items-end mb-14 lg:mb-20">
					<div className="col-span-12 lg:col-span-7">
						<p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">{eyebrow}</p>
						<h2 className="mt-4 font-serif text-5xl lg:text-7xl leading-[0.95] tracking-[-0.03em] text-foreground text-balance">
							{title}
							<span className="text-clay italic">.</span>
						</h2>
					</div>
					<div className="col-span-12 lg:col-span-4 lg:col-start-9">
						<p className="text-[14px] leading-relaxed text-muted-foreground max-w-sm">{description}</p>
						{showViewAll && (
							<YnsLink
								prefetch={"eager"}
								href={viewAllHref}
								className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-foreground hover:text-clay transition-colors"
							>
								<span className="h-px w-8 bg-foreground/60" />
								View entire catalogue
							</YnsLink>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
					{displayProducts.map((product, idx) => (
						<div key={product.id} className="group">
							<div className="mb-3 flex items-center justify-between text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
								<span>№ {String(idx + 1).padStart(2, "0")}</span>
								<span className="font-serif italic normal-case tracking-normal text-clay">available</span>
							</div>
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
