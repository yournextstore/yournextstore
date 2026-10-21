import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

type GridProduct =
	| APIProductsBrowseResult["data"][number]
	| APICollectionGetByIdResult["productCollections"][number]["product"]
	| NonNullable<APIProductGetByIdResult>;

/** The listing grid: two columns on phones, five on a wide desktop next to the filter rail. */
export function ProductCardGrid({
	products,
	className,
	priorityCount = 2,
}: {
	products: GridProduct[];
	className?: string;
	priorityCount?: number;
}) {
	return (
		<ul
			className={cn(
				"m-0 grid list-none grid-cols-2 gap-x-4 gap-y-6 p-0 md:grid-cols-3 xl:grid-cols-4 wide:grid-cols-5",
				className,
			)}
		>
			{products.map((product, index) => (
				<li key={product.id} className="min-w-0">
					<ProductCard
						product={product}
						priority={index < priorityCount}
						sizes="(min-width: 1400px) 16vw, (min-width: 1280px) 19vw, (min-width: 768px) 28vw, 46vw"
					/>
				</li>
			))}
		</ul>
	);
}

/** A titled row of products (related products, collection pages). */
export function ProductGrid({
	eyebrow,
	title,
	products,
}: {
	eyebrow?: string;
	title: string;
	products: GridProduct[];
}) {
	return (
		<section className="ed-band">
			<header className="mb-[clamp(20px,2.4vw,32px)]">
				{eyebrow && <span className="ed-eyebrow mb-2.5">{eyebrow}</span>}
				<h2 className="ed-display m-0 text-display-section">{title}</h2>
			</header>
			<ProductCardGrid
				products={products}
				priorityCount={0}
				className="md:grid-cols-4 xl:grid-cols-4 wide:grid-cols-4"
			/>
		</section>
	);
}
