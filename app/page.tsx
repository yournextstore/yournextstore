import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { getShelves, picturedFirst } from "@/lib/catalog";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

const SHELF_SIZE = 6;

// Cached reads only, so the home page prerenders whole: banner, then the two showcase shelves.
export default async function Home() {
	const { featured, recommended } = await getShelves();
	// The recommended shelf keeps its own picks; the featured shelf shows what that one does not,
	// topped up from the rest only when the catalogue is too small for two distinct rows.
	const recommendedProducts = picturedFirst([...recommended.products]).slice(0, SHELF_SIZE);
	const taken = new Set(recommendedProducts.map((p) => p.id));
	const featuredAll = picturedFirst([...featured.products]);
	const featuredProducts = [
		...featuredAll.filter((p) => !taken.has(p.id)),
		...featuredAll.filter((p) => taken.has(p.id)),
	].slice(0, SHELF_SIZE);

	return (
		<div className="px-4 pt-4 pb-12 md:px-8 lg:px-[100px] lg:pt-5 lg:pb-[100px]">
			<Hero />
			<ProductGrid title={featured.title} products={featuredProducts} viewAllHref={featured.href} />
			<ProductGrid title={recommended.title} products={recommendedProducts} viewAllHref={recommended.href} />
		</div>
	);
}
