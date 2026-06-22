import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { DEMO_PRODUCTS, type DemoProduct, previewHref } from "@/lib/demo-products";
import { YnsLink } from "../yns-link";

export type Product = APIProductsBrowseResult["data"][number];
export type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];

type ProductGridProps = {
	title?: string;
	eyebrow?: string;
	description?: string;
	products?: (Product | CollectionProduct | DemoProduct | NonNullable<APIProductGetByIdResult>)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	preview?: boolean;
	columns?: 3 | 4;
};

export async function ProductGrid({
	title = "Featured Products",
	eyebrow,
	description,
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	preview = false,
	columns = 3,
}: ProductGridProps) {
	const displayProducts: (Product | CollectionProduct | DemoProduct)[] = preview
		? DEMO_PRODUCTS.slice(0, limit)
		: (products ?? (await commerce.productBrowse({ active: true, limit })).data);

	const gridClass =
		columns === 4
			? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14"
			: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16";

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="text-center mb-16">
				{eyebrow && <p className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-4">{eyebrow}</p>}
				<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground text-balance">
					{title}
				</h2>
				{description && (
					<p className="mt-4 text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
						{description}
					</p>
				)}
				<div className="mt-6 mx-auto h-px w-12 bg-[#c9a87c]" />
			</div>

			<div className={gridClass}>
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} preview={preview} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-16 text-center">
					<YnsLink
						prefetch={"eager"}
						href={previewHref(viewAllHref, preview)}
						className="inline-flex items-center gap-2 text-xs tracking-luxe uppercase text-foreground border-b border-[#c9a87c] pb-1 hover:text-[#8b6b4a] transition-colors"
					>
						View the full collection
						<ArrowRight className="h-3.5 w-3.5" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
