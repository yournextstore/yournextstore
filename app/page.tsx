import type { Metadata } from "next";
import { CinematicScrub } from "@/components/sections/cinematic-scrub";
import { FeatureTrio } from "@/components/sections/feature-trio";
import { FinalCTA } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { LifestyleMacro } from "@/components/sections/lifestyle-macro";
import { Newsletter } from "@/components/sections/newsletter";
import { PressMarquee } from "@/components/sections/press-marquee";
import { ProductGrid } from "@/components/sections/product-grid";
import { ProductReveal } from "@/components/sections/product-reveal";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main className="bg-background">
			<Hero />
			<ProductReveal />
			<FeatureTrio />
			<LifestyleMacro />
			<CinematicScrub />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				title="The Edition"
				eyebrow="Now in stock"
				description="A small run, made by hand and carried by quiet hours."
				limit={6}
			/>
			<PressMarquee />
			<FinalCTA />
			<Newsletter />
		</main>
	);
}
