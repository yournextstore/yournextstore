import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { LandscapeBand } from "@/components/sections/landscape-band";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Recipes } from "@/components/sections/recipes";
import { Wholesale } from "@/components/sections/wholesale";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<LandscapeBand />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="the jars" limit={6} />
			<About />
			<Recipes />
			<Press />
			<Wholesale />
			<Newsletter />
		</>
	);
}
