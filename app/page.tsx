import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { EditorialStatement } from "@/components/sections/editorial-statement";
import { Hero } from "@/components/sections/hero";
import { IngredientStrip } from "@/components/sections/ingredient-strip";
import { Newsletter } from "@/components/sections/newsletter";
import { PressRow } from "@/components/sections/press-row";
import { ProductGrid } from "@/components/sections/product-grid";
import { RecipeFeature } from "@/components/sections/recipe-feature";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main className="bg-[var(--brand-cream)]">
			<Hero />
			<EditorialStatement />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The Lineup" limit={3} />
			<IngredientStrip />
			<RecipeFeature />
			<PressRow />
			<About />
			<Newsletter />
		</main>
	);
}
