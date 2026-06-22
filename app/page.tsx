import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { BenefitsMarquee } from "@/components/sections/benefits-marquee";
import { BigPromo } from "@/components/sections/big-promo";
import { FlavorGrid } from "@/components/sections/flavor-grid";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<BenefitsMarquee />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Shop The Lineup" limit={6} />
			<About />
			<FlavorGrid />
			<BigPromo />
			<Newsletter />
		</>
	);
}
