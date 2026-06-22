import type { Metadata } from "next";
import { FeatureBlocks } from "@/components/sections/feature-blocks";
import { Founder } from "@/components/sections/founder";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { RitualBand } from "@/components/sections/ritual-band";
import { Science } from "@/components/sections/science";
import { Testimonials } from "@/components/sections/testimonials";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Ingredients />
			<FeatureBlocks />
			<PressStrip />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid limit={6} />
			<Science />
			<Founder />
			<Testimonials />
			<RitualBand />
			<Newsletter />
		</>
	);
}
