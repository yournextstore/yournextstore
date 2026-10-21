import type { ReactNode } from "react";
import { Carousel, carouselSlide } from "@/components/carousel";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/components/sections/product-grid";

/** A titled rail of product tiles ("Our bestsellers", "Complete the look", "Recommended products"). */
export function ProductCarousel({
	title,
	products,
	footer,
	className,
}: {
	title: string;
	products: Product[];
	footer?: ReactNode;
	className?: string;
}) {
	if (products.length === 0) return null;
	return (
		<Carousel title={title} footer={footer} className={className}>
			{products.map((product) => (
				<div key={product.id} className={carouselSlide}>
					<ProductCard
						product={product}
						sizes="(min-width: 1100px) 440px, (min-width: 768px) 43vw, (min-width: 640px) 63vw, 73vw"
					/>
				</div>
			))}
		</Carousel>
	);
}
