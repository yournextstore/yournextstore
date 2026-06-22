import type { Metadata } from "next";
import { BenefitsRow } from "@/components/sections/benefits-row";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { LifestyleSplit } from "@/components/sections/lifestyle-split";
import { MissionBand } from "@/components/sections/mission-band";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { Reviews } from "@/components/sections/reviews";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<MissionBand />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid limit={6} />
			<BenefitsRow />
			<Ingredients />
			<PressStrip />
			<LifestyleSplit />
			<Reviews />
			<Newsletter />
		</>
	);
}
