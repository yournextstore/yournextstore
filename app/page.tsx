import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { FlavorRow } from "@/components/sections/flavor-row";
import { Hero } from "@/components/sections/hero";
import { IngredientStory } from "@/components/sections/ingredient-story";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { UgcMosaic } from "@/components/sections/ugc-mosaic";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<FlavorRow />
			<IngredientStory />
			<PressStrip />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Subscribe & save bundles"
				description="Mix three flavors. Skip, swap or cancel any time. Always 15% off."
				limit={6}
			/>
			<About />
			<UgcMosaic />
			<Newsletter />
		</>
	);
}
