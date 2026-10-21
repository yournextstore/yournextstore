import type { Metadata } from "next";
import { CollectionList } from "@/components/sections/collection-list";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Cached sections render without their own Suspense boundaries: a boundary around a cached
// section still resolves after the first flush and shifts the page below it.
export default function Home() {
	return (
		<>
			<Hero />
			<ProductGrid title="A few favourites, picked for you" limit={6} className="pt-16 sm:pt-24" />
			<CollectionList title="Explore the shop" />
		</>
	);
}
