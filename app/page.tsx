import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { FeatureRow } from "@/components/sections/feature-row";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Philosophy } from "@/components/sections/philosophy";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { RitualBanner } from "@/components/sections/ritual-banner";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<About />
			<FeatureRow />
			<Philosophy />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The Collection" eyebrow="Chapter Three" limit={4} columns={4} />
			<Press />
			<RitualBanner />
			<Newsletter />
		</>
	);
}
