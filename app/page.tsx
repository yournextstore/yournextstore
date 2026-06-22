import type { Metadata } from "next";
import { FarmStory } from "@/components/sections/farm-story";
import { FlavorFeatures } from "@/components/sections/flavor-features";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressMarquee } from "@/components/sections/press-marquee";
import { ProductGrid } from "@/components/sections/product-grid";
import { ValuesStrip } from "@/components/sections/values-strip";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Meet the Flavors" limit={6} />
			<FlavorFeatures />
			<FarmStory />
			<ValuesStrip />
			<PressMarquee />
			<Newsletter />
		</>
	);
}
