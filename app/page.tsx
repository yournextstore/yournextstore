import type { Metadata } from "next";
import { CategoryTiles } from "@/components/sections/category-tiles";
import { ExploreBanner } from "@/components/sections/explore-banner";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { Statement } from "@/components/sections/statement";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Cached sections render without Suspense boundaries: a boundary around a cached section still
// resolves after the first flush and shifts the page when it lands (PLAYBOOK §4).
export default function Home() {
	return (
		<>
			<Hero />
			<Statement />
			<CategoryTiles />
			<ProductGrid />
			<ExploreBanner />
			<Gallery />
		</>
	);
}
