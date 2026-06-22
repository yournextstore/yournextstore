import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Flavors } from "@/components/sections/flavors";
import { Hero } from "@/components/sections/hero";
import { HowToEnjoy } from "@/components/sections/how-to-enjoy";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";

function FlavorsSkeleton() {
	return (
		<section className="bg-cream py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={`flavor-skel-${i}`} className="aspect-square rounded-full bg-secondary animate-pulse" />
				))}
			</div>
		</section>
	);
}

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Marquee />
			<Hero />
			<Marquee tone="dark" />
			<Suspense fallback={<FlavorsSkeleton />}>
				<Flavors />
			</Suspense>
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="The good stuff" eyebrow="Featured" limit={6} />
			<HowToEnjoy />
			<Press />
			<About />
			<Newsletter />
		</main>
	);
}
