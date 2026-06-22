import type { Metadata } from "next";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { FounderStory } from "@/components/sections/founder-story";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { LifestyleBand } from "@/components/sections/lifestyle-band";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductDetailGrid } from "@/components/sections/product-detail-grid";
import { ProductGrid } from "@/components/sections/product-grid";
import { Testimonials } from "@/components/sections/testimonials";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main className="bg-background">
			<Hero />
			<HowItWorks />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="The collection"
				description="A small line of objects designed to make the loudest device in your house quieter."
				limit={6}
			/>
			<LifestyleBand />
			<PressStrip />
			<Testimonials />
			<FounderStory />
			<ProductDetailGrid />
			<FaqAccordion />
			<Newsletter />
		</main>
	);
}
