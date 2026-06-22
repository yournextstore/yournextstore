import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { LifestyleGallery } from "@/components/sections/lifestyle-gallery";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="The Lineup"
				description="Six plants. One mission: keep biters away, naturally."
				limit={6}
			/>
			<Ingredients />
			<Press />
			<LifestyleGallery />
			<About />
			<Newsletter />
		</>
	);
}
