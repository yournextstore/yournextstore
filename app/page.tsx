import type { Metadata } from "next";
import { Suspense } from "react";
import { CareCategories } from "@/components/sections/care-categories";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanners } from "@/components/sections/promo-banners";
import { Spotlight } from "@/components/sections/spotlight";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Suspense>
				<CareCategories />
			</Suspense>
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Today's best deals for you" limit={8} />
			<PromoBanners />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="Healthy Food Collection"
				description="Nutrition for every age — baby food, supplements, and pediatric formulas."
				limit={4}
				viewAllLabel="See all"
			/>
			<Spotlight />
			<Newsletter />
		</>
	);
}
