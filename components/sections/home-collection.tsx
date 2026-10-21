import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getHomeProducts } from "@/lib/catalog";

/** "Our Collection": the original's six-card grid under a large serif heading. */
export async function HomeCollection() {
	const products = await getHomeProducts(6);
	if (products.length === 0) return null;

	return (
		<section id="our-collection" className="mx-auto mt-24 max-w-screen-2xl scroll-mt-6 px-5 max-[400px]:px-3">
			<div className="flex items-end justify-between gap-4">
				<h2 className="text-5xl tracking-[1.56px] max-sm:text-4xl">Our Collection</h2>
				<Link href="/products" className="mb-1 text-lg underline-offset-4 hover:underline max-sm:hidden">
					View all
				</Link>
			</div>
			<div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
