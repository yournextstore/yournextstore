import type { Metadata } from "next";
import { FeaturedCards } from "@/components/sections/featured-cards";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { StatsSection } from "@/components/sections/stats-section";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Featured Products" description="Premium audio gear for audiophiles" limit={6} />
			<FeaturedCards />
			<StatsSection />
		</main>
	);
}
