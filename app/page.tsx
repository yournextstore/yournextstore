import { Suspense } from "react";
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

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-3 w-24 bg-card rounded animate-pulse" />
					<div className="mt-3 h-9 w-64 bg-card rounded animate-pulse" />
					<div className="mt-3 h-5 w-72 bg-card rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-card rounded-2xl mb-5 animate-pulse" />
						<div className="flex justify-between gap-3">
							<div className="h-4 w-1/2 bg-card rounded animate-pulse" />
							<div className="h-4 w-16 bg-card rounded animate-pulse" />
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
			<HowItWorks />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="The collection"
					description="A small line of objects designed to make the loudest device in your house quieter."
					limit={6}
				/>
			</Suspense>
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
