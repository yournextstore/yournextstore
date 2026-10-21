import { type CardProduct, ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

/** The original's catalogue grid: two columns on phones, four from md, 20px gutters. */
export function ProductGrid({
	products,
	kicker,
	className,
}: {
	products: CardProduct[];
	kicker?: string;
	className?: string;
}) {
	return (
		<div className={cn("grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-5 md:grid-cols-4", className)}>
			{products.map((product, index) => (
				<ProductCard
					key={product.id}
					product={product}
					kicker={kicker}
					priority={index < 2}
					sizes="(max-width: 768px) 50vw, 270px"
				/>
			))}
		</div>
	);
}
