import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { CertificationsMarquee } from "@/components/sections/certifications-marquee";
import { Hero } from "@/components/sections/hero";
import { IngredientSpotlight } from "@/components/sections/ingredient-spotlight";
import { Newsletter } from "@/components/sections/newsletter";
import { PressBar } from "@/components/sections/press-bar";
import { ProductGrid } from "@/components/sections/product-grid";
import { RecipeInspiration } from "@/components/sections/recipe-inspiration";
import { Testimonials } from "@/components/sections/testimonials";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<CertificationsMarquee />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Shop the seasoning shelf" limit={3} />
			<About />
			<IngredientSpotlight />
			<PressBar />
			<Testimonials />
			<RecipeInspiration />
			<Newsletter />
		</>
	);
}
