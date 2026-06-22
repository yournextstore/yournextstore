import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { FlavorGrid } from "@/components/sections/flavor-grid";
import { Hero } from "@/components/sections/hero";
import { Lifestyle } from "@/components/sections/lifestyle";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { SocialWall } from "@/components/sections/social-wall";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<FlavorGrid />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Best sellers"
				description="The pops the whole pool deck keeps texting about."
				eyebrow="Featured drops"
				limit={6}
			/>
			<Lifestyle />
			<PressStrip />
			<SocialWall />
			<About />
			<Newsletter />
		</>
	);
}
