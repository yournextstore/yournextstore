import type { Metadata } from "next";
import { CategoryTiles } from "@/components/sections/category-tiles";
import { Hero } from "@/components/sections/hero";
import { IngredientStory } from "@/components/sections/ingredient-story";
import { KitBanner } from "@/components/sections/kit-banner";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<CategoryTiles />
			<IngredientStory />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Best Sellers"
				eyebrow="The Catalogue"
				description="Apothecary essentials in amber glass and minimal aluminum — clinically dosed actives, no fillers."
				limit={4}
				tone="stone"
			/>
			<KitBanner />
			<PressStrip />
			<Newsletter />
		</>
	);
}
