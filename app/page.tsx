import type { Metadata } from "next";
import { Benefits } from "@/components/sections/benefits";
import { Hero } from "@/components/sections/hero";
import { IngredientStory } from "@/components/sections/ingredient-story";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { Reviews } from "@/components/sections/reviews";
import { SubscribeBanner } from "@/components/sections/subscribe-banner";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<Benefits />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid limit={6} />
			<SubscribeBanner />
			<PressStrip />
			<Reviews />
			<IngredientStory />
			<Newsletter />
		</>
	);
}
