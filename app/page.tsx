import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Bundles } from "@/components/sections/bundles";
import { EditorialBanner } from "@/components/sections/editorial-banner";
import { FAQ } from "@/components/sections/faq";
import { FeatureRow } from "@/components/sections/feature-row";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { TheClub } from "@/components/sections/the-club";
import { UGCGrid } from "@/components/sections/ugc-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<About />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The catalog" limit={6} />
			<Bundles />
			<FeatureRow />
			<EditorialBanner />
			<TheClub />
			<PressStrip />
			<UGCGrid />
			<FAQ />
			<Newsletter />
		</>
	);
}
