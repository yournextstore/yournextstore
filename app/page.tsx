import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Chapters } from "@/components/sections/chapters";
import { Hero } from "@/components/sections/hero";
import { IngredientStory } from "@/components/sections/ingredient-story";
import { Newsletter } from "@/components/sections/newsletter";
import { PressMarquee } from "@/components/sections/press-marquee";
import { ProductGrid } from "@/components/sections/product-grid";
import { ScentQuiz } from "@/components/sections/scent-quiz";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main className="bg-ink">
			<Hero />
			<Chapters />
			<IngredientStory />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid limit={6} />
			<PressMarquee />
			<ScentQuiz />
			<About />
			<Newsletter />
		</main>
	);
}
