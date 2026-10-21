import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ProductCard } from "@/components/product-card";
import { SectionTitle } from "@/components/section-title";
import { cn } from "@/lib/utils";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title: string;
	description?: string;
	products: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	viewAllHref?: string;
	className?: string;
	priority?: boolean;
};

/** A GoCart product shelf: centred title, then a four-up grid of grey tiles. */
export function ProductGrid({
	title,
	description,
	products,
	viewAllHref,
	className,
	priority,
}: ProductGridProps) {
	return (
		<section className={cn("mx-auto my-24 max-w-6xl px-6 sm:my-30", className)}>
			<SectionTitle title={title} description={description} href={viewAllHref} />
			<div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-12">
				{products.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={priority && index === 0} />
				))}
			</div>
		</section>
	);
}
