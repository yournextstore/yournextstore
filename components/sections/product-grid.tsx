import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title: string;
	products: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	viewAllHref?: string;
};

/** A titled row of FreshCart cards, five across on wide screens (the home page's "Popular Products"). */
export function ProductGrid({ title, products, viewAllHref }: ProductGridProps) {
	return (
		<section className="my-8 lg:my-14">
			<div className="mb-6 flex items-center justify-between gap-4">
				<h2 className="text-fc-lg">{title}</h2>
				{viewAllHref ? (
					<Link
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-green-600 transition hover:text-green-700"
					>
						View all
						<ArrowRightIcon className="size-3.5" aria-hidden />
					</Link>
				) : null}
			</div>
			<div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
