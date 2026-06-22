import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { IngredientBand } from "@/components/sections/ingredient-band";
import { Manifesto } from "@/components/sections/manifesto";
import { Muses } from "@/components/sections/muses";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Ritual } from "@/components/sections/ritual";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Manifesto />
			<Muses />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Best Sellers"
				eyebrow="Volume Ⅰ"
				description="A small circle of objects, made in close quarters, returned to often."
				limit={4}
				tone="sand"
			/>
			<IngredientBand />
			<Ritual />
			<Press />
			<About />
			<Newsletter />
		</>
	);
}
