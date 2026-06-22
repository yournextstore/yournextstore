import type { Metadata } from "next";
import { About, PractitionerStrip, ResearchCallout } from "@/components/sections/about";
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
			<PractitionerStrip />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="The protocol"
				description="Three formulations engineered to compound — one daily ritual."
				eyebrow="The system"
				limit={6}
			/>
			<About />
			<ResearchCallout />
			<Newsletter />
		</>
	);
}
