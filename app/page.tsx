import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { InstaGrid } from "@/components/sections/insta-grid";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { RecipeSection } from "@/components/sections/recipe-section";
import { StoryRow } from "@/components/sections/story-row";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Marquee text="Holiday often" />
			<StoryRow />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The Shop Edit" limit={6} />
			<RecipeSection />
			<PressStrip />
			<InstaGrid />
			<About />
			<Newsletter />
		</>
	);
}
