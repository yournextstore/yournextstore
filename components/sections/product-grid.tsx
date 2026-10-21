import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ProductCard } from "@/components/product-card";
import { picturedFirst } from "@/lib/pictured";
import { cn } from "@/lib/utils";

export type Product = APIProductsBrowseResult["data"][number];

export type GridProduct =
	| Product
	| APICollectionGetByIdResult["productCollections"][number]["product"]
	| NonNullable<APIProductGetByIdResult>;

/** Soul's product list: one column on phones, two from 24rem, up to four on wide screens. */
export function ProductGrid({
	products,
	className,
	priorityCount = 1,
}: {
	products: GridProduct[];
	className?: string;
	priorityCount?: number;
}) {
	return (
		<div
			className={cn(
				"grid grid-cols-1 gap-x-4 gap-y-6 xs:grid-cols-2 md:grid-cols-3 md:gap-x-5 md:gap-y-8 xl:grid-cols-4",
				className,
			)}
		>
			{picturedFirst(products).map((product, index) => (
				<ProductCard key={product.id} product={product} priority={index < priorityCount} />
			))}
		</div>
	);
}
