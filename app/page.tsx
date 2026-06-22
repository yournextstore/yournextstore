import type { Metadata } from "next";
import { CategoryTiles } from "@/components/sections/category-tiles";
import { EditorialBanner } from "@/components/sections/editorial-banner";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { StoryStrip } from "@/components/sections/story-strip";
import { UgcCarousel } from "@/components/sections/ugc-carousel";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<CategoryTiles />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				eyebrow="The Edit"
				title="Bestsellers"
				description="Loved on repeat — the pieces our customers can't stop reordering."
				limit={8}
			/>
			<EditorialBanner />
			<StoryStrip />
			<UgcCarousel />
			<Newsletter />
		</>
	);
}
