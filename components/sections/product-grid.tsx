import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title: string;
	products: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	viewAllHref?: string;
	className?: string;
};

/** The original's showcase: a giant centred uppercase title over a 2/4-column grid. */
export function ProductGrid({ title, products, viewAllHref, className }: ProductGridProps) {
	if (products.length === 0) return null;

	return (
		<section className={cn("mx-3 md:mx-10", className)}>
			<h2 className="pt-16 pb-10 text-center font-extrabold text-4xl uppercase sm:text-5xl md:pt-20 md:pb-12 lg:text-6xl">
				{title}
			</h2>
			<div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-12">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
			{viewAllHref && (
				<div className="mt-10 text-center">
					<Link href={viewAllHref} className="font-medium underline underline-offset-4 hover:no-underline">
						View all
					</Link>
				</div>
			)}
		</section>
	);
}
