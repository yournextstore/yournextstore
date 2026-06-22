import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CategoryTiles } from "@/components/sections/category-tiles";
import { CommunityGallery } from "@/components/sections/community-gallery";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Featured Plushies"
				eyebrow="Just landed"
				description="Brand new cuddly friends, fresh off the workshop bench."
				limit={8}
			/>
			<Suspense>
				<CategoryTiles />
			</Suspense>
			<PromoBanner />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="New on the shelf"
				eyebrow="Spring arrivals"
				description="Hot off the cutting table — pet, pat and pre-order before they hop away."
				limit={4}
				showViewAll={false}
				background="cream"
			/>
			<PressStrip />
			<CommunityGallery />
			<About />
			<Newsletter />
		</>
	);
}
