import type { Metadata } from "next";
import { FlavorRow } from "@/components/sections/flavor-row";
import { Hero } from "@/components/sections/hero";
import { Lifestyle } from "@/components/sections/lifestyle";
import { MarqueeStrip } from "@/components/sections/marquee-strip";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Provenance } from "@/components/sections/provenance";
import { Tagline } from "@/components/sections/tagline";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<MarqueeStrip />
			<Tagline />
			<FlavorRow />
			<Lifestyle />
			<Provenance />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Shop the Flavors"
				eyebrow="Three sips, one ritual"
				description="Each can is a slow-pressed celebration of espresso and citrus, ready to chill and pour."
				limit={3}
			/>
			<Press />
			<Newsletter />
		</>
	);
}
