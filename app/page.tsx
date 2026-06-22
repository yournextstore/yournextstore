import type { Metadata } from "next";
import { Benefits } from "@/components/sections/benefits";
import { FounderStory } from "@/components/sections/founder-story";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { StoreLocator } from "@/components/sections/store-locator";
import { UGCGrid } from "@/components/sections/ugc-grid";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Pick your flavor" limit={6} />
			<Benefits />
			<FounderStory />
			<PressStrip />
			<UGCGrid />
			<div id="locator">
				<StoreLocator />
			</div>
			<Newsletter />
		</>
	);
}
