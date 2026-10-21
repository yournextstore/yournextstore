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
	description?: string;
	products: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	viewAllHref?: string;
	details?: boolean;
	small?: boolean;
	/** Already inside a container (product page). */
	bare?: boolean;
	className?: string;
};

/** "Product Lists": a left-set heading over a four-up row of product cards. */
export function ProductGrid({
	title,
	description,
	products,
	viewAllHref,
	details = false,
	small = false,
	bare = false,
	className,
}: ProductGridProps) {
	if (products.length === 0) return null;
	return (
		<section className={cn(!bare && "container-ae", "py-12 sm:py-16", className)}>
			<div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
				<div>
					<h2 className={small ? "text-xl font-semibold" : "text-[1.75rem] font-bold sm:text-[1.875rem]"}>
						{title}
					</h2>
					{description && <p className="mt-1">{description}</p>}
				</div>
				{viewAllHref && (
					<Link href={viewAllHref} className="text-sm font-semibold text-slate-ink hover:underline">
						Browse all products &gt;
					</Link>
				)}
			</div>
			{/* A swipe rail on phones; `sm:contents` hands the cards to the four-up grid above. */}
			<div className="sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
				<div className="-mx-3 flex snap-x snap-mandatory scroll-px-3 gap-4 overflow-x-auto px-3 pb-2 sm:contents">
					{products.map((product) => (
						<div key={product.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
							<ProductCard product={product} details={details} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
