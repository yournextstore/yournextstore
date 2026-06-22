import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Flavors } from "@/components/sections/flavors";
import { Hero } from "@/components/sections/hero";
import { HowToEnjoy } from "@/components/sections/how-to-enjoy";
import { Marquee } from "@/components/sections/marquee";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-8 w-48 bg-secondary rounded animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-[2rem] mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

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

export default function Home() {
	return (
		<main>
			<Marquee />
			<Hero />
			<Marquee tone="dark" />
			<Suspense fallback={<FlavorsSkeleton />}>
				<Flavors />
			</Suspense>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The good stuff" eyebrow="Featured" limit={6} />
			</Suspense>
			<HowToEnjoy />
			<Press />
			<About />
			<Newsletter />
		</main>
	);
}
