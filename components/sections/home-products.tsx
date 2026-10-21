import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_GRID } from "@/components/product-grid-skeleton";
import { getProducts } from "@/lib/catalog";

export async function HomeProducts() {
	const products = await getProducts(8);
	if (products.length === 0) return null;
	return (
		<section aria-labelledby="home-products" className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 id="home-products" className="text-2xl font-medium">
					Products
				</h2>
				<Link
					href="/products"
					className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline hover:underline-offset-2"
				>
					View all
					<ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
				</Link>
			</div>
			<div className={PRODUCT_GRID}>
				{products.map((product, index) => (
					<ProductCard key={product.id} product={product} headingLevel="h3" priority={index < 2} />
				))}
			</div>
		</section>
	);
}
