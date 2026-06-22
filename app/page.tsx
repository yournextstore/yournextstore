import type { Metadata } from "next";
import { Bundle } from "@/components/sections/bundle";
import { FaqHome } from "@/components/sections/faq-home";
import { FlavorFeatures } from "@/components/sections/flavor-features";
import { Hero } from "@/components/sections/hero";
import { Ingredients } from "@/components/sections/ingredients";
import { Newsletter } from "@/components/sections/newsletter";
import { PressMarquee } from "@/components/sections/press-marquee";
import { ProductGrid } from "@/components/sections/product-grid";
import { Testimonials } from "@/components/sections/testimonials";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<FlavorFeatures />
			<Ingredients />
			<Testimonials />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The lineup" limit={6} />
			<Bundle />
			<PressMarquee />
			<FaqHome />
			<Newsletter />
		</>
	);
}
