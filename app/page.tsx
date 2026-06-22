import type { Metadata } from "next";
import { Categories } from "@/components/sections/categories";
import { FounderStory } from "@/components/sections/founder-story";
import { Hero } from "@/components/sections/hero";
import { IngredientSpotlight } from "@/components/sections/ingredient-spotlight";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Testimonials } from "@/components/sections/testimonials";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Marquee />
			<Categories />
			<IngredientSpotlight />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Bestsellers"
				description="Quiet favorites from the collection."
				eyebrow="Loved most"
				limit={6}
			/>
			<FounderStory />
			<Testimonials />
			<Newsletter />
		</>
	);
}
