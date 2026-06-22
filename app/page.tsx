import { Suspense } from "react";
import { CinematicScrub } from "@/components/sections/cinematic-scrub";
import { FeatureTrio } from "@/components/sections/feature-trio";
import { FinalCTA } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { LifestyleMacro } from "@/components/sections/lifestyle-macro";
import { Newsletter } from "@/components/sections/newsletter";
import { PressMarquee } from "@/components/sections/press-marquee";
import { ProductGrid } from "@/components/sections/product-grid";
import { ProductReveal } from "@/components/sections/product-reveal";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 sm:py-32">
			<div className="mb-16">
				<div className="h-3 w-32 bg-secondary/60 rounded animate-pulse mb-4" />
				<div className="h-10 w-72 bg-secondary/60 rounded animate-pulse" />
				<div className="mt-3 h-5 w-64 bg-secondary/40 rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary/40 rounded-2xl mb-5 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary/40 rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary/40 rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main className="bg-background">
			<Hero />
			<ProductReveal />
			<FeatureTrio />
			<LifestyleMacro />
			<CinematicScrub />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="The Edition"
					eyebrow="Now in stock"
					description="A small run, made by hand and carried by quiet hours."
					limit={6}
				/>
			</Suspense>
			<PressMarquee />
			<FinalCTA />
			<Newsletter />
		</main>
	);
}
