import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { EditorialTiles } from "@/components/sections/editorial-tiles";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Storytelling } from "@/components/sections/storytelling";
import { TrendingRail } from "@/components/sections/trending-rail";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<EditorialTiles />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				eyebrow="New In"
				title="Just Arrived"
				description="Considered pieces from this season's collection."
				limit={8}
			/>
			<Storytelling />
			<TrendingRail />
			<About />
			<Newsletter />
		</>
	);
}
