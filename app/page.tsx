import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { FindUs } from "@/components/sections/find-us";
import { FlavorLineup } from "@/components/sections/flavor-lineup";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { SocialGrid } from "@/components/sections/social-grid";
import { Ticker } from "@/components/sections/ticker";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Ticker />
			<FlavorLineup />
			<About />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Pour Yourself One" eyebrow="Shop The Bar" limit={6} />
			<PressStrip />
			<FindUs />
			<SocialGrid />
			<Newsletter />
		</>
	);
}
