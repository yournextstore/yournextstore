import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PopularCategories } from "@/components/sections/popular-categories";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { StoryBand } from "@/components/sections/story-band";
import { Sustainability } from "@/components/sections/sustainability";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<PopularCategories />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				eyebrow="Shop by activity"
				title="Built for every move"
				description="From your morning miles to your post-yoga walk — pieces engineered to perform across running, training, and recovery."
				limit={8}
				columns={4}
			/>
			<StoryBand />
			<PressStrip />
			<Sustainability />
			<Newsletter />
		</>
	);
}
