import type { Metadata } from "next";
import { Benefits } from "@/components/sections/benefits";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Source } from "@/components/sections/source";
import { StoryRow } from "@/components/sections/story-row";
import { TestResults } from "@/components/sections/test-results";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<StoryRow />
			<Benefits />
			<TestResults />
			<Source />
			<Press />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Shop the lineup"
				description="Still, sparkling, and flavored — each in returnable glass."
				eyebrow="Our Water"
				background="cream"
				limit={8}
			/>
			<Newsletter />
		</>
	);
}
