import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowUpRightIcon } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { DEMO_PRODUCTS, previewHref } from "@/lib/demo-products";
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
	preview?: boolean;
};

export async function ProductGrid({
	title = "Latest drops",
	description = "Hand-picked digital goods from creators we love.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	preview = false,
}: ProductGridProps) {
	const displayProducts =
		products ??
		(preview ? DEMO_PRODUCTS.slice(0, limit) : (await commerce.productBrowse({ active: true, limit })).data);

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-20">
			<div className="flex items-end justify-between mb-12 gap-6">
				<div>
					<span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--violet-deep)]">
						Featured
					</span>
					<h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight">{title}</h2>
					<p className="mt-2 max-w-xl text-muted-foreground">{description}</p>
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={previewHref(viewAllHref, preview)}
						className="hidden sm:inline-flex items-center gap-2 rounded-full bg-background ring-1 ring-border px-4 py-2 text-sm font-medium text-foreground hover:bg-[var(--accent)] transition-colors shrink-0"
					>
						View all
						<ArrowUpRightIcon className="h-3.5 w-3.5" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} preview={preview} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center sm:hidden">
					<YnsLink
						prefetch={"eager"}
						href={previewHref(viewAllHref, preview)}
						className="inline-flex items-center gap-2 rounded-full bg-background ring-1 ring-border px-4 py-2 text-sm font-medium text-foreground"
					>
						View all products
						<ArrowUpRightIcon className="h-3.5 w-3.5" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
